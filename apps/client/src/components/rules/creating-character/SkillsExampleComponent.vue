<script lang="ts" setup>
import { Button } from "primevue";
const props = defineProps<{
  openSkillsDialog?: () => void;
}>();
</script>

<template>
  <h3>Skill Examples</h3>
  <p>You have a bonus to <b class="text-contrast">stealth</b></p>
  <p>You have a bonus to <b class="text-contrast">lockpicking</b></p>
  <p>
    <b class="text-contrast">Parry:</b> If your defense roll exceeds an attacker's roll,
    you may spend 1 Endurance to inflict 1 wound on the attacker.
  </p>
  <p>
    <b class="text-contrast">Divine Light:</b> Spend 2 Endurance to heal 1 wound from a
    character.
  </p>
  <p>
    <b class="text-contrast">Blood Magic:</b> Transfer wounds between willing characters.
  </p>
  <Button variant="text" @click="props.openSkillsDialog"> View More </Button>
</template>
