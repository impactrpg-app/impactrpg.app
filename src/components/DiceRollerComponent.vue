<script lang="ts" setup>
import { Dialog } from 'primevue';
import { computed } from 'vue';

const props = defineProps<{
  isOpen?: boolean;
}>();
const emits = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>();

const isOpen = computed({
  get() {
    return props.isOpen;
  },
  set(value: boolean) {
    emits('update:isOpen', value);
  }
})
</script>

<template>
  <Dialog modal v-model:visible="isOpen" header="Dice Roller" position="top" style="width: 300px;">
    Test
  </Dialog>
</template>

<style lang="css" scoped></style>