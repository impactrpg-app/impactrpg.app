<script lang="ts" setup>
import Router from "../router";
import { ref } from "vue";
import { MenuItem } from "primevue/menuitem";
import { useToast } from "primevue/usetoast";
import { GoodsType } from "../data/goods";
import { Character, CharacterGearItem, CharacterSkill, NewCharacter, NewGearItem, NewSkill } from "../data/character";
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
  useConfirm
} from "primevue";

const toast = useToast();
const confirm = useConfirm()

const menuItems: MenuItem[] = [
  {
    label: "back",
    icon: "pi pi-chevron-left",
    command: () => {
      Router.push("/");
    },
  },
  {
    label: "upload",
    icon: "pi pi-upload",
    command: () => { },
  },
  {
    label: "download",
    icon: "pi pi-download",
    command: () => {
      toast.add({
        severity: "info",
        summary: "Download Started",
        detail: "Your browser should start downloading the character sheet",
        life: 3000,
      });
    },
  },
  {
    label: "roll dice",
    icon: "pi pi-sparkles",
    command: () => { },
  },
  {
    label: "Notes",
    icon: "pi pi-book",
    command: () => { },
  },
];
const selectedCharacter = ref<Character>({ ...NewCharacter });

// gear
const editingGear = ref<CharacterGearItem>({ ...NewGearItem });
const showGearEditor = ref<boolean>(false);
const existingGearIndex = ref<number>(-1);
function createNewGearItem() {
  editingGear.value = {
    ...NewGearItem
  };
  existingGearIndex.value = -1;
  showGearEditor.value = true;
}
function editExistingGearItem(item: CharacterGearItem, index: number) {
  editingGear.value = {
    ...item
  };
  existingGearIndex.value = index;
  showGearEditor.value = true;
}
function deleteExistingGearItem(index: number) {
  confirm.require({
    message: `Do you want to remove ${selectedCharacter.value.gear[index].name} from your gear?`,
    header: 'Remove Gear',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: 'danger',
    },
    accept: () => {
      selectedCharacter.value = {
        ...selectedCharacter.value,
        gear: [
          ...selectedCharacter.value.gear.slice(0, index),
          ...selectedCharacter.value.gear.slice(index + 1, selectedCharacter.value.gear.length)
        ]
      };
    }
  })

}
function finishEditingGearItem() {
  showGearEditor.value = false;
  if (editingGear.value.attack === 0)
    editingGear.value.attack = undefined;
  if (editingGear.value.armor === 0)
    editingGear.value.armor = undefined;

  if (existingGearIndex.value === -1) {
    selectedCharacter.value = {
      ...selectedCharacter.value,
      gear: [
        ...selectedCharacter.value.gear,
        { ...editingGear.value }
      ]
    }
  } else {
    const existingGear = [...selectedCharacter.value.gear];
    existingGear[existingGearIndex.value] = { ...editingGear.value };
    selectedCharacter.value = {
      ...selectedCharacter.value,
      gear: [
        ...existingGear
      ]
    }
  }
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
    ...skill
  };
  existingSkillIndex.value = index;
  showSkillEditor.value = true;
}
function deleteExistingSkill(index: number) {
  confirm.require({
    message: `Do you want to remove ${selectedCharacter.value.skills[index].name} from your skills?`,
    header: 'Remove Skill',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      selectedCharacter.value = {
        ...selectedCharacter.value,
        skills: [
          ...selectedCharacter.value.skills.slice(0, index),
          ...selectedCharacter.value.skills.slice(index + 1, selectedCharacter.value.skills.length)
        ]
      };
    }
  })
}
function finishEditingSkill() {
  showSkillEditor.value = false;
  if (existingSkillIndex.value === -1) {
    selectedCharacter.value = {
      ...selectedCharacter.value,
      skills: [
        ...selectedCharacter.value.skills,
        { ...editingSkill.value }
      ]
    };
  } else {
    const existingSkils = selectedCharacter.value.skills;
    existingSkils[existingSkillIndex.value] = { ...editingSkill.value };
    selectedCharacter.value = {
      ...selectedCharacter.value,
      skills: existingSkils
    };
  }
}
</script>

