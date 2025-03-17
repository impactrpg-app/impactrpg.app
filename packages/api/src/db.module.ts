import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { config } from "src/config";
import { 
    User,
    UserSchema,
    Character,
    CharacterSchema,
    Room,
    RoomSchema
} from "@impact/shared";

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