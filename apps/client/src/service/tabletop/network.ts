import { io } from "socket.io-client";
import { API_URL, getSocketHeaders } from "../api";
import {
  AddObjectMessage,
  AllMessageTypes,
  BoxCollider,
  JoinRoomMessage,
  LeaveRoomMessage,
  MessageType,
  NetworkEntity,
  NetworkModule,
  NetworkModuleType,
  RemoveObjectMessage,
  SendNotificationMessage,
  UpdateObjectMessage,
} from "@impact/shared";
import { clearScene, Entity, Module, scene } from "./scene";
import { ref } from "vue";
import { Vector3 } from "./vector";
import { BoxRendererModule, ImageRendererModule } from "./renderer";
import { LineRendererModule } from "./renderer/modules/LineRenderer";
import * as Physics from "./physics";

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
function addObjectResponse(data: AddObjectMessage) {
  const entity = new Entity(data.object.uuid);
  entity.uuid = data.object.uuid;
  entity.position = Vector3.fromObject(data.object.position);
  entity.rotation = Vector3.fromObject(data.object.rotation);
  entity.scale = Vector3.fromObject(data.object.scale);
}
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
  if (!socket) {
    throw new Error("Not connected to server");
  }
  socket.emit("event", data);
}
export function removeObject(data: RemoveObjectMessage) {
  if (!socket) {
    throw new Error("Not connected to server");
  }
  socket.emit("event", data);
}
export function updateObject(data: UpdateObjectMessage) {
  if (!socket) {
    throw new Error("Not connected to server");
  }
  socket.emit("event", data);
}

export function convertToNetworkModule<T extends Module<any>>(
  module: T
): NetworkModule | null {
  if (module instanceof ImageRendererModule) {
    return {
      type: NetworkModuleType.ImageRenderer,
      image: module.getImage(),
    };
  } else if (module instanceof LineRendererModule) {
    return {
      type: NetworkModuleType.LineRenderer,
      points: module.getPoints(),
    };
  } else if (module instanceof BoxRendererModule) {
    return {
      type: NetworkModuleType.BoxRenderer,
      size: module.bounds,
    };
  } else if (module instanceof Physics.DynamicBodyModule) {
    return {
      type: NetworkModuleType.DynamicBody,
      colliders: module.colliders.map((collider) => {
        const col = collider as unknown as BoxCollider;
        return {
          type: col.type,
          offset: col.offset,
          size: col.size,
          rotation: col.rotation,
        };
      }),
    };
  } else if (module instanceof Physics.StaticBodyModule) {
    return {
      type: NetworkModuleType.StaticBody,
      colliders: module.colliders.map((collider) => {
        const col = collider as unknown as BoxCollider;
        return {
          type: col.type,
          offset: col.offset,
          size: col.size,
          rotation: col.rotation,
        };
      }),
    };
  }

  return null;
}

export function convertToModule<T extends Module<any>>(
  networkModule: NetworkModule
): T | null {
  switch (networkModule.type) {
    case NetworkModuleType.ImageRenderer:
      return new ImageRendererModule(networkModule.image) as unknown as T;
    case NetworkModuleType.BoxRenderer:
      return new BoxRendererModule(
        Vector3.fromObject(networkModule.size)
      ) as unknown as T;
    case NetworkModuleType.LineRenderer:
      const lineRenderer = new LineRendererModule();
      lineRenderer.setPoints(
        networkModule.points.map((point) => Vector3.fromObject(point))
      );
      return lineRenderer as unknown as T;
    case NetworkModuleType.DynamicBody:
      const dynamicBody = new Physics.DynamicBodyModule(
        networkModule.colliders.map((collider) => {
          return new Physics.BoxCollider(
            Vector3.fromObject(collider.size),
            Vector3.fromObject(collider.offset),
            Vector3.fromObject(collider.rotation)
          );
        })
      );
      return dynamicBody as unknown as T;
    case NetworkModuleType.StaticBody:
      const staticBody = new Physics.StaticBodyModule(
        networkModule.colliders.map((collider) => {
          return new Physics.BoxCollider(
            Vector3.fromObject(collider.size),
            Vector3.fromObject(collider.offset),
            Vector3.fromObject(collider.rotation)
          );
        })
      );
      return staticBody as unknown as T;
  }
}

export function entityToNetworkEntity(entity: Entity): NetworkEntity {
  const modules = Object.values(entity.modules)
    .map((module) => convertToNetworkModule(module))
    .filter((module) => module !== null);
  return {
    uuid: entity.uuid,
    position: entity.position,
    rotation: entity.rotation,
    scale: entity.scale,
    modules,
  };
}
