<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { MenuItem } from "primevue/menuitem";
import { useToast } from "primevue/usetoast";
import { GoodsType } from "../data/goods";
import {
  Character,
  CharacterGearItem,
  CharacterSkill,
  NewCharacter,
  NewGearItem,
  NewSkill,
} from "../data/character";
import {
  FloatLabel,
  InputText,
  InputNumber,
  Card,
  Button,
  Dialog,
  Select,
  Textarea,
  useConfirm,
} from "primevue";
import { Skill, skills } from "../data/skills";
import { loadFromFile } from "../service/io";
import { Age, ages } from "../data/age";
import AutoCompleteDropdown from '../components/AutoCompleteDropdownComponent.vue';
import DiceRollerComponent from "../components/DiceRollerComponent.vue";
import { personalities } from "../data/personality";
import { injuryEffects } from "../data/injury";
import CustomRatingComponent from "../components/CustomRatingComponent.vue";
import CustomResourceComponent from "../components/CustomResourceComponent.vue";
import CustomMenuBar from "../components/CustomMenuBar.vue";
import { supabaseClient } from "../service/supabase";
import { useRoute, useRouter } from "vue-router";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const selectedCharacterId = ref<number>(-1);
const selectedCharacter = ref<Character>({ ...NewCharacter });
const showNotesEditor = ref<boolean>(false);
const isDiceRollerOpen = ref<boolean>(false);

// gear
const editingGear = ref<CharacterGearItem>({ ...NewGearItem });
const showGearEditor = ref<boolean>(false);
const existingGearIndex = ref<number>(-1);
// skill
const editingSkill = ref<CharacterSkill>({ ...NewSkill });
const showSkillEditor = ref<boolean>(false);
const existingSkillIndex = ref<number>(-1);
const ageOptions = ref<Age[]>(ages);
const autoSaveInterval = ref<NodeJS.Timeout | null>(null);

onMounted(async () => {
  const characterId = Number(route.params['characterId']);
  if (!characterId || isNaN(characterId)) {
    throw new Error('character id not found');
  }
  selectedCharacterId.value = characterId;
  const query = await supabaseClient.from('character').select('data').eq('id', characterId).single();
  if (query.data !== null)
    selectedCharacter.value = query.data.data as Character;

  autoSaveInterval.value = setInterval(saveCharacter, 60_000);
});

onUnmounted(() => {
  if (autoSaveInterval.value)
    clearInterval(autoSaveInterval.value);
});


const menuItems: MenuItem[] = [
  {
    label: "Save",
    icon: "pi pi-save",
    command: async () => {
      saveCharacter();
    },
  },
  {
    label: "Roll Dice",
    icon: "casino",
    command: () => {
      isDiceRollerOpen.value = true;
    },
  },
  {
    label: "Notes",
    icon: "pi pi-book",
    command: () => {
      showNotesEditor.value = true;
    },
  },
  {
    label: 'Delete this character',
    icon: 'pi pi-trash',
    command: async () => {
      const query = await supabaseClient.from('character').delete().eq('id', selectedCharacterId.value);
      router.push('/characters');
      console.log(query.data);
    }
  }
];

