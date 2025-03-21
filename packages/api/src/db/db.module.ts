import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { config } from "src/config";
import {
    Room,
    RoomSchema
} from "src/db/room";
import {
    User,
    UserSchema
} from "src/db/user";
import {
    Character,
    CharacterSchema
} from "src/db/character";

@Module({
    imports: [
        MongooseModule.forRoot(
            config.mongoUri, { dbName: 'impact', ssl: config.enableSSL }
        ),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            },
            {
                name: Character.name,
                schema: CharacterSchema
            },
            {
                name: Room.name,
                schema: RoomSchema
            }
        ])
    ],
    exports: [
        MongooseModule
    ]
})
export class DatabaseModule {}