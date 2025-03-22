<script lang="ts" setup>
import { injuryEffects } from "../../../data/injury";
</script>

<template>
  <p>Injuries occur when a character takes significant damage.</p>
  <p>Roll for injuries using the table below.</p>
  <p v-for="(injury, index) in injuryEffects">
    <b class="text-contrast">{{ index + 1 }}. {{ injury.name }}:</b>
    {{ injury.description }}
  </p>
</template>
