<script lang="ts" setup>
import { Menubar } from 'primevue';
import { MenuItem } from 'primevue/menuitem';
import Router from '../router';

const props = defineProps<{
  items: MenuItem[];
  backUrl?: string;
  beforeBackCallback?: () => Promise<void>;
}>();

const menuItems: MenuItem[] = [
  {
    label: "Back",
    icon: "pi pi-chevron-left",
    command: async () => {
      if (props.beforeBackCallback)
        await props.beforeBackCallback();

      if (props.backUrl)
        Router.push(props.backUrl);
      else
        Router.back();
    },
  },
  ...props.items,
];

</script>

<template>
<Menubar :model="menuItems" style="min-width: 100%;" breakpoint="800">
  <template #item="{ item }">
    <div v-tooltip.bottom="item.label" class="menu-item">
      <span v-if="item.icon?.startsWith('pi')" :class="`pi ${item.icon}`"></span>
      <span v-else class="material-symbols-outlined">{{ item.icon }}</span>
    </div>
  </template>
</Menubar>
</template>

<style lang="css" scoped>
.menu-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;

  span {
    font-size: 24px;
  }
}
</style>