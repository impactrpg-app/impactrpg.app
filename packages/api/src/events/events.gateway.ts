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
import { RoomService } from './room';
import { AllMessageTypes, MessageType } from '@impact/shared';

@WebSocketGateway(config.webSocketPort, {
  transports: ['websocket'],
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomService: RoomService,
  ) {}

  @SubscribeMessage('event')
  handleEvent(client: Socket, payload: AllMessageTypes) {
    console.log(`handleEvent ${payload.type} by ${client.id}`);

    if (payload.type === MessageType.JoinRoom) {
      this.roomService.joinRoom(client, payload.roomId);
    } else if (payload.type === MessageType.LeaveRoom) {
      this.roomService.leaveRoom(client, payload.roomId);
    } else if (payload.type === MessageType.AddObject) {
      this.roomService.addObject(client, payload.object);
    } else if (payload.type === MessageType.RemoveObject) {
      // removeObject(client, payload.roomId, payload.objectId);
    } else if (payload.type === MessageType.UpdateObject) {
      // updateObject(client, payload.roomId, payload.object);
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
      const userId = decoded['id'];
      connectedUsers.set(client, userId);
      const roomId = this.roomService.findUsersRoom(userId);
      if (roomId) {
        this.roomService.joinRoom(client, roomId);
      }
    } catch (error) {
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    connectedUsers.delete(client);
    this.roomService.leaveAllRooms(client);
  }
}
