import { Vector3 } from "./vector";
import { NetworkEntity } from "./networkEntity";

export enum MessageType {
  Error = "error",
  JoinRoom = "joinRoom",
  LeaveRoom = "leaveRoom",
  AddObject = "addObject",
  RemoveObject = "removeObject",
  UpdateObject = "updateObject",
  SendNotification = "sendNotification",
  DiceRoll = "diceRoll",
  RoomInfo = "roomInfo",
}

export class ErrorMessage {
  type: MessageType.Error;
  message: string;
  code: number;

  constructor(code: number, message: string) {
    this.type = MessageType.Error;
    this.code = code;
    this.message = message;
  }
}
export class JoinRoomMessage {
  type: MessageType.JoinRoom;
  roomId: string;

  constructor(roomId: string) {
    this.type = MessageType.JoinRoom;
    this.roomId = roomId;
  }
}

export class LeaveRoomMessage {
  type: MessageType.LeaveRoom;
  roomId: string;

  constructor(roomId: string) {
    this.type = MessageType.LeaveRoom;
    this.roomId = roomId;
  }
}

export class AddObjectMessage {
  type: MessageType.AddObject;
  object: NetworkEntity;

  constructor(object: NetworkEntity) {
    this.type = MessageType.AddObject;
    this.object = object;
  }
}

export class RemoveObjectMessage {
  type: MessageType.RemoveObject;
  objectId: string;

  constructor(objectId: string) {
    this.type = MessageType.RemoveObject;
    this.objectId = objectId;
  }
}

export class UpdateObjectMessage {
  type: MessageType.UpdateObject;
  objectId: string;
  object: Partial<NetworkEntity>;

  constructor(objectId: string, object: Partial<NetworkEntity>) {
    this.type = MessageType.UpdateObject;
    this.objectId = objectId;
    this.object = object;
  }
}

export class SendNotificationMessage {
  type: MessageType.SendNotification;
  message: string;

  constructor(message: string) {
    this.type = MessageType.SendNotification;
    this.message = message;
  }
}

export type DiceRollProperties = {
  force: Vector3;
  torque: Vector3;
  startingPosition: Vector3;
};
export class DiceRollMessage {
  type: MessageType.DiceRoll;
  props: DiceRollProperties[];

  constructor(props: DiceRollProperties[]) {
    this.type = MessageType.DiceRoll;
    this.props = props;
  }
}

export class RoomInfoMessage {
  type: MessageType.RoomInfo;
  roomName: string;
  users: string[];
  rollTarget: number;

  constructor(roomName: string, rollTarget: number, users: string[]) {
    this.type = MessageType.RoomInfo;
    this.roomName = roomName;
    this.rollTarget = rollTarget;
    this.users = users;
  }
}

export const AllMessages = [
  ErrorMessage,
  JoinRoomMessage,
  LeaveRoomMessage,
  AddObjectMessage,
  RemoveObjectMessage,
  UpdateObjectMessage,
  SendNotificationMessage,
  DiceRollMessage,
  RoomInfoMessage,
];

export type AllMessageTypes =
  | ErrorMessage
  | JoinRoomMessage
  | LeaveRoomMessage
  | AddObjectMessage
  | RemoveObjectMessage
  | UpdateObjectMessage
  | SendNotificationMessage
  | DiceRollMessage
  | RoomInfoMessage;
