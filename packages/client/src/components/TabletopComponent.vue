<script setup lang="ts">
import * as uuid from "uuid";
import { Button, ContextMenu, Dialog, InputText } from 'primevue';
import { computed, ref, useTemplateRef, onMounted, onUnmounted } from 'vue';
import { loadFromFile } from '../service/io';
import { getRoomId, joinRoom, leaveRoom } from '../service/room';
import * as TabletopService from '../service/tabletop';
import TabletopCharacterDialogComponent from './TabletopCharacterDialogComponent.vue';
import DiceRollerComponent from './DiceRollerComponent.vue';
import RulebookComponent from './RulebookComponent.vue';
import TabletopToolsComponent from './TabletopToolsComponent.vue';
import { TabletopObjectType } from "../service/tabletop";

const roomId = ref('');
const isCharactersOpen = ref(false);
const isDiceTrayOpen = ref(false);
const isEncountersOpen = ref(false);
const isRulebookOpen = ref(false);
const isJoinRoomOpen = ref(false);

const contextMenuRef = ref();
const rulebookContainer = useTemplateRef<HTMLDivElement>('rulebookContainer');
const updateInterval = ref<NodeJS.Timeout | null>(null);
const canvas = useTemplateRef<HTMLCanvasElement>('canvas');
const context = computed(() => canvas.value?.getContext('2d'));
const selectedCharacterName = ref('');

async function uploadImage() {
    const image = await loadFromFile('image/*');
    if (!image) return;
    if (!context.value) return;
    const imageElement = new Image();
    imageElement.src = `data:image/png;base64,${btoa(image ?? '')}`;
    imageElement.crossOrigin = 'Anonymous';
    TabletopService.addObjectToScene(TabletopObjectType.Image, imageElement);
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
    window.addEventListener('mouseover', TabletopService.onMouseOver);
    window.addEventListener('wheel', TabletopService.onScroll);
    updateInterval.value = setInterval(() => {
        if (!canvas.value || !context.value) return;
        TabletopService.onUpdate(canvas.value, context.value);
    }, 10);
});

onUnmounted(() => {
    if (updateInterval.value)
        clearInterval(updateInterval.value);
    window.removeEventListener('resize', TabletopService.onResize);
    window.removeEventListener('mousemove', TabletopService.onMousemove);
    window.removeEventListener('mouseup', TabletopService.onMouseUp);
    window.removeEventListener('mousedown', TabletopService.onMouseDown);
    window.removeEventListener('mouseover', TabletopService.onMouseOver);
    window.removeEventListener('wheel', TabletopService.onScroll);
});

function handleContextMenu(event: MouseEvent) {
    event.preventDefault();
    if (TabletopService.selectedObject.value === -1) return;
    contextMenuRef.value?.show(event);
}

function generateRoomId() {
    roomId.value = uuid.v7();
}
</script>

<template>
    <div class="tabletop">
        <DiceRollerComponent
            :modal="false"
            :roll-author="selectedCharacterName"
            v-model:is-open="isDiceTrayOpen"
        />
        <TabletopCharacterDialogComponent
            v-model:is-open="isCharactersOpen"
            @set-character-name="selectedCharacterName = $event"
        />
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
                    <div class="row gap20">
                        <InputText v-model="roomId" placeholder="Room ID" />
                        <Button
                            variant="outlined"
                            icon="pi pi-refresh"
                            v-tooltip.top="'Generate Unique Room ID'"
                            @click="generateRoomId"
                        />
                    </div>
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