// gear
function createNewGearItem() {
  editingGear.value = {
    ...NewGearItem,
  };
  existingGearIndex.value = -1;
  showGearEditor.value = true;
}
function editExistingGearItem(item: CharacterGearItem, index: number) {
  editingGear.value = {
    ...item,
  };
  existingGearIndex.value = index;
  showGearEditor.value = true;
}
function deleteExistingGearItem(index: number) {
  confirm.require({
    message: `Do you want to remove ${selectedCharacter.value.gear[index].name} from your gear?`,
    header: "Remove Gear",
    icon: "pi pi-info-circle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      selectedCharacter.value = {
        ...selectedCharacter.value,
        gear: [
          ...selectedCharacter.value.gear.slice(0, index),
          ...selectedCharacter.value.gear.slice(
            index + 1,
            selectedCharacter.value.gear.length
          ),
        ],
      };
    },
  });
}
function finishEditingGearItem() {
  showGearEditor.value = false;
  if (editingGear.value.attack === 0) editingGear.value.attack = undefined;
  if (editingGear.value.armor === 0) editingGear.value.armor = undefined;

  if (existingGearIndex.value === -1) {
    selectedCharacter.value = {
      ...selectedCharacter.value,
      gear: [...selectedCharacter.value.gear, { ...editingGear.value }],
    };
  } else {
    const existingGear = [...selectedCharacter.value.gear];
    existingGear[existingGearIndex.value] = { ...editingGear.value };
    selectedCharacter.value = {
      ...selectedCharacter.value,
      gear: [...existingGear],
    };
  }
}
// skills
function createSkill() {
  editingSkill.value = { ...NewSkill };
  existingSkillIndex.value = -1;
  showSkillEditor.value = true;
}
function editExistingSkill(skill: CharacterSkill, index: number) {
  editingSkill.value = {
    ...skill,
  };
  existingSkillIndex.value = index;
  showSkillEditor.value = true;
}
function deleteExistingSkill(index: number) {
  confirm.require({
    message: `Do you want to remove ${selectedCharacter.value.skills[index].name} from your skills?`,
    header: "Remove Skill",
    icon: "pi pi-info-circle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      selectedCharacter.value = {
        ...selectedCharacter.value,
        skills: [
          ...selectedCharacter.value.skills.slice(0, index),
          ...selectedCharacter.value.skills.slice(
            index + 1,
            selectedCharacter.value.skills.length
          ),
        ],
      };
    },
  });
}
function finishEditingSkill() {
  showSkillEditor.value = false;
  if (existingSkillIndex.value === -1) {
    selectedCharacter.value = {
      ...selectedCharacter.value,
      skills: [...selectedCharacter.value.skills, { ...editingSkill.value }],
    };
  } else {
    const existingSkils = selectedCharacter.value.skills;
    existingSkils[existingSkillIndex.value] = { ...editingSkill.value };
    selectedCharacter.value = {
      ...selectedCharacter.value,
      skills: existingSkils,
    };
  }
}
function skillSelectedFromDropdown(skill: Skill) {
  editingSkill.value = {
    name: skill.name,
    description: skill.description.join("\n"),
  };
}
//image
async function updateCharacterImage() {
  const data = await loadFromFile();
  if (data === null) return;
  selectedCharacter.value.info.image = `data:image/png;base64,${btoa(data)}`;
}
async function saveCharacter() {
  const character = selectedCharacter.value;
  const query = await supabaseClient.from('character').update({
    image: character.info.image,
    name: character.info.name,
    data: character
  }).eq('id', selectedCharacterId.value);
  if (query.error === null) {
    toast.add({
      severity: 'success',
      summary: 'Saved Character',

    });
  } else {
    toast.add({
      severity: 'error',
      summary: 'Failed to save character'
    })
  }
}
</script>

