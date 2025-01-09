<script lang="ts" setup>
import { efforts } from "../../../data/effort";
</script>

<template>
  <p>For tasks that require cumulative progress (e.g., breaking a door), use Effort.</p>
  <p>Each attempt adds to the total number of successes.</p>
  <p>Failure isn't possible, but attempts may cost time.</p>
  <p><b>Example</b></p>
  <p>DM: <i>"Break the door. Roll a Strength Check."</i></p>
  <p>Player rolls: <i>[3 successes].</i></p>
  <p>
    DM:
    <i>
      "The door starts to splinter, but a guard notices you." Player rolls again: [2
      successes].
    </i>
  </p>
  <p>DM: <i>"The door breaks open."</i></p>
  <p>
    Effort can also be used competitively to compare progress between characters, such as
    in a race.
  </p>
  <p v-for="effort in efforts">
    <b class="text-contrast">{{ effort.name }}:</b>
    {{ effort.value }} success
  </p>
</template>
