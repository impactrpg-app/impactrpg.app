import { ref } from "vue";
import { supabaseClient } from "./supabase";
import { REALTIME_LISTEN_TYPES, RealtimeChannel } from "@supabase/supabase-js";

export enum PayloadTypeEnum {
  DiceRoll,
  AddTabletopObject,
  RemoveTabletopObject,
  UpdateTabletopObject,
  RequestTabletopObjects,
}

// room infohttps://www.crunchyroll.com/watch/GG1U2J2K7/gods-blessings-on-this-bright-future
const CONNECTED_ROOM_KEY = 'connected:room';
export type Payload<T> = { type: PayloadTypeEnum; } & T;
export type MessageEventCallback<T> = (payload: Payload<T>) => void;
export const messageReceiver: Set<MessageEventCallback<any>> = new Set();
const currentRoomId = ref<string | null>(
  window.localStorage.getItem(CONNECTED_ROOM_KEY)
);
export const roomRef = ref<RealtimeChannel>();

// user info
export const userId = ref<string | null>(null);

export function receiveMessage(
  event: {
    type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
    event: string;
    payload: any;
  }
) {
  messageReceiver.forEach(
    receiver => receiver(event.payload)
  );
}

export function sendMessage<T>(payload: Payload<T>) {
  if (!payload) {
    return console.error('payload is null');
  }
  if (typeof payload !== 'object') {
    return console.error('when sending data, payload must be an object');
  }
  if (!currentRoomId.value) {
    return console.warn('you have not joined a room');
  }
  roomRef.value!
    .send({
      type: 'broadcast',
      event: 'sync',
      payload 
    });
}

export function getRoomId() {
  return currentRoomId.value;
}

export function joinRoom(roomId: string) {
  currentRoomId.value = roomId;
  roomRef.value = supabaseClient.channel(roomId);
  roomRef.value.on(
    REALTIME_LISTEN_TYPES.BROADCAST, {
      event: 'sync'
    },
    receiveMessage
  );
  roomRef.value!.subscribe();
  window.localStorage.setItem(CONNECTED_ROOM_KEY, roomId);
}

export function leaveRoom() {
  if (!currentRoomId.value) {
    return console.error('you have not joined a room');
  }
  roomRef.value!.unsubscribe();
  currentRoomId.value = null;
  window.localStorage.removeItem(CONNECTED_ROOM_KEY);
}

function autoJoinRoom() {
  const roomId = window.localStorage.getItem(CONNECTED_ROOM_KEY);
  if (!roomId) return;
  joinRoom(roomId);
}
autoJoinRoom();