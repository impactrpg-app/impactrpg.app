<script lang=ts setup>
import { InputNumber } from 'primevue';
import { computed } from 'vue';
const props = defineProps<{
  modelValue: number;
  min?: number;
  max?: number;
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', val: number): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val: number) {
    emits('update:modelValue', val);
  }
});
</script>

<template>
  <InputNumber
    show-buttons   
    class="input-number"
    button-layout="horizontal"
    v-model="value"
    :min="props.min"
    :max="props.max"
  >
    <template #incrementicon>
        <span class="pi pi-plus" />
    </template>
    <template #decrementicon>
        <span class="pi pi-minus" />
    </template>
  </InputNumber>
</template>

<style lang="css">
.input-number {
  margin: 0;
  height: 30px;

  input {
    width: 40px;
  }
}
</style>