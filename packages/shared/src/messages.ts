import { TabletopObject } from './room';

export enum MessageType {
    JoinRoom = 'joinRoom',
    LeaveRoom = 'leaveRoom',
    AddObject = 'addObject',
    RemoveObject = 'removeObject',
    UpdateObject = 'updateObject',
}

export class JoinRoomMessage {
    type: MessageType.JoinRoom;
    roomId: string;
}

export class LeaveRoomMessage {
    type: MessageType.LeaveRoom;
    roomId: string;
}

export class AddObjectMessage {
    type: MessageType.AddObject;
    roomId: string;
    object: TabletopObject;
}

export class RemoveObjectMessage {
    type: MessageType.RemoveObject;
    roomId: string;
    objectId: string;
}

export class UpdateObjectMessage {
    type: MessageType.UpdateObject;
    roomId: string;
    object: TabletopObject;
}

export const AllMessages = [
    JoinRoomMessage,
    LeaveRoomMessage,
    AddObjectMessage,
    RemoveObjectMessage,
    UpdateObjectMessage
];

export type AllMessages = typeof AllMessages[number];