<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { MenuItem } from 'primevue/menuitem';
import CustomMenuBar from '../components/CustomMenuBar.vue';
import { supabaseClient } from '../service/supabase';
import router from '../router';
import { handleLoading } from '../service/loading';

const encounters = ref<{
  id: number;
  name: string;
}[]>([]);
const menuItems: MenuItem[] = [
  {
    label: "Create New Encounter",
    icon: "pi pi-plus",
    command: () => {
      handleLoading(async () => {
        const result = await supabaseClient.from('encounter').insert({
          name: 'New Encounter',
          data: [],
        }).select().single();

        if (!result.data) {
          return;
        }
        router.push(`/encounter/${result.data.id}`);
      });
    },
  }
];

onMounted(() => {
  handleLoading(async () => {
    const result = await supabaseClient.from('encounter').select('id,name');
    if (!result.data) {
      return;
    }
    encounters.value = result.data;
  });
});
</script>

<template>
  <div class="column encounters">
    <CustomMenuBar :items="menuItems" back-url="/" />
    <RouterLink
      v-for="encounter in encounters"
      :to="`/encounter/${encounter.id}`"
      class="encounter"
    >
      <h3>{{ encounter.name }}</h3>
    </RouterLink>
  </div>
</template>

<style lang="css" scoped>
.encounters {
  min-width: max-content;
  justify-content: start;
  align-items: start;
  flex-grow: 1;
  max-width: 800px;
  gap: 10px;

  .encounter {
      display: flex;
      flex-direction: row;
      width: 100%;
      gap: 10px;
      cursor: pointer;
      align-items: center;
      flex-grow: 1;
      transition: 0.3s;
      padding: 10px;
      border-radius: 20px;

      &:hover {
        background-color: var(--p-stone-800);
      }
  }
}
</style>