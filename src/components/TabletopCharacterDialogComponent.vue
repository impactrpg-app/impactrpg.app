<script lang="ts" setup>
import { Character } from '../data/character';
import { onMounted, ref, watch } from 'vue';
import { supabaseClient } from '../service/supabase';
import { useToast } from 'primevue/usetoast';
import { Button, Dialog } from 'primevue';
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
</script>

<template>
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
            <div class="row gap20 align-items-center">
                <Button
                    v-if="selectedCharacter"
                    icon="pi pi-chevron-left"
                    style="border-radius: 100%; height: 40px; width: 40px;"
                    @click="selectedCharacter = null"
                    v-tooltip.top="'Back to characters'"
                />
                <span>Character Sheet</span>
                <Button
                    v-if="!selectedCharacter"
                    icon="pi pi-plus"
                    style="border-radius: 100%; height: 40px; width: 40px;"
                    v-tooltip.top="'Create Character'"
                />
                <Button
                    v-if="!selectedCharacter"
                    icon="pi pi-upload"
                    style="border-radius: 100%; height: 40px; width: 40px;"
                    v-tooltip.top="'Upload Character'"
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
                        />
                    </div>
                </div>
            </template>
        </div>
    </Dialog>
</template>

<style lang="css" scoped>
</style>