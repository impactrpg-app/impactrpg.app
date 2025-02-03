<script lang="ts" setup>
import { MenuItem } from 'primevue/menuitem';
import CustomMenuBar from '../components/CustomMenuBar.vue';
import { supabaseClient } from '../service/supabase';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const menuItems: MenuItem[] = [
  {
    label: "Create New Character",
    icon: 'pi pi-plus',
    command: () => {

    }
  }
];

const characters = ref<{
  id: number;
  name: string;
  image: string | null;
}[]>([]);

onMounted(async () => {
  const query = await supabaseClient.from('character').select('id,name,image');
  if (!query?.data)
    return;

  characters.value = [...query.data];
});
</script>

<template>
  <div class="characters">
    <CustomMenuBar :items="menuItems" />
    <div class="characters-list">
      <RouterLink
        v-for="character in characters"
        :to="`/character-sheet/${character.id}`"
        class="character"
      >
        <img :src="character.image ?? ''" />
        <div class="character-info">
          <h3>{{ character.name }}</h3>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="css" scoped>
.characters {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  gap: 20px;

  .characters-list {
    display: flex;
    flex-direction: column;

    .character {
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

      img {
        width: 50px;
        height: 50px;
        background-color: var(--p-stone-200);
        border-radius: 50%;
      }

      .character-info {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        flex-grow: 1;
      }
    }
  }
}
</style>