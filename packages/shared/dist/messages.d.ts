import { TabletopObject } from './room';
export declare const MessageType: {
    readonly JoinRoom: "joinRoom";
    readonly LeaveRoom: "leaveRoom";
    readonly AddObject: "addObject";
    readonly RemoveObject: "removeObject";
    readonly UpdateObject: "updateObject";
};
export declare class JoinRoomMessage {
    type: typeof MessageType.JoinRoom;
    roomId: string;
}
export declare class LeaveRoomMessage {
    type: typeof MessageType.LeaveRoom;
    roomId: string;
}
export declare class AddObjectMessage {
    type: typeof MessageType.AddObject;
    roomId: string;
    object: TabletopObject;
}
export declare class RemoveObjectMessage {
    type: typeof MessageType.RemoveObject;
    roomId: string;
    objectId: string;
}
export declare class UpdateObjectMessage {
    type: typeof MessageType.UpdateObject;
    roomId: string;
    object: TabletopObject;
}
export declare const AllMessages: (typeof JoinRoomMessage | typeof LeaveRoomMessage | typeof AddObjectMessage | typeof RemoveObjectMessage | typeof UpdateObjectMessage)[];
export type AllMessageTypes = (JoinRoomMessage | LeaveRoomMessage | AddObjectMessage | RemoveObjectMessage | UpdateObjectMessage);
