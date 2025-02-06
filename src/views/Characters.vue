<script lang="ts" setup>
import { MenuItem } from 'primevue/menuitem';
import { supabaseClient } from '../service/supabase';
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { Character, NewCharacter } from '../data/character';
import CustomMenuBar from '../components/CustomMenuBar.vue';
import { loadFromFile } from '../service/io';

const router = useRouter();

async function createCharacter(character: Character) {
  if (character.info.name === '') {
    character.info.name = 'New Character';
  }
  const query = await supabaseClient.from('character').insert({
    name: 'New Character',
    image: null,
    data: {
      ...character,
    }
  }).select().single();
  if (query.error) {
    // todo: error handling
    return;
  }
  router.push(`/character-sheet/${query.data.id}`);
}

const menuItems: MenuItem[] = [
  {
    label: "Create New Character",
    icon: 'pi pi-plus',
    command: async () => {
      await createCharacter({ ...NewCharacter, skills: [], gear: [] });
    },
  },
  {
    label: 'Import Character',
    icon: 'pi pi-upload',
    command: async () => {
      const data = await loadFromFile('json');
      if (!data) return;
      await createCharacter(JSON.parse(data) as Character);
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
    <CustomMenuBar :items="menuItems" back-url="/" />
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
  flex-grow: 1;

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