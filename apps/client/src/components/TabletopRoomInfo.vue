<script lang="ts" setup>
import { Room } from "@/service/tabletop";
import { Dialog, Button, Divider } from "primevue";
import { ref } from "vue";

const showRoomSettings = ref(false);

const props = defineProps<{
  room: Room;
}>();

const emits = defineEmits<{
  (e: "leaveRoom"): void;
}>();

function copyRoomLink() {
  const roomLink = `${window.location.origin}/join/${props.room.id}`;
  navigator.clipboard.writeText(roomLink);
}
</script>

<template>
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
        :key="user"
      >
        <div class="row gap10 align-items-center">
          <span style="flex-grow: 1">
            {{ user }}
          </span>
          <Button
            variant="outlined"
            icon="pi pi-times"
            class="rounded-button"
            v-tooltip.bottom="'Kick Player'"
          />
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
</style>
