import { Module } from '@nestjs/common';
import { DatabaseModule } from './db.module';
import { AuthController } from './controllers/auth.controller';
import { JwtService } from './services/jwt.service';
import { CharacterController } from './controllers/character.controller';
import { EventsGateway } from './events/events.gateway';
import { HealthCheckController } from './controllers/healthCheck.controller';

@Module({
  imports: [ DatabaseModule ],
  controllers: [
    AuthController,
    CharacterController,
    HealthCheckController
  ],
  providers: [
    JwtService,
    EventsGateway
  ]
})
export class AppModule {}
