<script lang="ts" setup>
import { personalities } from "../../../data/personality";
</script>

<template>
  <p>
    Your character's personality defines how they respond to situations and interact with
    others. When role-playing, strive to act in line with your character's chosen traits.
    For example, an agreeable character might be easily deceived by lies.
  </p>
  <p>
    Regardless of your personality choice, remember to work cooperatively with the party
    and avoid actions that intentionally disrupt group cohesion.
  </p>
  <template v-for="(personality, index) in personalities">
    <h3 class="text-contrast">{{ index + 1 }}. {{ personality.name }}</h3>
    <p>{{ personality.description }}</p>
  </template>
</template>
