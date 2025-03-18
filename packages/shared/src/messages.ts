import { TabletopObject } from './room';

export const MessageType = {
    JoinRoom: 'joinRoom',
    LeaveRoom: 'leaveRoom',
    AddObject: 'addObject',
    RemoveObject: 'removeObject',
    UpdateObject: 'updateObject',
} as const;

export class JoinRoomMessage {
    type: typeof MessageType.JoinRoom;
    roomId: string;
}

export class LeaveRoomMessage {
    type: typeof MessageType.LeaveRoom;
    roomId: string;
}

export class AddObjectMessage {
    type: typeof MessageType.AddObject;
    roomId: string;
    object: TabletopObject;
}

export class RemoveObjectMessage {
    type: typeof MessageType.RemoveObject;
    roomId: string;
    objectId: string;
}

export class UpdateObjectMessage {
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