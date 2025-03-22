<script lang="ts" setup>
import { abilities } from "../../../data/ability";
</script>

<template>
  <p>
    Each character possesses three core abilities that define their strengths and
    weaknesses. These abilities shape how your character interacts with the world and
    excels in various tasks.
  </p>
  <template v-for="ability in abilities">
    <h3 class="text-contrast">{{ ability.name }}</h3>
    <p>{{ ability.description }}</p>
  </template>
  <p>
    Distribute values among your abilities: assign 3 to one ability, 2 to another, and 1
    to the last.
  </p>
</template>
