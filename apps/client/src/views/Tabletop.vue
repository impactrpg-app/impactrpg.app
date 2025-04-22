<script setup lang="ts">
import TabletopToolsComponent from "../components/TabletopToolsComponent.vue";
import RoomSelector from "@/components/RoomSelector.vue";
import TabletopCharacterComponent from "@/components/TabletopCharacterComponent.vue";
import TabletopRulesComponent from "@/components/TabletopRulesComponent.vue";
import TabletopDiceTrayComponent from "@/components/TabletopDiceTrayComponent.vue";
import TabletopContextMenuComponent from "@/components/TabletopContextMenuComponent.vue";
import { loadFromFile } from "@/service/io";
import { onMounted, ref } from "vue";
import { ProgressSpinner, useToast } from "primevue";
import * as TabletopService from "../service/tabletop";
import * as Api from "@/service/api";
import * as Task from "@/service/task";

const toast = useToast();

const isTabletopReady = ref(false);
const isCharacterSheetOpen = ref(false);
const isEncountersOpen = ref(false);
const isRulebookOpen = ref(false);
const isDiceTrayOpen = ref(false);
const rooms = ref<{ id: string; name: string }[]>([]);

const TOOLS = [new TabletopService.MoveTool(), new TabletopService.DrawTool()];

onMounted(() => {
  Task.runTask(async () => {
    await TabletopService.init(document.body, true);
    isTabletopReady.value = true;
    await fetchRooms();
  });
  TabletopService.notificationListeners.add((message) => {
    toast.add({
      severity: "info",
      summary: message,
    });
  });
});

async function uploadImage() {
  const imageSource = await loadFromFile("image/*");
  if (!imageSource) return;

  Task.runTask(async () => {
    const result = await Api.uploadImage(imageSource);
    if (!result) return;
    const url = `${Api.API_URL}/image/${encodeURIComponent(result.path)}`;
    await TabletopService.createImage(url);
  });
}
function uploadObject() {}
function rollDice(amount: number) {
  TabletopService.rollNetworkDice(amount);
}
function createRoomHandler() {
  Task.runTask(async () => {
    const resp = await Api.makeRequest<{ id: string }>("/room", {
      method: "POST",
    });
    TabletopService.joinRoom(resp.id);
    await fetchRooms();
  });
}
function deleteRoomHandler(roomId: string) {
  Task.runTask(async () => {
    await Api.makeRequest(`/room/${roomId}`, {
      method: "DELETE",
    });
    rooms.value = rooms.value.filter((room) => room.id !== roomId);
  });
}
function joinRoomHandler(roomId: string) {
  TabletopService.joinRoom(roomId);
}
function leaveRoomHandler() {
  TabletopService.leaveRoom();
}
function fetchRooms() {
  Task.runTask(async () => {
    rooms.value = await Api.makeRequest<{ id: string; name: string }[]>(
      "/rooms",
      {
        method: "GET",
      }
    );
  });
}
async function onChangeTool(toolName: string) {
  const camera = TabletopService.Entity.findWithTag("Camera");
  if (!camera) return;
  const tool = TOOLS.find((tool) => tool.name === toolName);
  if (!tool) return;
  await camera.updateModule(tool);
}
</script>

<template>
  <template v-if="TabletopService.currentRoom() && isTabletopReady">
    <TabletopCharacterComponent
      v-model:is-open="isCharacterSheetOpen"
      @roll-dice="rollDice"
    />
    <TabletopRulesComponent v-model:is-open="isRulebookOpen" />
    <TabletopDiceTrayComponent
      v-model:is-open="isDiceTrayOpen"
      @roll-dice="rollDice"
    />
    <TabletopContextMenuComponent
      v-model:is-open="TabletopService.isContextMenuOpen.value"
      :selected-objects="
        [...TabletopService.selectedObjects.values()].map(
          (obj) => TabletopService.scene.get(obj)!
        )
      "
    />
    <TabletopToolsComponent
      :is-characters-open="isCharacterSheetOpen"
      :is-encounters-open="isEncountersOpen"
      :is-rulebook-open="isRulebookOpen"
      :is-dice-tray-open="isDiceTrayOpen"
      :tools="TOOLS"
      @update:isCharactersOpen="isCharacterSheetOpen = $event"
      @update:isEncountersOpen="isEncountersOpen = $event"
      @update:isRulebookOpen="isRulebookOpen = $event"
      @update:isDiceTrayOpen="isDiceTrayOpen = $event"
      @upload-image="uploadImage"
      @upload-object="uploadObject"
      @leave-room="leaveRoomHandler"
      @change-tool="onChangeTool"
    />
  </template>
  <RoomSelector
    v-else
    :rooms="rooms"
    @create-room="createRoomHandler"
    @delete-room="deleteRoomHandler"
    @join-room="joinRoomHandler"
  />
  <ProgressSpinner
    v-if="Task.isRunningTask.value"
    aria-label="Loading"
    stroke-width="6"
    class="spinner"
  />
</template>

<style lang="css" scoped>
.spinner {
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  width: 50px;
  height: 50px;
}
</style>
