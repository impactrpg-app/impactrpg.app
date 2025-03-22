<script lang="ts" setup>
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from 'primevue';
import { computed, ref } from 'vue';

const props = defineProps<{
  id?: string;
  modelValue: any;
  suggestions: unknown[]
  optionLabel?: string;
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const value = computed<any>({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emits('update:modelValue', value);
  }
})

const internalSuggestions = ref<typeof props.suggestions>([]);
function onComplete(_: AutoCompleteCompleteEvent) {
  internalSuggestions.value = [...props.suggestions];
}
</script>

<template>
  <AutoComplete
    :input-id="props.id"
    v-model="value"
    :suggestions="internalSuggestions"
    :option-label="props.optionLabel"
    @complete="onComplete"
    dropdown
  />
</template>