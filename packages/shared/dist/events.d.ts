import { TabletopObject } from './room';
export declare enum EventType {
    JoinRoom = "joinRoom",
    LeaveRoom = "leaveRoom",
    AddObject = "addObject",
    RemoveObject = "removeObject",
    UpdateObject = "updateObject"
}
export declare class JoinRoomEvent {
    type: EventType.JoinRoom;
    roomId: string;
}
export declare class LeaveRoomEvent {
    type: EventType.LeaveRoom;
    roomId: string;
}
export declare class AddObjectEvent {
    type: EventType.AddObject;
    roomId: string;
    object: TabletopObject;
}
export declare class RemoveObjectEvent {
    type: EventType.RemoveObject;
    roomId: string;
    objectId: string;
}
export declare class UpdateObjectEvent {
    type: EventType.UpdateObject;
    roomId: string;
    object: TabletopObject;
}
export declare const AllEvents: (typeof JoinRoomEvent | typeof LeaveRoomEvent | typeof AddObjectEvent | typeof RemoveObjectEvent | typeof UpdateObjectEvent)[];
