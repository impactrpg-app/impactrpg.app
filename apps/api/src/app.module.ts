import { Module } from "@nestjs/common";
import { DatabaseModule } from "./db/db.module";
import { AuthController } from "./controllers/auth.controller";
import { JwtService } from "./services/jwt.service";
import { CharacterController } from "./controllers/character.controller";
import { EventsGateway } from "./events/events.gateway";
import { HealthCheckController } from "./controllers/healthCheck.controller";
import { RoomController } from "./controllers/room.controller";
import { RoomService } from "./events/room";
import { ImageController } from "./controllers/image.controller";
import { ConfigModule } from "@nestjs/config";
import { StorageService } from "./services/storage.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  controllers: [
    AuthController,
    CharacterController,
    RoomController,
    HealthCheckController,
    ImageController,
  ],
  providers: [JwtService, EventsGateway, RoomService, StorageService],
})
export class AppModule {}
