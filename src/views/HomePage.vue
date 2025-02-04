<script lang="ts" setup>
import PackageJson from "../../package.json";
import { Button, Dialog, Divider, FloatLabel, InputText, useToast } from "primevue";
import { supabaseClient } from "../service/supabase";
import { ref, onMounted, computed } from "vue";
import * as UUID from 'uuid';
import { getRoomId, joinRoom, leaveRoom, sendMessage } from "../service/room";

const showRoomJoinDialog = ref<boolean>(false);
const dialogRoomJoinId = ref<string>('');
const roomId = computed(() => getRoomId());
const roomUrl = computed(() => {
  const roomId = getRoomId();
  if (!roomId) return null;
  return `${window.location.host}?roomId=${roomId}`;
})
const toast = useToast();

onMounted(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const roomId = searchParams.get('roomId');
  if (!roomId) return;
  onJoinRoomClick(roomId);
});

function signOut() {
  supabaseClient.auth.signOut();
}
async function onCreateRoomClick() {
  joinRoom(UUID.v7());
}
async function onJoinRoomClick(id: string) {
  joinRoom(id);
  showRoomJoinDialog.value = false;
}
async function onLeaveRoomClick(){
  leaveRoom();
}
async function copyRoomLink() {
  if (!roomUrl.value) return;
  await navigator.clipboard.writeText(roomUrl.value);
  toast.add({
    severity: 'info',
    summary: 'Room link copied to clipboard',
    life: 3000
  });
}
</script>

<template>
  <Dialog modal v-model:visible="showRoomJoinDialog" header="Join Room">
    <div class="column gap20">
      <FloatLabel class="field">
        <InputText id="room-join-id" v-model="dialogRoomJoinId"  />
        <label for="room-join-id">Room Id</label>
      </FloatLabel>
      <div class="row gap20">
        <Button label="Join" @click="onJoinRoomClick(dialogRoomJoinId)" />
        <Button label="Cancel" variant="text" @click="showRoomJoinDialog = false" />
      </div>
    </div>
  </Dialog>
  <div class="homepage">
    <h1>impact</h1>
    <div class="version">{{ PackageJson.version }}</div>
    <p>By Zeeshan Abid</p>
    <div class="spacer"></div>
    <p>A Free Tabletop Role Playing game.</p>
    <Button as="router-link" label="Characters" icon="pi pi-user" to="/characters" />
    <Button as="router-link" label="Encounters" icon="pi pi-users" to="/encounter" />
    <Button as="router-link" label="Rulebook" icon="pi pi-align-justify" to="/rules" />
    <Button as="router-link" label="Monsters" icon="pi pi-eye" to="/monsters" />
    <Button as="router-link" label="World" icon="pi pi-globe" to="/world" />
    <Button as="a" label="Donate" icon="pi pi-dollar" href="https://github.com/sponsors/zeeshan595" target="_blank" />
    <Button label="Sign Out" icon="pi pi-sign-out" @click="signOut" />
    <Divider />
    <Button
      v-if="!roomId"
      label="Create Room"
      icon="pi pi-globe"
      @click="onCreateRoomClick"
    />
    <Button
      v-if="!roomId"
      label="Join Room"
      icon="pi pi-arrow-down-left-and-arrow-up-right-to-center"
      @click="showRoomJoinDialog = true"
    />
    <Button
      v-if="roomId"
      label="Leave Room"
      icon="pi pi-arrow-up-right-and-arrow-down-left-from-center"
      @click="onLeaveRoomClick"
    />
    <Button
      v-if="roomId"
      label="Copy Room Link"
      icon="pi pi-link"
      v-tooltip.bottom="roomUrl"
      @click="copyRoomLink"
    />
  </div>
</template>

<style lang="css" scoped>
.spacer {
  height: 50px;
}

.homepage {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 10px;

  .version {
    display: block;
    position: relative;
    height: 0;
    top: -40px;
    left: 125px;
    color: var(--p-lime-200);
  }

  a {
    text-decoration: none;
  }
}
</style>
