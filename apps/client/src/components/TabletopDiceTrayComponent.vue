<script lang="ts" setup>
import { Dialog } from "primevue";

const props = defineProps<{
  isOpen: boolean;
}>();

const emits = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
}>();
</script>

<template>
  <Dialog
    :modal="false"
    position="top"
    :visible="props.isOpen"
    @update:visible="emits('update:isOpen', $event)"
    style="width: 300px"
    header="Dice Tray"
  >
  </Dialog>
</template>

<style lang="css"></style>
