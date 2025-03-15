import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user";
import { Character, CharacterSchema } from "./character";

@Module({
    imports: [
        MongooseModule.forRoot(
            process.env.MONGO_URI ?? 
            'mongodb://admin:password@127.0.0.1:27017/?directConnection=true', {
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