<template>
  <Dialog modal v-model:visible="showGearEditor" header="Gear" :style="{ width: '650px' }">
    <div class="dialog-content">
      <FloatLabel class="field">
        <InputText id="gear-name" v-model="editingGear.name" />
        <label for="gear-name">Gear Name</label>
      </FloatLabel>
      <label class="field-label">
        Goods Type
      </label>
      <Select v-model="editingGear.type" :options="Object.values(GoodsType)" />
      <FloatLabel class="field">
        <InputNumber id="gear-attack" v-model="editingGear.attack" />
        <label for="gear-attack">Attack</label>
      </FloatLabel>
      <FloatLabel class="field">
        <InputNumber id="gear-armor" v-model="editingGear.armor" />
        <label for="gear-armor">Armor</label>
      </FloatLabel>
      <div class="field no-margin">
        <label class="field-label">
          Description
        </label>
        <Textarea style="height: 100px; resize: vertical;" v-model="editingGear.description" />
      </div>
      <div class="dialog-buttons">
        <Button variant="text" label="Cancel" @click="() => showGearEditor = false" />
        <Button :label="existingGearIndex !== -1 ? 'Save' : 'Create'" @click="finishEditingGearItem()" />
      </div>
    </div>
  </Dialog>
  <Dialog modal v-model:visible="showSkillEditor" header="Skill" :style="{ width: '650px' }">
    <div class="dialog-content">
      <FloatLabel class="field">
        <InputText id="skill-name" v-model="editingSkill.name" />
        <label for="skill-name">Skill Name</label>
      </FloatLabel>
      <div class="field no-margin">
        <label class="field-label">
          Description
        </label>
        <Textarea style="height: 300px; resize: vertical;" v-model="editingSkill.description" />
      </div>
      <div class="dialog-buttons">
        <Button variant="text" label="Cancel" @click="() => showSkillEditor = false" />
        <Button :label="existingGearIndex !== -1 ? 'Save' : 'Create'" @click="finishEditingSkill()" />
      </div>
    </div>
  </Dialog>
  <div class="character-sheet">
    <Menubar :model="menuItems" />
    <div class="row">
      <FloatLabel class="field">
        <InputText id="character-name" v-model="selectedCharacter.info.name" />
        <label for="character-name">Character Name</label>
      </FloatLabel>
      <FloatLabel class="field">
        <InputText id="player-name" v-model="selectedCharacter.info.playerName" />
        <label for="player-name">Player Name</label>
      </FloatLabel>
    </div>
    <div class="row">
      <FloatLabel class="field" style="width: 100px;">
        <InputText id="age" v-model="selectedCharacter.info.age" />
        <label for="age">Age</label>
      </FloatLabel>
      <FloatLabel class="field" style="width: 160px;">
        <InputText id="personality" v-model="selectedCharacter.info.personality" />
        <label for="personality">Personality</label>
      </FloatLabel>
      <FloatLabel class="field">
        <InputText id="injury" v-model="selectedCharacter.resources.injury" />
        <label for="injury">Injury</label>
      </FloatLabel>
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
        <Knob v-model="selectedCharacter.resources.mana" :min="0" :max="20" />
        <span>Mana</span>
      </div>
      <div class="knob-field">
        <Knob v-model="selectedCharacter.resources.endurance" :min="0" :max="20" />
        <span>Endurance</span>
      </div>
      <div class="knob-field">
        <Knob v-model="selectedCharacter.resources.corruption" :min="0" :max="10" />
        <span>Corruption</span>
      </div>
      <div class="knob-field">
        <Knob v-model="selectedCharacter.resources.wounds" :min="0" :max="10" />
        <span>Wounds</span>
      </div>
    </div>
    <Divider />
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
            <h3 style="width: calc(100% - 60px);">{{ gear.name }}</h3>
          </template>
          <template #content>
            <div class="gear-content">
              <div>
                <h6 style="color: var(--p-lime-200);">Type: {{ gear.type }}</h6>
              </div>
              <div v-if="gear.attack">
                <h6 style="color: var(--p-lime-200)">
                  Attack: {{ gear.attack }}
                  <span v-if="gear.isAutomaton"
                    v-tooltip.bottom="'Do not add your strength when attacking with this weapon'"
                    style="cursor: default;">*</span>
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
        <Button icon="pi pi-plus" style="border-radius: 100%; margin-top: 10px;" @click="createNewGearItem" />
      </div>
      <Divider layout="vertical" />
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
            <h3 style="width: calc(100% - 60px);">{{ skill.name }}</h3>
          </template>
          <template #content>
            <p style="margin-top:50px;">{{ skill.description }}</p>
          </template>
        </Card>
        <Button icon="pi pi-plus" style="border-radius: 100%; margin-top: 10px;" @click="createSkill" />
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
  gap: 10px;
  width: 655px;

  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
    width: 100%;

    .column {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
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
#pv_id_1_list {
  width: max-content;
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
