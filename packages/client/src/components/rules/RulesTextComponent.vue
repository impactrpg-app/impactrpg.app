<script lang="ts" setup>
const props = defineProps<{
  type: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  text: string;
  contrast?: boolean;
}>();
</script>

<template>
  <component :is="props.type" :class="{ 'text-contrast': props.contrast }">
    {{ props.text }}
  </component>
</template>
