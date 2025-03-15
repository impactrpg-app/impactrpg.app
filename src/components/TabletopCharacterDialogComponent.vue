<script lang="ts" setup>
import { Character, NewCharacter } from '../data/character';
import { onMounted, ref, watch } from 'vue';
import { supabaseClient } from '../service/supabase';
import { useToast } from 'primevue/usetoast';
import { Button, Dialog, Textarea } from 'primevue';
import CharacterInfoComponent from './character-sheet/CharacterInfoComponent.vue';
import CharacterStatsComponent from './character-sheet/CharacterStatsComponent.vue';
import CharacterSkillAndGearComponent from './character-sheet/CharacterSkillAndGearComponent.vue';

const props = defineProps<{
    isOpen: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:isOpen', value: boolean): void;
    (e: 'setCharacterName', value: string): void;
}>();

const toast = useToast();
const selectedCharacter = ref<Character | null>(null);
const selectedCharacterId = ref<number>(-1);
const showNotesEditor = ref(false);

const characters = ref<{id: number, name: string, image: string | null}[]>([]);
onMounted(async () => {
    const query = await supabaseClient.from('character').select('id,name,image');
    if (!query?.data)
        return;

    characters.value = [...query.data];
});
watch(selectedCharacter, (newVal) => {
    if (newVal?.info.name) {
        emits('setCharacterName', newVal.info.name);
        saveCharacter();
    }
}, { deep: true });

async function saveCharacter() {
    if (!selectedCharacter.value || selectedCharacterId.value === -1) return;
    const image = selectedCharacter.value.info.image;
    const character: Character = {
        ...selectedCharacter.value,
        info: {
            ...selectedCharacter.value.info,
            image: '',
        }
    };
    const query = await supabaseClient.from('character').update({
        image: image,
        name: character.info.name,
        data: character
    }).eq('id', selectedCharacterId.value);
    if (query.error !== null) {
        toast.add({
            severity: 'error',
            summary: 'Failed to save character'
        });
    } else {
        console.log('Character saved');
    }
}

async function selectCharacter(characterId: number) {
    const query = await supabaseClient.from('character')
        .select('image,data').eq('id', characterId).single();
    if (query.data !== null) {
        selectedCharacterId.value = characterId;
        selectedCharacter.value = query.data.data as Character;
        selectedCharacter.value.info.image = query.data.image ?? '';
    }
}
async function deSelectCharacter() {
    await saveCharacter();
    selectedCharacterId.value = -1;
    selectedCharacter.value = null;
}
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
    toast.add({
        severity: 'error',
        summary: 'Failed to create character'
    });
    return;
  }
  selectCharacter(query.data.id);
  characters.value.push({
    id: query.data.id,
    name: query.data.name,
    image: query.data.image,
  });
}
async function deleteCharacter(characterId: number) {
    const query = await supabaseClient.from('character').delete().eq('id', characterId);
    if (query.error) {
        toast.add({
            severity: 'error',
            summary: 'Failed to delete character'
        });
    }
    characters.value = characters.value.filter(c => c.id !== characterId);
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
            <Textarea v-model="selectedCharacter.notes" style="resize: vertical; min-height: 500px" />
        </div>
    </Dialog>
    <Dialog
        :modal="false"
        position="left"
        :visible="props.isOpen"
        @update:visible="emits('update:isOpen', $event)"
        style="
            width: 700px; 
            height: 700px;
        "

    >
        <template #header>
            <div class="row gap20 align-items-center" style="margin-right: 10px;">
                <Button
                    v-if="selectedCharacter"
                    variant="outlined"
                    icon="pi pi-chevron-left"
                    style="border-radius: 100%; height: 40px; width: 40px;"
                    v-tooltip.top="'Back to characters'"
                    @click="deSelectCharacter"
                />
                <span style="flex-grow: 1;">Character Sheet</span>
                <Button
                    v-if="!selectedCharacter"
                    variant="outlined"
                    icon="pi pi-plus"
                    style="border-radius: 100%; height: 40px; width: 40px;"
                    v-tooltip.top="'Create Character'"
                    @click="createCharacter({...NewCharacter})"
                />
                <Button
                    v-if="selectedCharacter"
                    variant="outlined"
                    icon="pi pi-book"
                    style="border-radius: 100%; height: 40px; width: 40px;"
                    v-tooltip.top="'Notes'"
                    @click="showNotesEditor = !showNotesEditor"
                />
            </div>
        </template>
        <div
            class="column gap20"
            style="
                overflow-y: auto;
                max-height: calc(700px - 120px);
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
                            style="flex-basis: 100%;"
                            variant="outlined"
                            :label="character.name"
                            @click="selectCharacter(character.id)"
                        />
                        <Button
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