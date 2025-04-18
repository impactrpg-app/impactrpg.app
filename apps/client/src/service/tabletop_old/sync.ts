import { io, type Socket } from "socket.io-client";
import { API_URL, getSocketHeaders } from "../api";
import {
  MessageType,
  SendNotificationMessage,
  AllMessageTypes,
} from "@impact/shared";
import { joinRoomResponse, leaveRoomResponse } from "./room";
import {
  addObjectResponse,
  removeObjectResponse,
  updateObjectResponse,
} from "./scene";

export type ErrorListner = (code: number, message: string) => void;
export type NotificationListener = (message: string, image?: string) => void;
export const notificationListeners = new Set<NotificationListener>();
export const errorListeners = new Set<ErrorListner>();
export let socket: Socket | null = null;

export function init() {
  socket = io(API_URL, {
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
      case MessageType.JoinRoom:
        joinRoomResponse(data);
        break;
      case MessageType.LeaveRoom:
        leaveRoomResponse(data);
        break;
      case MessageType.AddObject:
        addObjectResponse(data);
        break;
      case MessageType.RemoveObject:
        removeObjectResponse(data);
        break;
      case MessageType.UpdateObject:
        updateObjectResponse(data);
        break;
      case MessageType.SendNotification:
        for (const listener of notificationListeners) {
          listener(data.message, data.image);
        }
        break;
      default:
        console.error(`Unknown event: ${data}`);
    }
  });
}

export function sendNotificationRequest(message: string, image?: string) {
  if (!socket) {
    return;
  }

  socket.emit("event", new SendNotificationMessage(message, image));
}
