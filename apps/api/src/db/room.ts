import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type RoomDocument = HydratedDocument<Room>;

export const TabletopObjectType = {
  None: "none",
  Image: "image",
  Stroke: "stroke",
} as const;

export type TabletopObjectType =
  (typeof TabletopObjectType)[keyof typeof TabletopObjectType];

export class Vector3 {
  x: number;
  y: number;
  z: number;
}
export class Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export class TabletopObject {
  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  position: Vector3;

  @Prop({ required: true })
  rotation: Vector4;

  @Prop({ required: true })
  scale: Vector3;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  modules: any;
}

@Schema()
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  })
  owner: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: [TabletopObject],
  })
  objects: TabletopObject[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
