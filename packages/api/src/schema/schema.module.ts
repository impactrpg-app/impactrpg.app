import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user";
import { Character, CharacterSchema } from "./character";
import { config } from "src/config";

console.log(config.mongoUri);
@Module({
    imports: [
        MongooseModule.forRoot(
            config.mongoUri, { dbName: 'impact', ssl: true }
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