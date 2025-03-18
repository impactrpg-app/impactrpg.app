import { TabletopObject } from './room';

export const MessageType = {
    JoinRoom: 'joinRoom',
    LeaveRoom: 'leaveRoom',
    AddObject: 'addObject',
    RemoveObject: 'removeObject',
    UpdateObject: 'updateObject',
} as const;

export class NetworkMessage {
    status: 'success' | 'error' = 'success';
    message?: string;
}

export class JoinRoomMessage extends NetworkMessage {
    type: typeof MessageType.JoinRoom;
    roomId: string;
}

export class LeaveRoomMessage extends NetworkMessage {
    type: typeof MessageType.LeaveRoom;
    roomId: string;
}

export class AddObjectMessage extends NetworkMessage {
    type: typeof MessageType.AddObject;
    roomId: string;
    object: TabletopObject;
}

export class RemoveObjectMessage extends NetworkMessage {
    type: typeof MessageType.RemoveObject;
    roomId: string;
    objectId: string;
}

export class UpdateObjectMessage extends NetworkMessage {
    type: typeof MessageType.UpdateObject;
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

export type AllMessageTypes = (
    JoinRoomMessage |
    LeaveRoomMessage |
    AddObjectMessage |
    RemoveObjectMessage |
    UpdateObjectMessage
)