import { Module } from "@nestjs/common";
import { DatabaseModule } from "./db/db.module";
import { AuthController } from "./controllers/auth.controller";
import { JwtService } from "./services/jwt.service";
import { CharacterController } from "./controllers/character.controller";
import { EventsGateway } from "./events/events.gateway";
import { HealthCheckController } from "./controllers/healthCheck.controller";
import { RoomController } from "./controllers/room.controller";
import { RoomService } from "./services/room.service";
import { ImageController } from "./controllers/image.controller";
import { ConfigModule } from "@nestjs/config";
import { StorageService } from "./services/storage.service";
import { ScheduleModule } from "@nestjs/schedule";
import { ObjectController } from "./controllers/object.controller";
import { UserService } from "./services/user.service";
import { GeneralController } from "./controllers/general.controller";
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
  ],
  controllers: [
    AuthController,
    CharacterController,
    RoomController,
    HealthCheckController,
    ImageController,
    ObjectController,
    GeneralController,
  ],
  providers: [
    JwtService,
    EventsGateway,
    RoomService,
    StorageService,
    UserService,
  ],
})
export class AppModule {}
