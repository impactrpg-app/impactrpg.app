<script setup lang="ts">
import DiceRollerComponent from "./DiceRollerComponent.vue";
import TabletopCharacterDialogComponent from "./TabletopCharacterDialogComponent.vue";
import ObjectPropertiesComponent from "./ObjectProperties.vue";
import RulebookComponent from "./RulebookComponent.vue";
import TabletopToolsComponent from "./TabletopToolsComponent.vue";
import {
  ContextMenu,
  Dialog,
  InputText,
  Button,
  Divider,
  useToast,
} from "primevue";
import { computed, ref, useTemplateRef, onMounted, onUnmounted } from "vue";
import { loadFromFile } from "../service/io";
import * as TabletopService from "../service/tabletop";
import { accessToken, API_URL, getHeaders } from "../service/api";
import {
  ImageUploadResponse,
  RoomDto,
  TabletopObject,
} from "@impact/shared";
import { watch } from "vue";

const isCharactersOpen = ref(false);
const isDiceTrayOpen = ref(false);
const isEncountersOpen = ref(false);
const isRulebookOpen = ref(false);

const toast = useToast();
const contextMenuRef = ref();
const rulebookContainer = useTemplateRef<HTMLDivElement>("rulebookContainer");
const updateInterval = ref<NodeJS.Timeout | null>(null);
const canvas = useTemplateRef<HTMLCanvasElement>("canvas");
const context = computed(() => canvas.value?.getContext("2d"));
const selectedCharacterName = ref("");
const joinRoomCode = ref("");
const rooms = ref<RoomDto[]>([]);

watch(contextMenuRef, (el) => {
  if (!el) return;
  TabletopService.contextMenuRef.value = el;
})

async function uploadImage() {
  const imageSource = await loadFromFile("image/*");
  if (!imageSource) return;
  addImageObject(imageSource);
}
async function addImageObject(fileContents: Uint8Array<ArrayBuffer>) {
  const formData = new FormData();
  formData.append("image", new Blob([fileContents]));
  const resp = await fetch(API_URL + "/image", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
  });
  if (!resp.ok) {
    return;
  }
  const data: ImageUploadResponse = await resp.json();
  const obj = TabletopObject.NewImageObject(
    TabletopService.camera.value.position.clone().negate(),
    `${API_URL}/image/${encodeURIComponent(data.path)}`
  );
  TabletopService.addObjectRequest(obj);
}
function onContextMenu(event: MouseEvent) {
  event.preventDefault();
}
function onResize(_: UIEvent) {
  if (!canvas.value) return;
  TabletopService.onResize(canvas.value);
}
function generateImage() {}


function onNotification(message: string, image?: string) {
  toast.add({
    severity: "info",
    summary: message,
    detail: image,
    group: "dice-roll",
  });
}
async function onDropFile(event: DragEvent) {
  event.preventDefault();
  for (const file of event.dataTransfer?.files ?? []) {
    if (file.type.startsWith("image/") === false) continue;
    const buffer = await file.arrayBuffer();
    addImageObject(new Uint8Array(buffer));
  }
}
function onDragOver(event: DragEvent) {
  event.preventDefault();
}

onMounted(async () => {
  if (!canvas.value) return;
  TabletopService.init();
  TabletopService.onResize(canvas.value);
  window.addEventListener("resize", onResize);
  window.addEventListener("mousemove", TabletopService.onMousemove);
  window.addEventListener("mouseup", TabletopService.onMouseUp);
  window.addEventListener("mousedown", TabletopService.onMouseDown);
  window.addEventListener("mouseover", TabletopService.onMouseOver);
  window.addEventListener("wheel", TabletopService.onScroll);
  window.addEventListener("keydown", TabletopService.onKeyDown);
  window.addEventListener("keyup", TabletopService.onKeyUp);
  TabletopService.notificationListeners.add(onNotification);
  updateInterval.value = setInterval(() => {
    if (!canvas.value || !context.value) return;
    TabletopService.onUpdate(canvas.value, context.value);
  }, 10);
  fetchRooms();
});

