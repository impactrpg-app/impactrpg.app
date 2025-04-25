import { io, Socket } from "socket.io-client";
import { API_URL, getSocketHeaders } from "../api";
import {
  AddObjectMessage,
  AllMessageTypes,
  BoxCollider,
  DiceRollMessage,
  ErrorMessage,
  JoinRoomMessage,
  LeaveRoomMessage,
  MessageType,
  NetworkColliderType,
  NetworkEntity,
  NetworkModule,
  NetworkModuleType,
  NetworkUser,
  RemoveObjectMessage,
  RoomInfoMessage,
  SendNotificationMessage,
  UpdateObjectMessage,
} from "@impact/shared";
import { clearScene, Entity, Module, scene } from "./scene";
import { ref } from "vue";
import { Vector3, Vector4 } from "./vector";
import {
  BoxRendererModule,
  ImageRendererModule,
  ObjectRenderer,
} from "./renderer";
import { LineRendererModule } from "./renderer/modules/LineRenderer";
import * as Physics from "./physics";
import * as Network from "./modules/network";
import { createDefaultScene } from "./defaultScene";
import { clearDice, getDiceResults, rollDiceWithProps } from "./diceRoller";

export type ErrorListner = (code: number, message: string) => void;
export type NotificationListener = (message: string) => void;
export const notificationListeners = new Set<NotificationListener>();
export const errorListeners = new Set<ErrorListner>();

export class Room {
  id: string;
  name: string;
  owner: string | null;
  users: NetworkUser[];
  rollTarget: number;

  constructor(id: string) {
    this.id = id;
    this.name = "New Room";
    this.owner = null;
    this.users = [];
    this.rollTarget = 2;
  }
}

const room = ref<Room | null>(null);
export function currentRoom() {
  return room.value;
}

const socket = ref<Socket | null>(null);
export function init() {
  socket.value = io(API_URL, {
    auth: getSocketHeaders(),
    withCredentials: true,
    transports: ["websocket"],
  });

  socket.value.on(MessageType.Error, (data: ErrorMessage) => {
    for (const listener of errorListeners) {
      listener(data.code, data.message);
    }
  });

  socket.value.on(
    MessageType.SendNotification,
    (data: SendNotificationMessage) => {
      for (const listener of notificationListeners) {
        listener(data.message);
      }
    }
  );

  socket.value.on(MessageType.JoinRoom, (data: JoinRoomMessage) =>
    joinRoomResponse(data)
  );
  socket.value.on(MessageType.LeaveRoom, (data: LeaveRoomMessage) =>
    leaveRoomResponse(data)
  );
  socket.value.on(MessageType.RoomInfo, (data: RoomInfoMessage) =>
    roomInfoResponse(data)
  );
  socket.value.on(MessageType.AddObject, (data: AddObjectMessage) =>
    addObjectResponse(data)
  );
  socket.value.on(MessageType.RemoveObject, (data: RemoveObjectMessage) =>
    removeObjectResponse(data)
  );
  socket.value.on(MessageType.UpdateObject, (data: UpdateObjectMessage) =>
    updateObjectResponse(data)
  );
  socket.value.on(MessageType.DiceRoll, (data: DiceRollMessage) =>
    diceRollResponse(data)
  );
}

// private
function joinRoomResponse(data: JoinRoomMessage) {
  clearScene();
  createDefaultScene();
  room.value = new Room(data.roomId);
}
function leaveRoomResponse(data: LeaveRoomMessage) {
  clearScene();
  createDefaultScene();
  room.value = null;
}
function roomInfoResponse(data: RoomInfoMessage) {
  if (!room.value) return;
  room.value.users = data.users;
  room.value.rollTarget = data.rollTarget;
  room.value.name = data.roomName;
  room.value.owner = data.ownerUserId;
}
function addObjectResponse(data: AddObjectMessage) {
  if (scene.has(data.object.uuid)) return;
  toEntity(data.object);
}
function removeObjectResponse(data: RemoveObjectMessage) {
  scene.get(data.objectId)?.destroy();
}
function updateObjectResponse(data: UpdateObjectMessage) {
  const entity = scene.get(data.objectId);
  if (!entity) {
    console.error(`Entity ${data.objectId} not found`);
    return;
  }
  if (data.object.position) {
    entity.position = Vector3.fromObject(data.object.position);
    entity.position.isNetworkDirty = false;
  }
  if (data.object.rotation) {
    entity.rotation = Vector4.fromObject(data.object.rotation);
    entity.rotation.isNetworkDirty = false;
  }
  if (data.object.scale) {
    entity.scale = Vector3.fromObject(data.object.scale);
    entity.scale.isNetworkDirty = false;
  }
  if (data.object.modules) {
    for (const module of data.object.modules) {
      const convertedModule = toModule(module);
      if (convertedModule) {
        const existingModule = entity.modules[module.type];
        console.log(module);
        if (!existingModule) {
          entity.addModule(convertedModule);
        } else {
          entity.updateModule(convertedModule);
        }
      }
    }
  }
}
async function diceRollResponse(data: DiceRollMessage) {
  const result = await rollDiceWithProps(
    data.props.map((prop) => ({
      force: Vector3.fromObject(prop.force),
      torque: Vector3.fromObject(prop.torque),
      startingPosition: Vector3.fromObject(prop.startingPosition),
    }))
  );
  await getDiceResults(result);
  await clearDice(result);
}

