import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user";
import { Character, CharacterSchema } from "./character";
import { config } from "src/config";

@Module({
    imports: [
        MongooseModule.forRoot(
            config.mongoUri,
            {
                dbName: 'impact'
            }
        ),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            },
            {
                name: Character.name,
                schema: CharacterSchema
            }
        ])
    ],
    exports: [
        MongooseModule
    ]
})
export class SchemaModule {}