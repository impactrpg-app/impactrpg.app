<script lang="ts" setup>
import { ages } from "../../../data/age";
</script>

<template>
  <p>
    Your age represents how old your character is. You can write down a number but you
    must select one of the 3 options.
  </p>
  <template v-for="(age, index) in ages">
    <h3 class="text-contrast">{{ index + 1 }}. {{ age.name }}</h3>
    <p>
      <i>{{ age.description }}</i>
    </p>
    <p><b>Benefit: </b> {{ age.benefit }}</p>
  </template>
</template>
