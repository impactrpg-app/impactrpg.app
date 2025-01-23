<script lang="ts" setup>
import Router from "../router";
import { computed, ref } from "vue";
import { MenuItem } from "primevue/menuitem";
import { useToast } from "primevue/usetoast";
import { goods, GoodsType } from "../data/goods";
import {
  Character,
  CharacterGearItem,
  CharacterSkill,
  NewCharacter,
  NewGearItem,
  NewSkill,
} from "../data/character";
import {
  Menubar,
  Divider,
  FloatLabel,
  InputText,
  InputNumber,
  Knob,
  Card,
  Button,
  Dialog,
  Select,
  Textarea,
  useConfirm,
  ProgressBar,
} from "primevue";
import { Skill, skills } from "../data/skills";
import { loadFromFile, saveToFile } from "../service/io";
import { Age, ages } from "../data/age";
import AutoCompleteDropdown from '../components/AutoCompleteDropdownComponent.vue';
import DiceRollerComponent from "../components/DiceRollerComponent.vue";
import { personalities } from "../data/personality";
import { injuryEffects } from "../data/injury";
import { weapons } from "../data/weapons";
import { armors } from "../data/armor";

const toast = useToast();
const confirm = useConfirm();

function getRandomNumber(max: number) {
  return Math.floor(Math.random() * max);
}
const menuItems: MenuItem[] = [
  {
    label: "back",
    icon: "pi pi-chevron-left",
    command: () => {
      Router.push("/");
    },
  },
  {
    label: "load",
    icon: "pi pi-upload",
    command: async () => {
      const character = await loadFromFile();
      if (character) {
        selectedCharacter.value = { ...JSON.parse(character) };
        toast.add({
          severity: "info",
          summary: "Character Uploaded",
          detail: "Character sheet has been updated with the file you provided",
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Character Upload Failed",
          detail: "Failed to update character sheet",
          life: 3000,
        });
      }
    },
  },
  {
    label: "save",
    icon: "pi pi-download",
    command: () => {
      saveToFile(
        selectedCharacter.value.info.name ?? "character",
        JSON.stringify(selectedCharacter.value)
      );
      toast.add({
        severity: "info",
        summary: "Download Started",
        detail: "Your browser should start downloading the character",
        life: 3000,
      });
    },
  },
  {
    label: "roll dice",
    icon: "pi pi-sparkles",
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
    label: 'Randomize',
    icon: 'pi pi-refresh',
    command: () => {
      selectedCharacter.value.info.age = ages[getRandomNumber(ages.length)].name;
      selectedCharacter.value.info.personality = personalities[getRandomNumber(personalities.length)].name;
      const stats = [0, 0, 0];
      const availablePoints = 6;
      for (let i = 0; i < availablePoints; i++) {
        let randomStat = getRandomNumber(stats.length);
        while(stats[randomStat] + 1 > 3) {
          randomStat = getRandomNumber(stats.length);
        }
        stats[randomStat]++;
      }
      const [strength, agility, intelligence] = stats;
      selectedCharacter.value.abilities.strength = strength;
      selectedCharacter.value.abilities.agility = agility;
      selectedCharacter.value.abilities.intelligence = intelligence;
      selectedCharacter.value.resources.endurance = agility + 10;

      const skill = skills[getRandomNumber(skills.length)];
      selectedCharacter.value.skills = [
        { name: skill.name, description: skill.description.join('\n\n') }
      ];
      
      selectedCharacter.value.gear = [];
      let totalGearAmount = 0;
      while(totalGearAmount < 4) {
        switch(getRandomNumber(3)) {
          case 0: // weapon
            const weapon = weapons[getRandomNumber(weapons.length)];
            if (weapon.size === GoodsType.Large)
              totalGearAmount += 2;
            else
              totalGearAmount++;
            selectedCharacter.value.gear.push({
              ...weapon,
              type: weapon.size
            });
            break;
          case 1: // armor
            const armor = armors[getRandomNumber(armors.length)];
            if (armor.size === GoodsType.Large)
              totalGearAmount += 2;
            else
              totalGearAmount++;
            selectedCharacter.value.gear.push({
              ...armor,
              type: armor.size
            });
            break;
          case 2: // goods
            const good = goods[getRandomNumber(goods.length)];
            if (good.size === GoodsType.Large)
              totalGearAmount += 2;
            else
              totalGearAmount++;
            selectedCharacter.value.gear.push({
              ...good,
              type: good.size,
              description: good.description.join('\n\n'),
            });
            break;
        }
      }
    }
  }
];
const selectedCharacter = ref<Character>({ ...NewCharacter });

