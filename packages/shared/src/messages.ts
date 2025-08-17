import { Vector3 } from "./vector";
import { NetworkEntity } from "./networkEntity";
import { IsArray, IsEnum, IsNumber, IsObject, IsString } from "class-validator";

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
  @IsEnum(MessageType)
  type: MessageType.Error;
  @IsString()
  message: string;
  @IsNumber()
  code: number;

  constructor(code: number, message: string) {
    this.type = MessageType.Error;
    this.code = code;
    this.message = message;
  }
}
export class JoinRoomMessage {
  @IsEnum(MessageType)
  type: MessageType.JoinRoom;
  @IsString()
  roomId: string;

  constructor(roomId: string) {
    this.type = MessageType.JoinRoom;
    this.roomId = roomId;
  }
}

export class LeaveRoomMessage {
  @IsEnum(MessageType)
  type: MessageType.LeaveRoom;
  @IsString()
  roomId: string;

  constructor(roomId: string) {
    this.type = MessageType.LeaveRoom;
    this.roomId = roomId;
  }
}

export class AddObjectMessage {
  @IsEnum(MessageType)
  type: MessageType.AddObject;
  @IsObject()
  object: NetworkEntity;

  constructor(object: NetworkEntity) {
    this.type = MessageType.AddObject;
    this.object = object;
  }
}

export class RemoveObjectMessage {
  @IsEnum(MessageType)
  type: MessageType.RemoveObject;
  @IsString()
  objectId: string;

  constructor(objectId: string) {
    this.type = MessageType.RemoveObject;
    this.objectId = objectId;
  }
}

export class UpdateObjectMessage {
  @IsEnum(MessageType)
  type: MessageType.UpdateObject;
  @IsString()
  objectId: string;
  @IsObject()
  object: Partial<NetworkEntity>;

  constructor(objectId: string, object: Partial<NetworkEntity>) {
    this.type = MessageType.UpdateObject;
    this.objectId = objectId;
    this.object = object;
  }
}

export class SendNotificationMessage {
  @IsEnum(MessageType)
  type: MessageType.SendNotification;
  @IsString()
  message: string;

  constructor(message: string) {
    this.type = MessageType.SendNotification;
    this.message = message;
  }
}

export class DiceRollProperties {
  @IsObject()
  force: Vector3;
  @IsObject()
  torque: Vector3;
  @IsObject()
  startingPosition: Vector3;
}
export class DiceRollMessage {
  @IsEnum(MessageType)
  type: MessageType.DiceRoll;
  @IsArray()
  props: DiceRollProperties[];

  constructor(props: DiceRollProperties[]) {
    this.type = MessageType.DiceRoll;
    this.props = props;
  }
}

export class NetworkUser {
  @IsString()
  uuid: string;
  @IsString()
  displayName: string;
}

export class RoomInfoMessage {
  @IsEnum(MessageType)
  type: MessageType.RoomInfo;
  @IsString()
  ownerUserId: string;
  @IsString()
  roomName: string;
  @IsArray()
  users: NetworkUser[];

  constructor(ownerUserId: string, roomName: string, users: NetworkUser[]) {
    this.type = MessageType.RoomInfo;
    this.ownerUserId = ownerUserId;
    this.roomName = roomName;
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

export function createClassObject(data: AllMessageTypes) {
  switch (data.type) {
    case MessageType.Error:
      return Object.setPrototypeOf(
        data,
        ErrorMessage.prototype
      ) as ErrorMessage;
    case MessageType.JoinRoom:
      return Object.setPrototypeOf(
        data,
        JoinRoomMessage.prototype
      ) as JoinRoomMessage;
    case MessageType.LeaveRoom:
      return Object.setPrototypeOf(
        data,
        LeaveRoomMessage.prototype
      ) as LeaveRoomMessage;
    case MessageType.AddObject:
      return Object.setPrototypeOf(
        data,
        AddObjectMessage.prototype
      ) as AddObjectMessage;
    case MessageType.RemoveObject:
      return Object.setPrototypeOf(
        data,
        RemoveObjectMessage.prototype
      ) as RemoveObjectMessage;
    case MessageType.UpdateObject:
      return Object.setPrototypeOf(
        data,
        UpdateObjectMessage.prototype
      ) as UpdateObjectMessage;
    case MessageType.SendNotification:
      return Object.setPrototypeOf(
        data,
        SendNotificationMessage.prototype
      ) as SendNotificationMessage;
    case MessageType.DiceRoll:
      return Object.setPrototypeOf(
        data,
        DiceRollMessage.prototype
      ) as DiceRollMessage;
    case MessageType.RoomInfo:
      return Object.setPrototypeOf(
        data,
        RoomInfoMessage.prototype
      ) as RoomInfoMessage;
    default:
      throw new Error("unknown message type");
  }
}