onUnmounted(() => {
  if (updateInterval.value) clearInterval(updateInterval.value);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("mousemove", TabletopService.onMousemove);
  window.removeEventListener("mouseup", TabletopService.onMouseUp);
  window.removeEventListener("mousedown", TabletopService.onMouseDown);
  window.removeEventListener("mouseover", TabletopService.onMouseOver);
  window.removeEventListener("wheel", TabletopService.onScroll);
  window.removeEventListener("keydown", TabletopService.onKeyDown);
  window.removeEventListener("keyup", TabletopService.onKeyUp);
  TabletopService.notificationListeners.delete(onNotification);
});

async function fetchRooms() {
  const resp = await fetch(`${API_URL}/rooms`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!resp.ok) {
    throw new Error("Failed to fetch rooms");
  }

  const data = await resp.json();
  rooms.value = data;
}

async function createRoom() {
  const resp = await fetch(`${API_URL}/room`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      name: "New Room",
    }),
  });

  if (!resp.ok) {
    throw new Error("Failed to create room");
  }

  const data = await resp.json();
  rooms.value.push(data);
  TabletopService.joinRoomRequest(data.id);
}

async function deleteRoom(id: string) {
  const resp = await fetch(`${API_URL}/room/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!resp.ok) {
    throw new Error("Failed to delete room");
  }

  rooms.value = rooms.value.filter((room) => room.id !== id);
}
</script>

<template>
  <canvas :ondrop="onDropFile" :ondragover="onDragOver" class="tabletop-canvas" ref="canvas" @contextmenu="onContextMenu" />
  <template v-if="TabletopService.isInRoom()">
    <ObjectPropertiesComponent />
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
        style="width: 1000px; height: 800px"
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
      <ContextMenu
        ref="contextMenuRef"
        :model="TabletopService.contextMenuItems.value"
      />
      <TabletopToolsComponent
        :is-characters-open="isCharactersOpen"
        :is-dice-tray-open="isDiceTrayOpen"
        :is-encounters-open="isEncountersOpen"
        :is-rulebook-open="isRulebookOpen"
        @update:is-characters-open="isCharactersOpen = $event"
        @update:is-dice-tray-open="isDiceTrayOpen = $event"
        @update:is-encounters-open="isEncountersOpen = $event"
        @update:is-rulebook-open="isRulebookOpen = $event"
        @upload-image="uploadImage"
        @generate-image="generateImage"
      />
    </div>
  </template>
  <template v-else>
    <Dialog
      position="center"
      :visible="true"
      :draggable="false"
      :close-button-props="{
        style: { display: 'none' },
      }"
    >
      <template #header>
        <div class="row gap20 align-items-center">
          <Button
            as="router-link"
            to="/"
            style="border-radius: 50%"
            variant="outlined"
            icon="pi pi-chevron-left"
          />
          <div style="flex-grow: 1">Choose a room</div>
        </div>
      </template>

      <div class="column gap20">
        <div class="row gap20">
          <Button
            v-tooltip.top="'Create a new Room'"
            icon="pi pi-plus"
            style="border-radius: 50%"
            @click="createRoom"
          />
          <InputText
            id="join-room-code"
            v-model="joinRoomCode"
            placeholder="Enter a room code"
            style="border-radius: 40px"
          />
          <Button
            variant="outlined"
            label="Join"
            @click="TabletopService.joinRoomRequest(joinRoomCode)"
            style="border-radius: 40px"
          />
        </div>
        <Divider v-if="rooms.length > 0" />
        <div
          class="column gap20"
          style="max-height: 350px; overflow-y: auto; padding-right: 20px"
        >
          <div class="row gap20" v-for="room in rooms" :key="room.id">
            <Button
              variant="text"
              severity="secondary"
              :label="room.name"
              style="flex-grow: 1; border-radius: 40px"
              @click="TabletopService.joinRoomRequest(room.id)"
            />
            <Button
              variant="outlined"
              v-tooltip.top="'Delete Room'"
              icon="pi pi-trash"
              severity="danger"
              style="border-radius: 50%"
              @click="deleteRoom(room.id)"
            />
          </div>
        </div>
      </div>
    </Dialog>
  </template>
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
