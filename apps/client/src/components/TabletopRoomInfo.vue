<script lang="ts" setup>
import { Room } from "@/service/tabletop";
import { Dialog, Button, Divider, FloatLabel, InputText } from "primevue";
import { computed, ref, onMounted } from "vue";
import { getUserClaims } from "@/service/api";
import CustomResourceComponent from "./CustomResourceComponent.vue";
import * as TabletopService from "@/service/tabletop";

const showRoomSettings = ref(false);

const props = defineProps<{
  room: Room;
}>();

const emits = defineEmits<{
  (e: "leaveRoom"): void;
  (e: "update:room", room: Room): void;
}>();
const myUserId = ref<string | null>(null);

onMounted(() => {
  const claims = getUserClaims();
  myUserId.value = claims?.id ?? null;
});

function copyRoomLink() {
  const roomLink = `${window.location.origin}/join/${props.room.id}`;
  navigator.clipboard.writeText(roomLink);
  TabletopService.notifySelf("Room link copied to clipboard");
}
function updateSettings(updatedRoom: Partial<Room>) {
  emits("update:room", {
    ...props.room,
    ...updatedRoom,
  });
}
function kickUser(userId: string) {
  updateSettings({
    users: props.room.users.filter((u) => u.uuid !== userId),
  });
}
const roomName = computed({
  get() {
    return props.room.name;
  },
  set(value: string) {
    updateSettings({ name: value });
  },
});
const rollTarget = computed({
  get() {
    return props.room.rollTarget;
  },
  set(value: number) {
    updateSettings({ rollTarget: value });
  },
});

function clearDrawings() {
  for (const obj of TabletopService.scene.values()) {
    const lineRenderer =
      obj.getModule<TabletopService.LineRendererModule>("Module::Renderer");
    if (
      lineRenderer &&
      lineRenderer instanceof TabletopService.LineRendererModule
    ) {
      const net =
        obj.getModule<TabletopService.NetworkModule>("Module::Network");
      if (net) {
        net.despawn();
      } else {
        obj.destroy();
      }
    }
  }
}
</script>

<template>
  <Dialog
    :modal="false"
    v-model:visible="showRoomSettings"
    header="Room Settings"
    position="top"
  >
    <div class="column gap20">
      <FloatLabel class="field">
        <InputText id="room-name" v-model="roomName" />
        <label for="room-name">Room Name</label>
      </FloatLabel>
      <div class="column gap10">
        <span class="label">Roll Target</span>
        <CustomResourceComponent v-model="rollTarget" style="height: 45px" />
      </div>
      <Button
        label="Clear Drawings"
        icon="pi pi-trash"
        class="p-button-danger"
        @click="clearDrawings"
        v-tooltip.bottom="'Clear Drawings'"
      />
    </div>
  </Dialog>
  <Dialog
    :visible="true"
    :modal="false"
    :draggable="false"
    :closable="false"
    :resizable="false"
    position="topleft"
    style="width: 300px"
  >
    <template #header>
      <div class="row gap10 align-items-center">
        <span style="flex-grow: 1; font-size: 18px; font-weight: bold">
          {{ room.name }}</span
        >
        <Button
          variant="outlined"
          icon="pi pi-copy"
          class="rounded-button"
          @click="copyRoomLink()"
          v-tooltip.bottom="'Copy Room Link'"
        />
        <Button
          variant="outlined"
          icon="pi pi-cog"
          class="rounded-button"
          @click="() => (showRoomSettings = true)"
          v-tooltip.bottom="'Room Settings'"
          v-if="myUserId === room.owner"
        />
        <Button
          variant="outlined"
          icon="pi pi-sign-out"
          class="rounded-button"
          @click="() => emits('leaveRoom')"
          v-tooltip.bottom="'Leave Room'"
        />
      </div>
    </template>
    <template #default>
      <Divider style="margin-top: 0" />
      <div
        class="column gap20"
        style="padding-top: 10px"
        v-for="user in props.room.users"
        :key="user.uuid"
      >
        <div class="row gap10 align-items-center">
          <span style="flex-grow: 1">
            {{ user.displayName }}
          </span>
          <template v-if="props.room.owner === myUserId">
            <Button
              variant="outlined"
              icon="pi pi-times"
              class="rounded-button"
              v-tooltip.bottom="'Kick Player'"
              @click="() => kickUser(user.uuid)"
              v-if="myUserId !== user.uuid"
            />
          </template>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style lang="css" scoped>
.rounded-button {
  border-radius: 100%;
  height: 35px;
  width: 35px;
}
.label {
  font-size: 12px;
  color: var(--p-floatlabel-active-color);
  padding-left: 10px;
}
</style>
