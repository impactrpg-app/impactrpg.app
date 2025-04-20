<script setup lang="ts">
import { ref } from "vue";
import { Button, Dialog, Divider, InputText } from "primevue";
const joinRoomCode = ref("");

const props = defineProps<{
  rooms: Array<{
    id: string;
    name: string;
  }>;
}>();
const emits = defineEmits<{
  (e: "createRoom"): void;
  (e: "deleteRoom", roomId: string): void;
  (e: "joinRoom", roomId: string): void;
}>();
</script>

<template>
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
          @click="() => emits('createRoom')"
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
          @click="() => emits('joinRoom', joinRoomCode)"
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
            @click="() => emits('joinRoom', room.id)"
          />
          <Button
            variant="outlined"
            v-tooltip.top="'Delete Room'"
            icon="pi pi-trash"
            severity="danger"
            style="border-radius: 50%"
            @click="() => emits('deleteRoom', room.id)"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>
