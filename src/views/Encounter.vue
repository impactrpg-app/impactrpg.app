<script lang="ts" setup>
import { Menubar } from 'primevue';
import { MenuItem } from 'primevue/menuitem';
import Router from '../router';

const menuItems: MenuItem[] = [
  {
    label: "back",
    icon: "pi pi-chevron-left",
    command: () => {
      Router.push("/");
    },
  },
  {
    label: "roll dice",
    icon: "pi pi-sparkles",
    command: () => {
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
    <Menubar :model="menuItems" style="min-width: 100%; justify-content: left" />
  </div>
</template>

<style lang="css" scoped>
.encounters {
  min-width: max-content;
  justify-content: start;
  align-items: start;
}
</style>