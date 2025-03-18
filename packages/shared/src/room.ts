import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RoomDocument = HydratedDocument<Room>;

export const TabletopObjectType = {
    None: 'none',
    Image: 'image',
    Stroke: 'stroke'
} as const;

export type TabletopObjectType = (typeof TabletopObjectType)[keyof typeof TabletopObjectType];

export class Vector2 {
    x: number;
    y: number;
}

export class TabletopObject {
    @Prop({required: true})
    uuid: string;

    @Prop({ required: true, type: TabletopObjectType })
    type: TabletopObjectType;

    @Prop({required: true})
    position: Vector2;

    @Prop({required: true})
    rotation: number;

    @Prop({required: true})
    scale: number;

    @Prop({required: true})
    locked: boolean;

    @Prop({ required: false })
    image?: string;

    @Prop({ required: false })
    stroke?: string;

    @Prop({ required: false })
    strokeWidth?: number;

    @Prop({ required: false })
    strokeColor?: string;
}

@Schema()
export class Room {
    @Prop({required: true})
    name: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    owner: mongoose.Schema.Types.ObjectId;

    @Prop({
        required: true,
        type: [TabletopObject]
    })
    objects: TabletopObject[]
}

export const RoomSchema = SchemaFactory.createForClass(Room);