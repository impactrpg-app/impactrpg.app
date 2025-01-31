<script lang="ts" setup>
import { Rating } from 'primevue';
import { computed } from 'vue';

const props = defineProps<{
  icon: string;
  stars: number;
  modelValue: number;
  materialIcons?: boolean;
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', val: number): void;
}>();

const value = computed({
  get(){
    return props.modelValue;
  },
  set(val: number){
    emits('update:modelValue', val);
  }
});

</script>

<template>
  <Rating v-model="value" :stars="props.stars">
    <template #onicon>
      <span v-if="props.materialIcons" class="material-symbols-outlined" style="color: var(--p-emerald-500); font-size: 16px;">{{ props.icon }}</span>
      <span v-else :class="`pi ${props.icon}`" style="color: var(--p-emerald-500);"></span>
    </template>
    <template #officon>
      <span v-if="props.materialIcons" class="material-symbols-outlined" style="color: var(--p-stone-500); font-size: 16px;">{{ props.icon }}</span>
      <span v-else :class="`pi ${props.icon}`" style="color: var(--p-stone-500);"></span>
    </template>
  </Rating>
</template>