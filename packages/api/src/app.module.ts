import { Module } from '@nestjs/common';
import { SchemaModule } from './schema/schema.module';
import { AuthController } from './controllers/auth';
import { JwtService } from './services/jwt';
import { CharacterController } from './controllers/character';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [ SchemaModule ],
  controllers: [
    AuthController,
    CharacterController
  ],
  providers: [
    JwtService,
    EventsGateway
  ],
})
export class AppModule {}
