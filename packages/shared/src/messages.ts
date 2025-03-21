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

export class ImageChunkMessage {
  type: MessageType.ImageChunk;
  objectId: string;
  chunk: number[];
  count: number;

  constructor(objectId: string, chunk: number[], count: number) {
    this.type = MessageType.ImageChunk;
    this.objectId = objectId;
    this.chunk = chunk;
    this.count = count;
  }
}
export class ImageChunkMessageEnd {
  type: MessageType.ImageChunkEnd;
  objectId: string;
  totalChunks: number;

  constructor(objectId: string, totalChunks: number) {
    this.type = MessageType.ImageChunkEnd;
    this.objectId = objectId;
    this.totalChunks = totalChunks;
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

export const AllMessages = [
  ErrorMessage,
  JoinRoomMessage,
  LeaveRoomMessage,
  AddObjectMessage,
  RemoveObjectMessage,
  UpdateObjectMessage,
  ImageChunkMessage,
  ImageChunkMessageEnd,
];

export type AllMessageTypes =
  | ErrorMessage
  | JoinRoomMessage
  | LeaveRoomMessage
  | AddObjectMessage
  | RemoveObjectMessage
  | UpdateObjectMessage
  | ImageChunkMessage
  | ImageChunkMessageEnd;