// public
export function joinRoom(roomId: string) {
  if (!socket.value) {
    throw new Error("Not connected to server");
  }
  socket.value.emit(MessageType.JoinRoom, new JoinRoomMessage(roomId));
}
export function leaveRoom() {
  if (!socket.value) {
    throw new Error("Not connected to server");
  }
  if (!room.value) {
    throw new Error("Not in a room");
  }
  socket.value.emit(MessageType.LeaveRoom, new LeaveRoomMessage(room.value.id));
}
export function sendNotification(message: string) {
  if (!socket.value) {
    throw new Error("Not connected to server");
  }
  socket.value.emit(
    MessageType.SendNotification,
    new SendNotificationMessage(message)
  );
}
export function notifySelf(message: string) {
  for (const listener of notificationListeners) {
    listener(message);
  }
}
export function addObject(data: AddObjectMessage) {
  if (!socket.value) {
    throw new Error("Not connected to server");
  }
  socket.value.emit(MessageType.AddObject, data);
}
export function removeObject(data: RemoveObjectMessage) {
  if (!socket.value) {
    throw new Error("Not connected to server");
  }
  socket.value.emit(MessageType.RemoveObject, data);
}
export function updateObject(data: UpdateObjectMessage) {
  if (!socket.value) {
    throw new Error("Not connected to server");
  }
  socket.value.emit(MessageType.UpdateObject, data);
}
export function sendDiceRoll(data: DiceRollMessage) {
  if (!socket.value) {
    throw new Error("Not connected to server");
  }
  socket.value.emit(MessageType.DiceRoll, data);
}
export function updateRoomInfo(room: RoomInfoMessage) {
  if (!socket.value) {
    throw new Error("Not connected to server");
  }
  socket.value.emit(MessageType.RoomInfo, room);
}

// converters
export function toNetworkModule<T extends Module<any>>(
  module: T
): NetworkModule | null {
  if (module instanceof ImageRendererModule) {
    return {
      type: NetworkModuleType.ImageRenderer,
      image: module.getImage(),
    };
  } else if (module instanceof ObjectRenderer) {
    return {
      type: NetworkModuleType.ObjectRenderer,
      url: module.getFilePath(),
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
        const col = collider as Physics.BoxCollider;
        return {
          type: NetworkColliderType.Box,
          size: col.size.toObject(),
        } as BoxCollider;
      }),
    };
  } else if (module instanceof Physics.StaticBodyModule) {
    return {
      type: NetworkModuleType.StaticBody,
      colliders: module.colliders.map((collider) => {
        const col = collider as Physics.BoxCollider;
        return {
          type: NetworkColliderType.Box,
          size: col.size.toObject(),
        } as BoxCollider;
      }),
    };
  } else if (module instanceof Network.NetworkModule) {
    return {
      type: NetworkModuleType.Network,
    };
  }

  return null;
}
export function toModule<T extends Module<any>>(
  networkModule: NetworkModule
): T | null {
  switch (networkModule.type) {
    case NetworkModuleType.ImageRenderer:
      return new ImageRendererModule(networkModule.image) as unknown as T;
    case NetworkModuleType.ObjectRenderer:
      return new ObjectRenderer(networkModule.url) as unknown as T;
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
          return new Physics.BoxCollider(Vector3.fromObject(collider.size));
        })
      );
      return dynamicBody as unknown as T;
    case NetworkModuleType.StaticBody:
      const staticBody = new Physics.StaticBodyModule(
        networkModule.colliders.map((collider) => {
          return new Physics.BoxCollider(Vector3.fromObject(collider.size));
        })
      );
      return staticBody as unknown as T;
    case NetworkModuleType.Network:
      const net = new Network.NetworkModule();
      net.isInitialized = true;
      return net as unknown as T;
    default:
      return null;
  }
}
export function toNetworkEntity(entity: Entity): NetworkEntity {
  const modules = Object.values(entity.modules)
    .map((module) => toNetworkModule(module))
    .filter((module) => module !== null);

  const data = {
    uuid: entity.uuid,
    position: entity.position.toObject(),
    rotation: entity.rotation.toObject(),
    scale: entity.scale.toObject(),
    modules,
  };
  return data;
}
export async function toEntity(networkEntity: NetworkEntity): Promise<Entity> {
  const entity = new Entity(networkEntity.uuid);
  const oldUuid = entity.uuid;
  entity.uuid = networkEntity.uuid;
  scene.delete(oldUuid);
  scene.set(entity.uuid, entity);
  entity.position = Vector3.fromObject(networkEntity.position);
  entity.rotation = Vector4.fromObject(networkEntity.rotation);
  entity.scale = Vector3.fromObject(networkEntity.scale);
  for (const module of networkEntity.modules) {
    const convertedModule = toModule(module);
    if (convertedModule) {
      await entity.addModule(convertedModule);
    }
  }
  return entity;
}
