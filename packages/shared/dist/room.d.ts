import mongoose, { HydratedDocument } from "mongoose";
export type RoomDocument = HydratedDocument<Room>;
export declare enum TabletopObjectType {
    None = 0,
    Image = 1,
    Stroke = 2
}
export declare class Vector2 {
    x: number;
    y: number;
}
export declare class TabletopObject {
    uuid: string;
    type: TabletopObjectType;
    position: Vector2;
    rotation: number;
    scale: number;
    locked: boolean;
    image?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeColor?: string;
}
export declare class Room {
    name: string;
    owner: mongoose.Schema.Types.ObjectId;
    objects: TabletopObject[];
}
export declare const RoomSchema: mongoose.Schema<Room, mongoose.Model<Room, any, any, any, mongoose.Document<unknown, any, Room> & Room & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Room, mongoose.Document<unknown, {}, mongoose.FlatRecord<Room>> & mongoose.FlatRecord<Room> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
