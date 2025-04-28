<script lang="ts" setup>
import { Dialog, Button, Divider } from "primevue";
import { ref } from "vue";

const props = defineProps<{
  isCharactersOpen: boolean;
  isEncountersOpen: boolean;
  isRulebookOpen: boolean;
  isDiceTrayOpen: boolean;
  tools: { name: string; icon: string }[];
}>();
const selectedTool = ref<string>(props.tools[0]?.name ?? "");

const emits = defineEmits<{
  (e: "update:isCharactersOpen", value: boolean): void;
  (e: "update:isEncountersOpen", value: boolean): void;
  (e: "update:isRulebookOpen", value: boolean): void;
  (e: "update:isDiceTrayOpen", value: boolean): void;
  (e: "uploadImage"): void;
  (e: "uploadObject"): void;
  (e: "leaveRoom"): void;
  (e: "changeTool", toolName: string): void;
}>();
function onChangeTool(toolName: string) {
  const tool = props.tools.find((tool) => tool.name === toolName);
  if (tool) {
    emits("changeTool", tool.name);
    selectedTool.value = tool.name;
  }
}
</script>

<template>
  <Dialog
    :visible="true"
    :modal="false"
    :draggable="false"
    :closable="false"
    :resizable="false"
    :show-header="false"
    position="bottom"
    class="tools-dialog"
  >
    <div class="row gap10 tools">
      <Button
        :variant="!props.isCharactersOpen ? 'outlined' : undefined"
        class="rounded-button"
        icon="pi pi-user"
        v-tooltip.top="'Character Sheet'"
        @click="emits('update:isCharactersOpen', !props.isCharactersOpen)"
      />
      <Button
        :variant="!props.isDiceTrayOpen ? 'outlined' : undefined"
        class="rounded-button"
        v-tooltip.top="'Roll Tray'"
        @click="emits('update:isDiceTrayOpen', !props.isDiceTrayOpen)"
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
        v-tooltip.top="'Upload Object'"
        @click="emits('uploadObject')"
      >
        <template #icon>
          <span class="material-symbols-outlined">deployed_code</span>
        </template>
      </Button>
      <Divider layout="vertical" />
      <template v-for="tool in props.tools" :key="tool.name">
        <Button
          :variant="selectedTool !== tool.name ? 'outlined' : undefined"
          :aria-label="tool.name"
          class="rounded-button"
          :icon="tool.icon"
          v-tooltip.top="tool.name"
          @click="onChangeTool(tool.name)"
        />
      </template>
    </div>
  </Dialog>
</template>

<style lang="css" scoped>
.tools {
  position: relative;
  top: 12px;

  .p-divider {
    margin-left: 5px;
    margin-right: 5px;
  }

  .rounded-button {
    border-radius: 50%;
  }

  .search-input {
    border-radius: 20px;
    min-width: 400px;
  }
}
</style>
<style lang="css">
.tools-dialog {
  border-radius: 40px !important;

  div {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
}
</style>
