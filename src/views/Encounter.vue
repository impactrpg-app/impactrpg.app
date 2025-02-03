<script lang="ts" setup>
import { MenuItem } from 'primevue/menuitem';
import CustomMenuBar from '../components/CustomMenuBar.vue';
import DiceRollerComponent from '../components/DiceRollerComponent.vue';
import { ref } from 'vue';

const isDiceRollerOpen = ref(false);

const menuItems: MenuItem[] = [
  {
    label: "Roll Dice",
    icon: "casino",
    command: () => {
      isDiceRollerOpen.value = true;
    },
  },
  {
    label: "Add",
    icon: "pi pi-plus",
    command: () => {
    },
  }
];

</script>

<template>
  <div class="encounters">
    <DiceRollerComponent v-model:is-open="isDiceRollerOpen" />
    <CustomMenuBar :items="menuItems" />
  </div>
</template>

<style lang="css" scoped>
.encounters {
  min-width: max-content;
  justify-content: start;
  align-items: start;
}
</style>