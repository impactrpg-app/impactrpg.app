<script setup lang="ts">
import { restActions } from "../../../data/rest";
</script>

<template>
  <p>
    When resting, it is assumed that characters gather the necessary ingredients for any
    actions taken during the rest.
  </p>
  <p>
    Resting actions should align with the environment: for example, you cannot cook in a
    desert without ingredients or resources.
  </p>
  <p>Resting lasts for 4-8 hours. Anything above 8 hours counts as two rests.</p>

  <h3>RESTING ACTIONS</h3>
  <p>
    While you are inside of a town or safe location you may do one free rest actions and
    no more.
  </p>
  <div class="goods">
    <div class="good" v-for="action in restActions">
      <h4>{{ action.name }}</h4>
      <p v-for="desc in action.description">
        {{ desc }}
      </p>
    </div>
  </div>
</template>
