import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);