<template>
  <DiceRollerComponent v-model:is-open="isDiceRollerOpen" />
  <Dialog modal v-model:visible="showGearEditor" header="Gear" :style="{ width: '650px' }">
    <div class="dialog-content">
      <FloatLabel variant="on" class="field">
        <InputText id="gear-name" v-model="editingGear.name" />
        <label for="gear-name">Gear Name</label>
      </FloatLabel>
      <div class="field no-margin">
        <label class="field-label"> Goods Type </label>
        <Select v-model="editingGear.type" :options="Object.values(GoodsType)" />
      </div>
      <FloatLabel class="field">
        <InputNumber id="gear-attack" v-model="editingGear.attack" />
        <label for="gear-attack">Attack</label>
      </FloatLabel>
      <FloatLabel class="field">
        <InputNumber id="gear-armor" v-model="editingGear.armor" />
        <label for="gear-armor">Armor</label>
      </FloatLabel>
      <div class="field no-margin">
        <label class="field-label"> Description </label>
        <Textarea style="height: 100px; resize: vertical" v-model="editingGear.description" />
      </div>
      <div class="dialog-buttons">
        <Button variant="text" label="Cancel" @click="() => (showGearEditor = false)" />
        <Button :label="existingGearIndex !== -1 ? 'Save' : 'Create'" @click="finishEditingGearItem()" />
      </div>
    </div>
  </Dialog>
  <Dialog modal v-model:visible="showSkillEditor" header="Skill" :style="{ width: '650px' }">
    <div class="dialog-content">
      <div class="field no-margin">
        <label class="field-label"> Predefined Skills </label>
        <Select :options="skills" option-label="name" @value-change="skillSelectedFromDropdown" />
      </div>
      <FloatLabel class="field">
        <InputText id="skill-name" v-model="editingSkill.name" />
        <label for="skill-name">Skill Name</label>
      </FloatLabel>
      <div class="field no-margin">
        <label class="field-label"> Description </label>
        <Textarea style="height: 300px; resize: vertical" v-model="editingSkill.description" />
      </div>
      <div class="dialog-buttons">
        <Button variant="text" label="Cancel" @click="() => (showSkillEditor = false)" />
        <Button :label="existingGearIndex !== -1 ? 'Save' : 'Create'" @click="finishEditingSkill()" />
      </div>
    </div>
  </Dialog>
  <Dialog modal v-model:visible="showNotesEditor" header="Notes" :style="{ width: '650px' }">
    <div class="dialog-content">
      <Textarea v-model="selectedCharacter.notes" style="resize: vertical; min-height: 500px" />
    </div>
  </Dialog>
  <div class="character-sheet">
    <CustomMenuBar :items="menuItems" />
    <div class="row">
      <div class="column" style="width: 270px; flex-shrink: 1; flex-grow: 0; flex-basis: 270px">
        <div :style="{
          width: '270px',
          height: '270px',
          borderRadius: '10px',
          background: `url('${selectedCharacter.info.image}')`,
          backgroundColor: 'var(--p-stone-700)',
          backgroundSize: 'auto 100%',
          boxShadow: '0 0 5px 1px var(--p-stone-950)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
        }" @click="updateCharacterImage">
          <i class="pi pi-image" v-if="selectedCharacter.info.image === ''"></i>
        </div>
      </div>
      <div class="column" style="
          flex-grow: 1;
          flex-shrink: 0;
          flex-basis: calc(100% - 300);
          align-items: flex-start;
        ">
        <FloatLabel class="field" style="width: 100%">
          <InputText id="character-name" v-model="selectedCharacter.info.name"  />
          <label for="character-name">Character Name</label>
        </FloatLabel>
        <div class="row">
          <FloatLabel class="field" style="width: 10px">
            <AutoCompleteDropdown
              id="character-age"
              v-model="selectedCharacter.info.age"
              :suggestions="ageOptions"
              option-label="name"
            />
            <label for="character-age">Age</label>
          </FloatLabel>
          <FloatLabel class="field" style="width: 120px">
            <AutoCompleteDropdown
              id="character-personality"
              v-model="selectedCharacter.info.personality"
              :suggestions="personalities"
              option-label="name"
            />
            <label for="character-personality">Personality</label>
          </FloatLabel>
        </div>
        <FloatLabel class="field" style="width: 100%">
          <AutoCompleteDropdown
            id="character-injury"
            v-model="selectedCharacter.resources.injury"
            :suggestions="injuryEffects"
            option-label="name"
          />
          <label for="character-injury">Injury</label>
        </FloatLabel>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <div class="stat">
          <span>Strength</span>
          <CustomRatingComponent material-icons icon="swords" :stars="6" v-model="selectedCharacter.abilities.strength" />
        </div>
        <div class="stat">
          <span>Agility</span>
          <CustomRatingComponent icon="pi-bolt" :stars="6" v-model="selectedCharacter.abilities.agility" />
        </div>
        <div class="stat">
          <span>Intelligence</span>
          <CustomRatingComponent material-icons icon="neurology" :stars="6" v-model="selectedCharacter.abilities.intelligence" />
        </div>
        <div class="stat">
          <span>Progression</span>
          <CustomRatingComponent icon="pi-sparkles" :stars="6" v-model="selectedCharacter.progression" />
        </div>
      </div>
      <div class="column">
        <div class="stat">
          <span>Endurance</span>
          <CustomResourceComponent v-model:model-value="selectedCharacter.resources.endurance" :min="0" :max="20" />
        </div>
        <div class="stat">
          <span>Wounds</span>
          <CustomResourceComponent v-model:model-value="selectedCharacter.resources.wounds" :min="0" />
        </div>
        <div class="stat">
          <span>Mana</span>
          <CustomResourceComponent v-model:model-value="selectedCharacter.resources.mana" :min="0" />
        </div>
        <div class="stat">
          <span>Corruption</span>
          <CustomResourceComponent v-model:model-value="selectedCharacter.resources.corruption" :min="0" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <h4>GEAR</h4>
        <Card v-for="(gear, index) in selectedCharacter.gear" class="card">
          <template #title>
            <div class="tools">
              <div>
                <Button icon="pi pi-pencil" variant="text" @click="editExistingGearItem(gear, index)" />
                <Button icon="pi pi-trash" variant="text" @click="deleteExistingGearItem(index)" />
              </div>
            </div>
            <h3 style="width: calc(100% - 60px); min-height: 100px">{{ gear.name }}</h3>
          </template>
          <template #content>
            <div class="gear-content">
              <div>
                <h6 style="color: var(--p-lime-200)">Type: {{ gear.type }}</h6>
              </div>
              <div v-if="gear.attack">
                <h6 style="color: var(--p-lime-200)">
                  Attack: {{ gear.attack }}
                  <span v-if="gear.isAutomaton" v-tooltip.bottom="'Do not add your strength when attacking with this weapon'
                    " style="cursor: default">*</span>
                </h6>
              </div>
              <div v-if="gear.armor">
                <h6 style="color: var(--p-lime-200)">Armor: {{ gear.armor }}</h6>
              </div>
              <div>
                <p>
                  {{ gear.description }}
                </p>
              </div>
            </div>
          </template>
        </Card>
        <Button icon="pi pi-plus" style="border-radius: 100%; margin-top: 10px" @click="createNewGearItem" />
      </div>
      <div class="column">
        <h4>SKILLS</h4>
        <Card v-for="(skill, index) in selectedCharacter.skills" class="card">
          <template #title>
            <div class="tools">
              <div>
                <Button icon="pi pi-pencil" variant="text" @click="editExistingSkill(skill, index)" />
                <Button icon="pi pi-trash" variant="text" @click="deleteExistingSkill(index)" />
              </div>
            </div>
            <h3 style="width: calc(100% - 60px); min-height: 100px">{{ skill.name }}</h3>
          </template>
          <template #content>
            <p>{{ skill.description }}</p>
          </template>
        </Card>
        <Button icon="pi pi-plus" style="border-radius: 100%; margin-top: 10px" @click="createSkill" />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .dialog-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
}

.field-label {
  color: var(--p-floatlabel-active-color);
  font-size: 12px;
  margin-left: 15px;
  font-weight: normal;
}

.character-sheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 655px;

  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: start;
    justify-content: space-between;
    gap: 10px;
    width: 100%;

    .column {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 20px;
      flex-grow: 1;
      flex-basis: calc(50% - 30px);

      .card {
        width: 100%;
        border-radius: 10px;
      }
    }
  }

  .stat {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;

    span {
      width: 140px;
    }
  }
}

.tools {
  display: block;
  position: relative;
  width: 100%;

  div {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: -10px;
    right: 0;
  }
}

.gear-content {
  display: flex;
  flex-direction: column;
  gap: 10px;

  div {
    text-transform: capitalize;
  }
}
</style>
<style lang="css">
.p-menubar-root-list {
  width: max-content;
  flex-direction: row;
}

.p-menubar-item-label {
  text-transform: uppercase;
  font-size: 16px;
}

.field {
  span {
    width: 100%;

    input {
      font-size: 24px;
      width: 100%;
    }
  }
}
</style>
