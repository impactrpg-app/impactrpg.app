<script setup lang="ts">
import { ContextMenu, Dialog, InputText, Button, Divider } from "primevue";
import { computed, ref, useTemplateRef, onMounted, onUnmounted } from "vue";
import { loadFromFile } from "../service/io";
import * as TabletopService from "../service/tabletop";
import DiceRollerComponent from "./DiceRollerComponent.vue";
import TabletopCharacterDialogComponent from "./TabletopCharacterDialogComponent.vue";
import RulebookComponent from "./RulebookComponent.vue";
import TabletopToolsComponent from "./TabletopToolsComponent.vue";
import { API_URL, getHeaders } from "../service/api";
import type { RoomDto } from "@impact/shared";

const isCharactersOpen = ref(false);
const isDiceTrayOpen = ref(false);
const isEncountersOpen = ref(false);
const isRulebookOpen = ref(false);

const contextMenuRef = ref();
const rulebookContainer = useTemplateRef<HTMLDivElement>("rulebookContainer");
const updateInterval = ref<NodeJS.Timeout | null>(null);
const canvas = useTemplateRef<HTMLCanvasElement>("canvas");
const context = computed(() => canvas.value?.getContext("2d"));
const selectedCharacterName = ref("");
const joinRoomCode = ref("");
const rooms = ref<RoomDto[]>([]);

async function uploadImage() {
  const image = await loadFromFile("image/*");
  if (!image) return;
}
async function generateImage() {}

onMounted(async () => {
  TabletopService.init(canvas.value);
  TabletopService.onResize(new UIEvent("resize"));
  window.addEventListener("resize", TabletopService.onResize);
  window.addEventListener("mousemove", TabletopService.onMousemove);
  window.addEventListener("mouseup", TabletopService.onMouseUp);
  window.addEventListener("mousedown", TabletopService.onMouseDown);
  window.addEventListener("mouseover", TabletopService.onMouseOver);
  window.addEventListener("wheel", TabletopService.onScroll);
  window.addEventListener("keydown", TabletopService.onKeyDown);
  updateInterval.value = setInterval(() => {
    if (!canvas.value || !context.value) return;
    TabletopService.onUpdate(canvas.value, context.value);
  }, 10);
  fetchRooms();
});

onUnmounted(() => {
  if (updateInterval.value) clearInterval(updateInterval.value);
  window.removeEventListener("resize", TabletopService.onResize);
  window.removeEventListener("mousemove", TabletopService.onMousemove);
  window.removeEventListener("mouseup", TabletopService.onMouseUp);
  window.removeEventListener("mousedown", TabletopService.onMouseDown);
  window.removeEventListener("mouseover", TabletopService.onMouseOver);
  window.removeEventListener("wheel", TabletopService.onScroll);
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
  <template v-if="TabletopService.isInRoom()">
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
      <canvas
        class="tabletop-canvas"
        ref="canvas"
        @contextmenu="TabletopService.onContextMenu"
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
      header="Choose a room"
      :visible="true"
      :draggable="false"
      :close-button-props="{
        style: { display: 'none' },
      }"
    >
      <div class="column gap20">
        <div class="row gap20">
          <Button
            v-tooltip.top="'Create a new Room'"
            icon="pi pi-plus"
            style="border-radius: 50%"
            @click="createRoom"
          />
          <InputText
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
        <div class="column gap20" style="max-height:350px; overflow-y: auto; padding-right: 20px;">
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
