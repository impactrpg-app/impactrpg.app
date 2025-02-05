<script lang="ts" setup>
import { Toast } from 'primevue';
</script>

<template>
  <Toast group="dice-roll">
    <template #message="slotProps">
      <div class="column gap20">
        <p>
          {{ slotProps.message.summary }}
        </p>
        <img :src="slotProps.message.detail" class="dice-tray" />
      </div>
    </template>
  </Toast>
</template>

<style lang="css" scoped>
.dice-tray{
  display: block;
  position: relative;
  width: 100%;
  height: 400px;
  background: var(--p-stone-500);
  border-radius: 20px;
  box-shadow: inset 10px 10px 20px var(--p-stone-700), inset -10px -10px 20px rgba(168, 162, 158, 0.5);
  border: 1px solid var(--p-stone-900);
}
</style>