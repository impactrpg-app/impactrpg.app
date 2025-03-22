<script lang="ts" setup>
import { materials } from "../../../data/crafting";
</script>

<template>
  <p>
    Crafting allows characters to use rest actions to create valuable items using
    materials they have gathered.
  </p>
  <p>Each time you take the Crafting rest action, roll a Strength Check.</p>
  <p>
    The successes from each check are cumulative and contribute to the total effort needed
    to complete the item.
  </p>
  <p>Once you reach the required effort, the item is crafted.</p>

  <h3>RULES FOR CRAFTING</h3>
  <p>
    <b class="text-contrast">Materials:</b> You must consume a material appropriate for
    the item you wish to craft. Materials can be obtained from monsters, merchants, or
    exploration.
  </p>
  <p>
    <b class="text-contrast">Item Loss:</b> If you try to craft another item while you are
    already crafting something than the item and the material are lost.
  </p>
  <p>
    <b class="text-contrast">Progress:</b> You cannot fail at crafting; each roll brings
    you closer to completion. However, crafting takes time and may require multiple rests.
  </p>
  <h3>COMMON MATERIALS</h3>
  <p>These materials are widely available from merchants or smiths:</p>
  <p v-for="material in materials">
    <b class="text-contrast">{{ material.name }}:</b>
    {{ material.description }}
  </p>
</template>
