import { TabletopObject } from './room';
export declare enum MessageType {
    JoinRoom = "joinRoom",
    LeaveRoom = "leaveRoom",
    AddObject = "addObject",
    RemoveObject = "removeObject",
    UpdateObject = "updateObject"
}
export declare class JoinRoomMessage {
    type: MessageType.JoinRoom;
    roomId: string;
}
export declare class LeaveRoomMessage {
    type: MessageType.LeaveRoom;
    roomId: string;
}
export declare class AddObjectMessage {
    type: MessageType.AddObject;
    roomId: string;
    object: TabletopObject;
}
export declare class RemoveObjectMessage {
    type: MessageType.RemoveObject;
    roomId: string;
    objectId: string;
}
export declare class UpdateObjectMessage {
    type: MessageType.UpdateObject;
    roomId: string;
    object: TabletopObject;
}
export type AllMessageTypes = JoinRoomMessage | 
    LeaveRoomMessage | 
    AddObjectMessage |
    RemoveObjectMessage |
    UpdateObjectMessage;