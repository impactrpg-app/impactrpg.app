<script setup lang="ts">
import { Button, ContextMenu, Dialog, useToast, InputText } from 'primevue';
import { computed, ref, useTemplateRef, onMounted, onUnmounted } from 'vue';
import { loadFromFile } from '../service/io';
import { Character } from '../data/character';
import { getRoomId, joinRoom, leaveRoom } from '../service/room';
import { supabaseClient } from '../service/supabase';
import * as TabletopService from '../service/tabletop';
import CharacterInfoComponent from './character-sheet/CharacterInfoComponent.vue';
import CharacterStatsComponent from './character-sheet/CharacterStatsComponent.vue';
import CharacterSkillAndGearComponent from './character-sheet/CharacterSkillAndGearComponent.vue';
import DiceRollerComponent from './DiceRollerComponent.vue';
import RulebookComponent from './RulebookComponent.vue';
import TabletopToolsComponent from './TabletopToolsComponent.vue';

const roomId = ref('');
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
async function generateImage() {

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
                height: 800px;
            "
        >
            <div
                ref="rulebookContainer"
                class="column gap20"
                style="
                    overflow-y: auto;
                    max-height: calc(800px - 120px);
                    padding-bottom: 20px;
                    padding-right: 20px;
                    scroll-behavior: smooth;
                "
            >
                <RulebookComponent :container="rulebookContainer" />
            </div>
        </Dialog>
        <Dialog
            :modal="false"
            position="top"
            :header="getRoomId() ? 'Leave Room' : 'Join Room'"
            v-model:visible="isJoinRoomOpen"
        >
            <div class="column gap20">
                <template  v-if="!getRoomId()">
                    <InputText v-model="roomId" placeholder="Room ID" />
                    <Button label="Join" @click="() => joinRoom(roomId)" />
                </template>
                <template v-else>
                    <span>Room ID: {{ getRoomId() }}</span>
                    <Button label="Leave" @click="leaveRoom" />
                </template>
            </div>
        </Dialog>
        <ContextMenu ref="contextMenuRef" :model="TabletopService.contextMenuItems.value" />
        <canvas class="tabletop-canvas" ref="canvas" @contextmenu="handleContextMenu" />
        <TabletopToolsComponent
            :is-characters-open="isCharactersOpen"
            :is-dice-tray-open="isDiceTrayOpen"
            :is-encounters-open="isEncountersOpen"
            :is-rulebook-open="isRulebookOpen"
            :is-join-room-open="isJoinRoomOpen"
            @update:is-characters-open="isCharactersOpen = $event"
            @update:is-dice-tray-open="isDiceTrayOpen = $event"
            @update:is-encounters-open="isEncountersOpen = $event"
            @update:is-rulebook-open="isRulebookOpen = $event"
            @update:is-join-room-open="isJoinRoomOpen = $event"
            @upload-image="uploadImage"
            @generate-image="generateImage"
        />
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
</style>