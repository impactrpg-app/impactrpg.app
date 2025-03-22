import { TabletopObject } from "./tabletopObject";

export enum MessageType {
  Error = "error",
  JoinRoom = "joinRoom",
  LeaveRoom = "leaveRoom",
  AddObject = "addObject",
  RemoveObject = "removeObject",
  UpdateObject = "updateObject",
  ImageChunk = "imageChunk",
  ImageChunkEnd = "imageChunkEnd",
  SendNotification = "sendNotification",
}

export class ErrorMessage {
  type: MessageType.Error;
  message: string;

  constructor(message: string) {
    this.type = MessageType.Error;
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
  object: TabletopObject;

  constructor(object: TabletopObject) {
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
  object: Partial<TabletopObject>;

  constructor(objectId: string, object: Partial<TabletopObject>) {
    this.type = MessageType.UpdateObject;
    this.objectId = objectId;
    this.object = object;
  }
}

export class SendNotificationMessage {
  type: MessageType.SendNotification;
  message: string;
  image?: string;

  constructor(message: string, image?: string) {
    this.type = MessageType.SendNotification;
    this.message = message;
    this.image = image;
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
];

export type AllMessageTypes =
  | ErrorMessage
  | JoinRoomMessage
  | LeaveRoomMessage
  | AddObjectMessage
  | RemoveObjectMessage
  | UpdateObjectMessage
  | SendNotificationMessage;