// dice roller
const isDiceRollerOpen = ref<boolean>(false);

//image
async function updateCharacterImage() {
  const data = await loadFromFile();
  if (data === null) return;
  selectedCharacter.value.info.image = `data:image/png;base64,${btoa(data)}`;
}

const ageOptions = ref<Age[]>(ages);

// notes
const showNotesEditor = ref<boolean>(false);

// gear
const editingGear = ref<CharacterGearItem>({ ...NewGearItem });
const showGearEditor = ref<boolean>(false);
const existingGearIndex = ref<number>(-1);
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

// progression
const progressionPercent = computed(() => Math.round((selectedCharacter.value.progression / 6) * 100.0))
function updateCharacterProgression(newVal: number) {
  selectedCharacter.value.progression = Math.min(Math.max(newVal, 0), 6);
}

// skills
const editingSkill = ref<CharacterSkill>({ ...NewSkill });
const showSkillEditor = ref<boolean>(false);
const existingSkillIndex = ref<number>(-1);
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
    <Menubar :model="menuItems" style="min-width: 100%; justify-content: center" />
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
      <div class="knob-field">
        <Knob v-model="selectedCharacter.abilities.strength" :size="150" :min="0" :max="5" />
        <span>Strength</span>
      </div>
      <div class="knob-field">
        <Knob v-model="selectedCharacter.abilities.agility" :size="150" :min="0" :max="5" />
        <span>Agility</span>
      </div>
      <div class="knob-field">
        <Knob v-model="selectedCharacter.abilities.intelligence" :size="150" :min="0" :max="5" />
        <span>Intelligence</span>
      </div>
    </div>
    <div class="row">
      <div class="knob-field">
        <Knob v-model="selectedCharacter.resources.mana" :min="0" :max="20" value-color="var(--p-blue-200)" />
        <span>Mana</span>
      </div>
      <div class="knob-field">
        <Knob v-model="selectedCharacter.resources.endurance" :min="0" :max="20" value-color="var(--p-amber-200)" />
        <span>Endurance</span>
      </div>
      <div class="knob-field">
        <Knob v-model="selectedCharacter.resources.corruption" :min="0" :max="10" value-color="var(--p-fuchsia-200)" />
        <span>Corruption</span>
      </div>
      <div class="knob-field">
        <Knob v-model="selectedCharacter.resources.wounds" :min="0" :max="10" value-color="var(--p-red-300)" />
        <span>Wounds</span>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <h4>PROGRESSION</h4>
        <div class="row" style="align-items: center;">
          <Button variant="text" @click="updateCharacterProgression(selectedCharacter.progression - 1)">-</Button>
          <ProgressBar class="progression" :value="progressionPercent"></ProgressBar>
          <Button variant="text" @click="updateCharacterProgression(selectedCharacter.progression + 1)">+</Button>
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
.progression {
  flex-grow: 1;
}

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

.field {
  display: flex;
  flex-direction: column;
  overflow: none !important;
  margin-top: 20px;
  flex-grow: 1;
  gap: 5px;

  &.no-margin {
    margin-top: 0;
  }

  input {
    font-size: 24px;
    width: 100%;
  }
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

  .knob-field {
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      text-transform: uppercase;
      font-size: 18px;
      font-weight: bold;
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
