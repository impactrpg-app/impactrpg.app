<script setup lang="ts">
import { Button, ContextMenu, Divider, Dialog, useToast } from 'primevue';
import { computed, ref, useTemplateRef, onMounted, onUnmounted } from 'vue';
import { loadFromFile } from '../service/io';
import { getRoomId } from '../service/room';
import { Character } from '../data/character';
import * as TabletopService from '../service/tabletop';
import CharacterInfoComponent from './character-sheet/CharacterInfoComponent.vue';
import CharacterStatsComponent from './character-sheet/CharacterStatsComponent.vue';
import CharacterSkillAndGearComponent from './character-sheet/CharacterSkillAndGearComponent.vue';
import DiceRollerComponent from './DiceRollerComponent.vue';
import RulebookComponent from './RulebookComponent.vue';
import { supabaseClient } from '../service/supabase';


const toast = useToast();
const isCharactersOpen = ref(false);
const selectedCharacterId = ref<number>(-1);
const selectedCharacter = ref<Character | null>(null);
const characters = ref<{id: number, name: string, image: string | null}[]>([]);
const isDiceTrayOpen = ref(false);
const isEncountersOpen = ref(false);
const isRulebookOpen = ref(false);
const isJoinRoomOpen = ref(false);
const autoSaveInterval = ref<NodeJS.Timeout | null>(null);

const contextMenuRef = ref();
const rulebookContainer = useTemplateRef<HTMLDivElement>('rulebookContainer');
const updateInterval = ref<NodeJS.Timeout | null>(null);
const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
const context = computed(() => canvas.value?.getContext('2d'));

async function uploadImage() {
    const image = await loadFromFile('image/*');
    if (!image) return;
    if (!context.value) return;
    const imageElement = new Image();
    imageElement.src = `data:image/png;base64,${btoa(image ?? '')}`;
    imageElement.crossOrigin = 'Anonymous';
    TabletopService.addObjectToScene(imageElement);
}

onMounted(async () => {
    TabletopService.init(canvas.value);
    TabletopService.onResize(new UIEvent('resize'));
    window.addEventListener('resize', TabletopService.onResize);
    window.addEventListener('mousemove', TabletopService.onMousemove);
    window.addEventListener('mouseup', TabletopService.onMouseUp);
    window.addEventListener('mousedown', TabletopService.onMouseDown);
    window.addEventListener('wheel', TabletopService.onScroll);
    updateInterval.value = setInterval(() => {
        if (!canvas.value || !context.value) return;
        TabletopService.onUpdate(canvas.value, context.value);
    }, 10);


    const query = await supabaseClient.from('character').select('id,name,image');
    if (!query?.data)
        return;

    characters.value = [...query.data];
    autoSaveInterval.value = setInterval(saveCharacter, 60_000);
});

onUnmounted(() => {
    if (autoSaveInterval.value)
        clearInterval(autoSaveInterval.value);
    if (updateInterval.value)
        clearInterval(updateInterval.value);
    window.removeEventListener('resize', TabletopService.onResize);
    window.removeEventListener('mousemove', TabletopService.onMousemove);
    window.removeEventListener('mouseup', TabletopService.onMouseUp);
    window.removeEventListener('mousedown', TabletopService.onMouseDown);
    window.removeEventListener('wheel', TabletopService.onScroll);
});

