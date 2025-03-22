<script lang="ts" setup>
import { targets } from "../../../data/target";
</script>

<template>
  <p>
    The DM sets a target, which is the number of successes required to complete a task.
    Use natural language when describing difficulty levels:
  </p>
  <p v-for="target in targets">
    <b class="text-contrast">{{ target.name }}:</b>
    {{ target.value }} success
  </p>
  <p>
    If the target exceeds twice the dice pool (e.g., 9 required successes with 4D6), the
    task automatically fails.
  </p>
  <p>Tasks requiring 0 successes automatically succeed.</p>
</template>
