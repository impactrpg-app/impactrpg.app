<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { Button, Dialog, Textarea } from "primevue";
import CharacterInfoComponent from "./character-sheet/CharacterInfoComponent.vue";
import CharacterStatsComponent from "./character-sheet/CharacterStatsComponent.vue";
import CharacterSkillAndGearComponent from "./character-sheet/CharacterSkillAndGearComponent.vue";
import { makeRequest } from "../service/api";
import { CharacterDto, CharacterListDto } from "@impact/shared";

const props = defineProps<{
  isOpen: boolean;
}>();

const emits = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
}>();

const toast = useToast();
const confirm = useConfirm();
const selectedCharacter = ref<CharacterDto | null>(null);
const selectedCharacterId = ref<string | null>(null);
const showNotesEditor = ref(false);

const characters = ref<{ id: string; name: string; image: string | null }[]>(
  []
);
onMounted(async () => {
  fetchCharacters();
});
watch(selectedCharacter, saveCharacter, { deep: true });

async function fetchCharacters() {
  characters.value = await makeRequest<CharacterListDto[]>("/characters");
}

async function saveCharacter() {
  if (!selectedCharacter.value) return;
  const data = await makeRequest<CharacterDto>(
    `/character/${selectedCharacterId.value}`,
    {
      method: "PUT",
      body: JSON.stringify(selectedCharacter.value),
    }
  );
  if (!data) {
    toast.add({
      severity: "error",
      summary: "Failed to save character",
    });
  }
}

async function selectCharacter(characterId: string) {
  selectedCharacter.value = await makeRequest<CharacterDto>(
    `/character/${characterId}`
  );
  selectedCharacterId.value = characterId;
}
async function deSelectCharacter() {
  await saveCharacter();
  await fetchCharacters();
  selectedCharacterId.value = null;
  selectedCharacter.value = null;
}
async function createCharacter(character: CharacterDto) {
  if (!character.info.name) {
    character.info.name = "New Character";
  }
  const data = await makeRequest<CharacterListDto>("/character", {
    method: "POST",
    body: JSON.stringify(character),
  });

  characters.value = [
    ...characters.value,
    {
      id: data.id,
      name: data.name,
      image: data.image,
    },
  ];
  selectCharacter(data.id);
}
async function deleteCharacter(characterId: string) {
  confirm.require({
    message: "Are you sure you want to delete this character?",
    acceptLabel: "Delete",
    rejectLabel: "Cancel",
    acceptClass: "p-button-danger",
    rejectProps: {
      variant: "text",
    },
    acceptIcon: "pi pi-trash",
    rejectIcon: "pi pi-times",
    header: "Delete Character",
    accept: async () => {
      const data = await makeRequest<CharacterListDto>(
        `/character/${characterId}`,
        {
          method: "DELETE",
        }
      );
      if (data) {
        characters.value = characters.value.filter((c) => c.id !== characterId);
      }
    },
  });
}
</script>

<template>
  <Dialog
    :modal="false"
    v-model:visible="showNotesEditor"
    header="Notes"
    :style="{ width: '650px' }"
  >
    <div class="column" v-if="selectedCharacter">
      <Textarea
        v-model="selectedCharacter.notes"
        style="resize: vertical; min-height: 500px"
      />
    </div>
  </Dialog>
  <Dialog
    :modal="false"
    position="left"
    :visible="props.isOpen"
    @update:visible="emits('update:isOpen', $event)"
    style="width: 700px; height: 750px"
  >
    <template #header>
      <div class="row gap20 align-items-center" style="margin-right: 10px">
        <Button
          v-if="selectedCharacter"
          variant="outlined"
          icon="pi pi-chevron-left"
          style="border-radius: 100%; height: 40px; width: 40px"
          v-tooltip.top="'Back to characters'"
          @click="deSelectCharacter"
        />
        <span style="flex-grow: 1">Character Sheet</span>
        <Button
          v-if="!selectedCharacter"
          variant="outlined"
          icon="pi pi-plus"
          style="border-radius: 100%; height: 40px; width: 40px"
          v-tooltip.top="'Create Character'"
          @click="createCharacter(new CharacterDto())"
        />
        <Button
          v-if="selectedCharacter"
          variant="outlined"
          icon="pi pi-book"
          style="border-radius: 100%; height: 40px; width: 40px"
          v-tooltip.top="'Notes'"
          @click="showNotesEditor = !showNotesEditor"
        />
      </div>
    </template>
    <div
      class="column gap20"
      style="
        max-height: calc(750px - 120px);
        padding-bottom: 20px;
        padding-right: 20px;
      "
    >
      <template v-if="selectedCharacter">
        <CharacterInfoComponent v-model="selectedCharacter" />
        <CharacterStatsComponent v-model="selectedCharacter" />
        <CharacterSkillAndGearComponent v-model="selectedCharacter" />
      </template>
      <template v-else>
        <div class="column gap20">
          <div class="row gap20" v-for="character in characters">
            <Button
              style="flex-basis: 100%; border-radius: 40px"
              variant="outlined"
              severity="secondary"
              :label="character.name"
              @click="selectCharacter(character.id)"
            />
            <Button
              style="border-radius: 50%; min-width: 50px; min-height: 45px"
              variant="outlined"
              severity="danger"
              icon="pi pi-trash"
              v-tooltip.top="'Delete Character'"
              @click="deleteCharacter(character.id)"
            />
          </div>
        </div>
      </template>
    </div>
  </Dialog>
</template>

<style lang="css">
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
