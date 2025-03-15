import { Module } from '@nestjs/common';
import { SchemaModule } from './schema/schema.module';
import { AuthController } from './controllers/auth.controller';
import { JwtService } from './services/jwt.service';
import { CharacterController } from './controllers/character.controller';
import { EventsGateway } from './events/events.gateway';
import { HealthCheckController } from './controllers/healthCheck.controller';

@Module({
  imports: [ SchemaModule ],
  controllers: [
    AuthController,
    CharacterController,
    HealthCheckController
  ],
  providers: [
    JwtService,
    EventsGateway
  ],
})
export class AppModule {}
