<script lang="ts" setup>
import { computed, ref } from "vue";
import {
  useConfirm,
  Button,
  InputText,
  FloatLabel,
  Select,
  InputNumber,
  Textarea,
  Dialog,
  Card,
} from "primevue";
import { Skill, skills } from "../../data/skills";
import { GoodsType } from "../../data/goods";
import {
  CharacterDto,
  CharacterGearItemDto,
  CharacterSkillDto,
} from "@impact/shared";
import * as TabletopService from "../../service/tabletop";

const NewGearItem: CharacterGearItemDto = {
  name: "",
  type: GoodsType.Small,
  attack: 0,
  armor: 0,
  description: "",
};

const NewSkill: CharacterSkillDto = {
  name: "",
  description: "",
};

const props = defineProps<{
  modelValue: CharacterDto;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", data: CharacterDto): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val: CharacterDto) {
    emits("update:modelValue", val);
  },
});

const confirm = useConfirm();

// gear
const editingGear = ref<CharacterGearItemDto>({ ...NewGearItem });
const showGearEditor = ref<boolean>(false);
const existingGearIndex = ref<number>(-1);
// skill
const editingSkill = ref<CharacterSkillDto>({ ...NewSkill });
const showSkillEditor = ref<boolean>(false);
const existingSkillIndex = ref<number>(-1);

