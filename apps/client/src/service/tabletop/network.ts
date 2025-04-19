import { io } from "socket.io-client";
import { API_URL, getSocketHeaders } from "../api";
import {
  AddObjectMessage,
  AllMessageTypes,
  JoinRoomMessage,
  LeaveRoomMessage,
  MessageType,
  RemoveObjectMessage,
  SendNotificationMessage,
  UpdateObjectMessage,
} from "@impact/shared";
import { clearScene } from "./scene";
import { ref } from "vue";

export type ErrorListner = (code: number, message: string) => void;
export type NotificationListener = (message: string) => void;
export const notificationListeners = new Set<NotificationListener>();
export const errorListeners = new Set<ErrorListner>();

const room = ref<string | null>(null);
export function currentRoom() {
  return room.value;
}

export const socket = io(API_URL, {
  auth: getSocketHeaders(),
  withCredentials: true,
  transports: ["websocket"],
});

socket.on("event", (data: AllMessageTypes) => {
  switch (data.type) {
    case MessageType.Error:
      for (const listener of errorListeners) {
        listener(data.code, data.message);
      }
      break;
    case MessageType.SendNotification:
      for (const listener of notificationListeners) {
        listener(data.message);
      }
      break;
    case MessageType.JoinRoom:
      joinRoomResponse(data);
      break;
    case MessageType.LeaveRoom:
      leaveRoomResponse(data);
      break;
    case MessageType.AddObject:
      break;
    default:
      console.error(`Unknown event: ${data}`);
  }
});

// private
function joinRoomResponse(data: JoinRoomMessage) {
  clearScene();
  room.value = data.roomId;
}
function leaveRoomResponse(data: LeaveRoomMessage) {
  if (data.roomId === room.value) {
    clearScene();
    room.value = null;
  }
}
function addObjectResponse(data: AddObjectMessage) {}
function removeObjectResponse(data: RemoveObjectMessage) {}
function updateObjectResponse(data: UpdateObjectMessage) {}

// public
export function joinRoom(roomId: string) {
  if (!socket) {
    throw new Error("Not connected to server");
  }
  socket.emit("event", new JoinRoomMessage(roomId));
}
export function leaveRoom() {
  if (!socket) {
    throw new Error("Not connected to server");
  }
  if (!room.value) {
    throw new Error("Not in a room");
  }
  socket.emit("event", new LeaveRoomMessage(room.value));
}
export function sendNotification(message: string) {
  if (!socket) {
    throw new Error("Not connected to server");
  }
  socket.emit("event", new SendNotificationMessage(message));
}
export function addObject(data: AddObjectMessage) {
  
}
export function removeObject(data: RemoveObjectMessage) {}
export function updateObject(data: UpdateObjectMessage) {}
