import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { config } from 'src/config';
import { JwtService } from 'src/services/jwt.service';
import { connectedUsers } from './users';
import {
  addObject,
  joinRoom,
  leaveRoom,
  removeObject,
  rooms,
  updateObject,
} from './room';
import { AllEvents, EventType } from '@impact/shared';

@WebSocketGateway(config.webSocketPort, {
  transports: ['websocket'],
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly jwtService: JwtService) {}

  @SubscribeMessage('event')
  handleEvent(client: Socket, payload: AllEvents) {
    if (payload.type === EventType.JoinRoom) {
      joinRoom(client, payload.roomId);
    } else if (payload.type === EventType.LeaveRoom) {
      leaveRoom(client, payload.roomId);
    } else if (payload.type === EventType.AddObject) {
      addObject(client, payload.roomId, payload.object);
    } else if (payload.type === EventType.RemoveObject) {
      removeObject(client, payload.roomId, payload.objectId);
    } else if (payload.type === EventType.UpdateObject) {
      updateObject(client, payload.roomId, payload.object);
    } else {
      console.error(`Unknown event: ${JSON.stringify(payload)}`);
    }
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const auth = client.handshake.auth['Authorization'];
    if (!auth) {
      client.disconnect();
      return;
    }
    const token = auth.split(' ')[1];
    try {
      const decoded = await this.jwtService.verify(token);
      if (!decoded || !decoded['id']) {
        client.disconnect();
        return;
      }
      connectedUsers.set(client, decoded['id']);
    } catch (error) {
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    connectedUsers.delete(client);
    for (const [roomId, _] of rooms) {
      leaveRoom(client, roomId);
    }
  }
}
