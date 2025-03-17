import { TabletopObject } from './room';

export enum EventType {
    JoinRoom = 'joinRoom',
    LeaveRoom = 'leaveRoom',
    AddObject = 'addObject',
    RemoveObject = 'removeObject',
    UpdateObject = 'updateObject',
}

export type JoinRoomEvent = {
    type: EventType.JoinRoom;
    roomId: string;
}

export type LeaveRoomEvent = {
    type: EventType.LeaveRoom;
    roomId: string;
}

export type AddObjectEvent = {
    type: EventType.AddObject;
    roomId: string;
    object: TabletopObject;
}

export type RemoveObjectEvent = {
    type: EventType.RemoveObject;
    roomId: string;
    objectId: string;
}

export type UpdateObjectEvent = {
    type: EventType.UpdateObject;
    roomId: string;
    object: TabletopObject;
}

export type AllEvents = JoinRoomEvent | LeaveRoomEvent | AddObjectEvent | RemoveObjectEvent | UpdateObjectEvent;