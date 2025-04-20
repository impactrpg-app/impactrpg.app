<script setup lang="ts">
import TabletopToolsComponent from "../components/TabletopToolsComponent.vue";
import RoomSelector from "@/components/RoomSelector.vue";
import TabletopCharacterDialogComponent from "@/components/TabletopCharacterDialogComponent.vue";
import { loadFromFile } from "@/service/io";
import { Vector3 } from "@/service/tabletop/vector";
import { onMounted, ref } from "vue";
import * as TabletopService from "../service/tabletop";
import * as Api from "@/service/api";

const isTabletopReady = ref(false);
const isCharacterSheetOpen = ref(false);
const isEncountersOpen = ref(false);
const isRulebookOpen = ref(false);
const isDiceTrayOpen = ref(false);
const rooms = ref<{ id: string; name: string }[]>([]);

const TOOLS = [new TabletopService.MoveTool(), new TabletopService.DrawTool()];

onMounted(async () => {
  await TabletopService.init(document.body, true);
  isTabletopReady.value = true;
  await fetchRooms();
});

async function uploadImage() {
  const imageSource = await loadFromFile("image/*");
  if (!imageSource) return;
  const result = await Api.uploadImage(imageSource);
  if (!result) return;
  const url = `${Api.API_URL}/image/${encodeURIComponent(result.path)}`;
  const entity = new TabletopService.Entity("image");
  entity.position = new Vector3(0, 0, 0);
  entity.rotation = Vector3.fromAngles(-90, 0, 0);
  entity.scale = new Vector3(0.01, 0.01, 0.01);
  const imageRenderer = await entity.addModule(
    new TabletopService.ImageRendererModule(url)
  );
  const tex = imageRenderer.texture!.image as HTMLImageElement;
  await entity.addModule(
    new TabletopService.StaticBodyModule([
      new TabletopService.BoxCollider(
        new Vector3((tex.width / 2) * 0.01, (tex.height / 2) * 0.01, 0.1 * 0.01)
      ),
    ])
  );
  await entity.addModule(new TabletopService.NetworkModule());
}
function generateImage() {}
async function createRoomHandler() {
  const resp = await Api.makeRequest<{ id: string }>("/room", {
    method: "POST",
  });
  TabletopService.joinRoom(resp.id);
  await fetchRooms();
}
async function deleteRoomHandler(roomId: string) {
  await Api.makeRequest(`/room/${roomId}`, {
    method: "DELETE",
  });
  rooms.value = rooms.value.filter((room) => room.id !== roomId);
}
function joinRoomHandler(roomId: string) {
  TabletopService.joinRoom(roomId);
}
function leaveRoomHandler() {
  TabletopService.leaveRoom();
}
async function fetchRooms() {
  rooms.value = await Api.makeRequest<{ id: string; name: string }[]>(
    "/rooms",
    {
      method: "GET",
    }
  );
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
    <TabletopCharacterDialogComponent
      :is-open="isCharacterSheetOpen"
      @update:is-open="isCharacterSheetOpen = $event"
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
      @generate-image="generateImage"
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
</template>
