<script setup lang="ts">
import { craftingTargets, materialProperties } from "../../../data/crafting";
</script>

<template>
  <h3>RARE MATERIALS</h3>
  <p>Rare materials are obtained from special monsters, treasures, or unique rewards.</p>
  <p>
    Rare materials usually require higher effort to craft compared to common materials.
  </p>
  <p>Rare materials imbue crafted items with unique properties based on the material.</p>
  <h5>RARE MATERIAL PROPERTIES</h5>
  <p v-for="property in materialProperties">
    <b class="text-contrast">{{ property.name }}:</b>
    {{ property.description }}
  </p>
  <h3>CRAFTING TARGET</h3>
  <p>The difficulty of crafting depends on the complexity and quality of the item.</p>
  <p v-for="target in craftingTargets">
    <b class="text-contrast">{{ target.name }}:</b>
    {{ target.value }}
  </p>
  <p>
    The DM should assign crafting targets based on the materials used and the quality of
    the item being crafted.
  </p>
</template>