async function saveCharacter() {
    if (!selectedCharacter.value || selectedCharacterId.value === -1) return;
    const image = selectedCharacter.value.info.image;
    const character = {
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

function handleContextMenu(event: MouseEvent) {
    event.preventDefault();
    if (TabletopService.selectedObject.value === -1) return;
    contextMenuRef.value?.show(event);
}
async function selectCharacter(characterId: number) {
    selectedCharacterId.value = characterId;
    const query = await supabaseClient.from('character').select('image,data').eq('id', characterId).single();
    if (query.data !== null) {
        selectedCharacter.value = query.data.data as Character;
        selectedCharacter.value.info.image = query.data.image ?? '';
    }
}
</script>

<template>
    <div class="tabletop">
        <DiceRollerComponent
            :modal="false"
            :roll-author="selectedCharacter?.info.name"
            v-model:is-open="isDiceTrayOpen"
        />
        <Dialog
            :modal="false"
            position="left"
            v-model:visible="isCharactersOpen"
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
                        style="border-radius: 100%; margin-top: 10px"
                        @click="selectedCharacter = null"
                    />
                    <span>Character Sheet</span>
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
                        <Button
                            v-for="character in characters"
                            :key="character.id"
                            @click="selectCharacter(character.id)"
                            :label="character.name"
                            variant="outlined"
                        />
                    </div>
                </template>
            </div>
        </Dialog>
        <Dialog
            :modal="false"
            position="top"
            header="Rulebook"
            v-model:visible="isRulebookOpen"
            style="
                width: 1000px;
                height: 1000px;
            "
        >
            <div
                ref="rulebookContainer"
                class="column gap20"
                style="
                    overflow-y: auto;
                    max-height: calc(1000px - 120px);
                    padding-bottom: 20px;
                    padding-right: 20px;
                    scroll-behavior: smooth;
                "
            >
                <RulebookComponent :container="rulebookContainer" />
            </div>
        </Dialog>
        <ContextMenu ref="contextMenuRef" :model="TabletopService.contextMenuItems.value" />
        <canvas class="tabletop-canvas" ref="canvas" @contextmenu="handleContextMenu" />
        <div class="tools">
            <Button
                :variant="!isCharactersOpen ? 'outlined' : undefined"
                class="upload-button"
                icon="pi pi-user"
                v-tooltip.top="'Character Sheet'"
                @click="isCharactersOpen = !isCharactersOpen"
            />
            <Button
                :variant="!isDiceTrayOpen ? 'outlined' : undefined"
                class="upload-button"
                v-tooltip.top="'Dice Tray'"
                @click="isDiceTrayOpen = !isDiceTrayOpen"
            >
                <template #icon>
                    <span class="material-symbols-outlined">casino</span>
                </template>
            </Button>
            <Button
                :variant="!isEncountersOpen ? 'outlined' : undefined"
                class="upload-button"
                icon="pi pi-eye"
                v-tooltip.top="'Encounters'"
                @click="isEncountersOpen = !isEncountersOpen"
            />
            <Button
                :variant="!isRulebookOpen ? 'outlined' : undefined"
                class="upload-button"
                icon="pi pi-align-justify"
                v-tooltip.top="'Rulebook'"
                @click="isRulebookOpen = !isRulebookOpen"
            />
            <Button
                v-if="!getRoomId()"
                variant="outlined"
                class="upload-button"
                icon="pi pi-globe"
                v-tooltip.top="'Join Room'"
                @click="isJoinRoomOpen = !isJoinRoomOpen"
            />
            <Button
                v-if="getRoomId()"
                class="upload-button"
                icon="pi pi-arrow-up-right-and-arrow-down-left-from-center"
                v-tooltip.top="'Leave Room'"
            />
            <Divider layout="vertical" />
            <Button
                variant="outlined"
                class="upload-button"
                icon="pi pi-upload"
                v-tooltip.top="'Upload Image'"
                @click="uploadImage"
            />
            <Button
                variant="outlined"
                class="upload-button"
                icon="pi pi-search"
                v-tooltip.top="'Generate Image'"
                @click="uploadImage"
            />
            <Divider layout="vertical" />
            <template v-for="tool in TabletopService.ALL_TOOLS">
                <Button
                    :variant="TabletopService.tool.value.name !== tool.name ? 'outlined' : undefined"
                    class="generate-button"
                    :icon="tool.icon"
                    v-tooltip.top="tool.name"
                    @click="TabletopService.tool.value = tool"
                />
            </template>
        </div>
    </div>
</template>

<style lang="css" scoped>
.drawer-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
.tabletop-canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.tools {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    z-index: 5000;
    padding: 10px 15px;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    border-radius: 50px;
    border: 0;

    .upload-button, .generate-button {
        border-radius: 50%;
    }

    .search-input {
        border-radius: 20px;
        min-width: 400px;
    }
}
</style>