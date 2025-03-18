import { TabletopObject } from './room';

export const MessageType = {
    Error: 'error',
    JoinRoom: 'joinRoom',
    LeaveRoom: 'leaveRoom',
    AddObject: 'addObject',
    RemoveObject: 'removeObject',
    UpdateObject: 'updateObject',
} as const;

export class ErrorMessage {
    type: typeof MessageType.Error;
    message: string;
}
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
    object: TabletopObject;
}

export class RemoveObjectMessage {
    type: typeof MessageType.RemoveObject;
    objectId: string;
}

export class UpdateObjectMessage {
    type: typeof MessageType.UpdateObject;
    objectId: string;
    object: Partial<TabletopObject>;
}

export const AllMessages = [
    ErrorMessage,
    JoinRoomMessage,
    LeaveRoomMessage,
    AddObjectMessage,
    RemoveObjectMessage,
    UpdateObjectMessage
];

export type AllMessageTypes = (
    ErrorMessage |
    JoinRoomMessage |
    LeaveRoomMessage |
    AddObjectMessage |
    RemoveObjectMessage |
    UpdateObjectMessage
)