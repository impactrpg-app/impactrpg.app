<script lang="ts" setup>
import { Button, Divider } from "primevue";
import * as Tabletop from "../service/tabletop";
import { ref, onMounted } from "vue";

function getToolModule() {
  const cameraEntity = Tabletop.Entity.findWithTag("Camera");
  if (!cameraEntity) return null;
  const tool = cameraEntity.getModule<Tabletop.BaseTool>("Module::Tool");
  return tool ?? null;
}

onMounted(async () => {
  const tool = getToolModule();
  if (tool) {
    selectedToolName.value = tool.name;
  }
});

const ALL_TOOLS: Tabletop.BaseTool[] = [
  new Tabletop.MoveTool(),
  new Tabletop.DrawTool(),
];
const selectedToolName = ref<string | null>(null);
const props = defineProps<{
  isCharactersOpen: boolean;
  isEncountersOpen: boolean;
  isRulebookOpen: boolean;
}>();

const emits = defineEmits<{
  (e: "update:isCharactersOpen", value: boolean): void;
  (e: "update:isEncountersOpen", value: boolean): void;
  (e: "update:isRulebookOpen", value: boolean): void;
  (e: "uploadImage"): void;
  (e: "generateImage"): void;
}>();

function changeTool(tool: Tabletop.BaseTool) {
  const module = getToolModule();
  if (module) {
    module.entity.updateModule(tool);
    selectedToolName.value = tool.name;
  }
}

async function rollDice() {}
</script>

<template>
  <div class="tools">
    <Button
      :variant="!props.isCharactersOpen ? 'outlined' : undefined"
      class="rounded-button"
      icon="pi pi-user"
      v-tooltip.top="'Character Sheet'"
      @click="emits('update:isCharactersOpen', !props.isCharactersOpen)"
    />
    <Button
      class="rounded-button"
      v-tooltip.top="'Roll Dice'"
      @click="rollDice"
    >
      <template #icon>
        <span class="material-symbols-outlined">casino</span>
      </template>
    </Button>
    <Button
      :variant="!props.isEncountersOpen ? 'outlined' : undefined"
      class="rounded-button"
      icon="pi pi-eye"
      v-tooltip.top="'Encounters'"
      @click="emits('update:isEncountersOpen', !props.isEncountersOpen)"
    />
    <Button
      :variant="!props.isRulebookOpen ? 'outlined' : undefined"
      class="rounded-button"
      icon="pi pi-align-justify"
      v-tooltip.top="'Rulebook'"
      @click="emits('update:isRulebookOpen', !props.isRulebookOpen)"
    />
    <!-- <Button
      variant="outlined"
      class="rounded-button"
      icon="pi pi-sign-out"
      v-tooltip.top="'Leave Room'"
      @click="TabletopService.leaveRoomRequest()"
    /> -->
    <Divider layout="vertical" />
    <Button
      variant="outlined"
      class="rounded-button"
      icon="pi pi-upload"
      v-tooltip.top="'Upload Image'"
      @click="emits('uploadImage')"
    />
    <Button
      variant="outlined"
      class="rounded-button"
      icon="pi pi-search"
      v-tooltip.top="'Generate Image'"
      @click="emits('generateImage')"
    />
    <Divider layout="vertical" />
    <template v-for="tool in ALL_TOOLS">
      <Button
        :variant="selectedToolName !== tool.name ? 'outlined' : undefined"
        class="rounded-button"
        :icon="tool.icon"
        v-tooltip.top="tool.name"
        @click="changeTool(tool)"
      />
    </template>
  </div>
</template>

<style lang="css" scoped>
.tools {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  z-index: 5000;
  padding: 10px 15px;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  border-radius: 50px;
  border: 0;

  .rounded-button {
    border-radius: 50%;
  }

  .search-input {
    border-radius: 20px;
    min-width: 400px;
  }
}
</style>