// gear
function createNewGearItem() {
  editingGear.value = {
    ...NewGearItem,
  };
  existingGearIndex.value = -1;
  showGearEditor.value = true;
}
function editExistingGearItem(item: CharacterGearItemDto, index: number) {
  editingGear.value = {
    ...item,
  };
  existingGearIndex.value = index;
  showGearEditor.value = true;
}
function deleteExistingGearItem(index: number) {
  confirm.require({
    message: `Do you want to remove ${value.value.gear[index]?.name ?? ""} from your gear?`,
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
      value.value = {
        ...value.value,
        gear: [
          ...value.value.gear.slice(0, index),
          ...value.value.gear.slice(index + 1, value.value.gear.length),
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
    value.value = {
      ...value.value,
      gear: [...value.value.gear, { ...editingGear.value }],
    };
  } else {
    const existingGear = [...value.value.gear];
    existingGear[existingGearIndex.value] = { ...editingGear.value };
    value.value = {
      ...value.value,
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
function editExistingSkill(skill: CharacterSkillDto, index: number) {
  editingSkill.value = {
    ...skill,
  };
  existingSkillIndex.value = index;
  showSkillEditor.value = true;
}
function deleteExistingSkill(index: number) {
  confirm.require({
    message: `Do you want to remove ${value.value.skills[index]?.name ?? ""} from your skills?`,
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
      value.value = {
        ...value.value,
        skills: [
          ...value.value.skills.slice(0, index),
          ...value.value.skills.slice(index + 1, value.value.skills.length),
        ],
      };
    },
  });
}
function finishEditingSkill() {
  showSkillEditor.value = false;
  if (existingSkillIndex.value === -1) {
    value.value = {
      ...value.value,
      skills: [...value.value.skills, { ...editingSkill.value }],
    };
  } else {
    const existingSkils = value.value.skills;
    existingSkils[existingSkillIndex.value] = { ...editingSkill.value };
    value.value = {
      ...value.value,
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

function gearShareText(gear: CharacterGearItemDto): string {
  let automaton = gear.isAutomaton ? "*" : "";
  let str = `${gear.name}${automaton}, ${gear.type}`;
  if (gear.attack) str += `, Attack: ${gear.attack}`;
  if (gear.armor) str += `, Armor: ${gear.armor}`;
  return str;
}
function skillShareText(skill: CharacterSkillDto): string {
  return `${skill.name}: ${skill.description}`;
}
</script>

<template>
  <Dialog
    modal
    v-model:visible="showGearEditor"
    header="Gear"
    :style="{ width: '650px' }"
  >
    <div class="column gap15">
      <FloatLabel variant="on" class="field">
        <InputText id="gear-name" v-model="editingGear.name" />
        <label for="gear-name">Gear Name</label>
      </FloatLabel>
      <div class="field no-margin">
        <label class="field-label"> Goods Type </label>
        <Select
          v-model="editingGear.type"
          :options="Object.values(GoodsType)"
        />
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
        <Textarea
          style="height: 100px; resize: vertical"
          v-model="editingGear.description"
        />
      </div>
      <div class="dialog-buttons">
        <Button
          variant="text"
          label="Cancel"
          @click="() => (showGearEditor = false)"
        />
        <Button
          :label="existingGearIndex !== -1 ? 'Save' : 'Create'"
          @click="finishEditingGearItem()"
        />
      </div>
    </div>
  </Dialog>
  <Dialog
    modal
    v-model:visible="showSkillEditor"
    header="Skill"
    :style="{ width: '650px' }"
  >
    <div class="column gap15">
      <div class="field no-margin">
        <label class="field-label"> Predefined Skills </label>
        <Select
          :options="skills"
          option-label="name"
          @value-change="skillSelectedFromDropdown"
        />
      </div>
      <FloatLabel class="field">
        <InputText id="skill-name" v-model="editingSkill.name" />
        <label for="skill-name">Skill Name</label>
      </FloatLabel>
      <div class="field no-margin">
        <label class="field-label"> Description </label>
        <Textarea
          style="height: 300px; resize: vertical"
          v-model="editingSkill.description"
        />
      </div>
      <div class="dialog-buttons">
        <Button
          variant="text"
          label="Cancel"
          @click="() => (showSkillEditor = false)"
        />
        <Button
          :label="existingGearIndex !== -1 ? 'Save' : 'Create'"
          @click="finishEditingSkill()"
        />
      </div>
    </div>
  </Dialog>
  <div class="row gap20 w100">
    <div class="column w50 gap15" style="align-items: center">
      <h4>GEAR</h4>
      <Card v-for="(gear, index) in value.gear" class="w100 card">
        <template #title>
          <div class="tools">
            <div>
              <Button
                icon="pi pi-pencil"
                variant="text"
                @click="editExistingGearItem(gear, index)"
                v-tooltip.top="'Edit this item'"
              />
              <Button
                icon="pi pi-trash"
                variant="text"
                @click="deleteExistingGearItem(index)"
                v-tooltip.top="'Delete this item'"
              />
              <Button
                icon="pi pi-share-alt"
                variant="text"
                @click="TabletopService.sendNotification(gearShareText(gear))"
                v-tooltip.top="'Share with others'"
              />
            </div>
          </div>
          <h3>{{ gear.name }}</h3>
        </template>
        <template #content>
          <div class="gear-content">
            <div>
              <h6 style="color: var(--p-lime-200)">Type: {{ gear.type }}</h6>
            </div>
            <div v-if="gear.attack">
              <h6 style="color: var(--p-lime-200)">
                Attack: {{ gear.attack }}
                <span
                  v-if="gear.isAutomaton"
                  v-tooltip.bottom="
                    'Do not add your strength when attacking with this weapon'
                  "
                  style="cursor: default"
                  >*</span
                >
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
      <Button
        icon="pi pi-plus"
        style="border-radius: 100%; margin-top: 10px"
        @click="createNewGearItem"
      />
    </div>
    <div class="column w50 gap15" style="align-items: center">
      <h4>SKILLS</h4>
      <Card v-for="(skill, index) in value.skills" class="w100 card">
        <template #title>
          <div class="tools">
            <div>
              <Button
                icon="pi pi-pencil"
                variant="text"
                @click="editExistingSkill(skill, index)"
                v-tooltip.top="'Edit this skill'"
              />
              <Button
                icon="pi pi-trash"
                variant="text"
                @click="deleteExistingSkill(index)"
                v-tooltip.top="'Delete this skill'"
              />
              <Button
                icon="pi pi-share-alt"
                variant="text"
                @click="TabletopService.sendNotification(skillShareText(skill))"
                v-tooltip.top="'Share with others'"
              />
            </div>
          </div>
          <h3>{{ skill.name }}</h3>
        </template>
        <template #content>
          <p>{{ skill.description }}</p>
        </template>
      </Card>
      <Button
        icon="pi pi-plus"
        style="border-radius: 100%; margin-top: 10px"
        @click="createSkill"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
.gear-content {
  display: flex;
  flex-direction: column;
  gap: 10px;

  div {
    text-transform: capitalize;
  }
}
.card {
  border-radius: 10px;
  box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.3);
}
</style>
