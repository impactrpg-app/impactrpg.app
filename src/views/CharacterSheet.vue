<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { MenuItem } from "primevue/menuitem";
import { useToast } from "primevue/usetoast";
import {
  Character,
  NewCharacter,
} from "../data/character";
import {
  Dialog,
  Textarea,
} from "primevue";
import DiceRollerComponent from "../components/DiceRollerComponent.vue";
import CustomMenuBar from "../components/CustomMenuBar.vue";
import { supabaseClient } from "../service/supabase";
import { useRoute, useRouter } from "vue-router";
import CharacterInfoComponent from "../components/character-sheet/CharacterInfoComponent.vue";
import CharacterStatsComponent from "../components/character-sheet/CharacterStatsComponent.vue";
import CharacterSkillAndGearComponent from "../components/character-sheet/CharacterSkillAndGearComponent.vue";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const selectedCharacterId = ref<number>(-1);
const selectedCharacter = ref<Character>({ ...NewCharacter });
const showNotesEditor = ref<boolean>(false);
const isDiceRollerOpen = ref<boolean>(false);
const autoSaveInterval = ref<NodeJS.Timeout | null>(null);

onMounted(async () => {
  const characterId = Number(route.params['characterId']);
  if (!characterId || isNaN(characterId)) {
    throw new Error('character id not found');
  }
  selectedCharacterId.value = characterId;
  const query = await supabaseClient.from('character').select('data').eq('id', characterId).single();
  if (query.data !== null)
    selectedCharacter.value = query.data.data as Character;

  autoSaveInterval.value = setInterval(saveCharacter, 60_000);
});

onUnmounted(() => {
  if (autoSaveInterval.value)
    clearInterval(autoSaveInterval.value);
});


const menuItems: MenuItem[] = [
  {
    label: "Save",
    icon: "pi pi-save",
    command: async () => {
      saveCharacter();
    },
  },
  {
    label: "Roll Dice",
    icon: "casino",
    command: () => {
      isDiceRollerOpen.value = true;
    },
  },
  {
    label: "Notes",
    icon: "pi pi-book",
    command: () => {
      showNotesEditor.value = true;
    },
  },
  {
    label: 'Delete this character',
    icon: 'pi pi-trash',
    command: async () => {
      const query = await supabaseClient.from('character').delete().eq('id', selectedCharacterId.value);
      router.push('/characters');
      console.log(query.data);
    }
  }
];

async function saveCharacter() {
  const character = selectedCharacter.value;
  const query = await supabaseClient.from('character').update({
    image: character.info.image,
    name: character.info.name,
    data: character
  }).eq('id', selectedCharacterId.value);
  if (query.error === null) {
    toast.add({
      severity: 'success',
      summary: 'Saved Character',
      life: 3000
    });
  } else {
    toast.add({
      severity: 'error',
      summary: 'Failed to save character',
      life: 3000
    })
  }
}
</script>

<template>
  <DiceRollerComponent v-model:is-open="isDiceRollerOpen" :author="selectedCharacter.info.name" />
  <Dialog modal v-model:visible="showNotesEditor" header="Notes" :style="{ width: '650px' }">
    <div class="column">
      <Textarea v-model="selectedCharacter.notes" style="resize: vertical; min-height: 500px" />
    </div>
  </Dialog>
  <div class="character-sheet">
    <CustomMenuBar :items="menuItems" back-url="/characters" />
    <CharacterInfoComponent v-model="selectedCharacter" />
    <CharacterStatsComponent v-model="selectedCharacter" />
    <CharacterSkillAndGearComponent v-model="selectedCharacter" />
  </div>
</template>

<style lang="css" scoped>
.character-sheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 655px;
  gap: 20px;
}
</style>
<style lang="css">
.p-menubar-root-list {
  width: max-content;
  flex-direction: row;
}

.p-menubar-item-label {
  text-transform: uppercase;
  font-size: 16px;
}

.field {
  span {
    width: 100%;

    input {
      font-size: 24px;
      width: 100%;
    }
  }
}
</style>
