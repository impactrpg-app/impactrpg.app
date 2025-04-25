import { Types } from "mongoose";

export * from "./character";
export * from "./room";
export * from "./user";

export type WithUserId<T> = T & {
  _id: Types.ObjectId;
};
