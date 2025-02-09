import { ref } from "vue";
import * as UUID from 'uuid';
import { supabaseClient } from "./supabase";
import { REALTIME_LISTEN_TYPES, REALTIME_PRESENCE_LISTEN_EVENTS } from "@supabase/supabase-js";

export enum PayloadTypeEnum {
  DiceRoll
}
const CONNECTED_ROOM_KEY = 'connected:room';
export type Payload<T> = { type: PayloadTypeEnum; } & T;
export type MessageEventCallback<T> = (payload: Payload<T>) => void;
export const messageReceiver: Set<MessageEventCallback<any>> = new Set();
const currentRoomId = ref<string | null>(
  window.localStorage.getItem(CONNECTED_ROOM_KEY)
);
const userId = ref<string>(UUID.v7());

export function getUserUuid() {
  return userId;
}

export function receiveMessage(
  event: {
    type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
    event: string;
    payload: any;
  }
) {
  if (event.event !== REALTIME_PRESENCE_LISTEN_EVENTS.SYNC)
    return;

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
    return;
  }
  supabaseClient.channel(currentRoomId.value)
    .send({
      type: 'broadcast',
      event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC,
      payload 
    });
}

export function getRoomId() {
  return currentRoomId.value;
}

export function joinRoom(roomId: string) {
  currentRoomId.value = roomId;
  supabaseClient.channel(roomId).on(
    REALTIME_LISTEN_TYPES.BROADCAST, {
      event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC
    },
    receiveMessage
  );
  supabaseClient.channel(roomId).subscribe();
  window.localStorage.setItem(CONNECTED_ROOM_KEY, roomId);
}

export function leaveRoom() {
  if (!currentRoomId.value) {
    return console.error('you have not joined a room');
  }
  supabaseClient.channel(currentRoomId.value).unsubscribe();
  currentRoomId.value = null;
  window.localStorage.removeItem(CONNECTED_ROOM_KEY);
}