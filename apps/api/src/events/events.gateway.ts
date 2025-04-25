import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { JwtService } from "src/services/jwt.service";
import { connectedUsers } from "./users";
import { RoomService } from "../services/room.service";
import { AllMessageTypes, ErrorMessage, MessageType } from "@impact/shared";

@WebSocketGateway({
  transports: ["websocket"],
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: JwtService,
    private readonly roomService: RoomService
  ) {}

  @SubscribeMessage("event")
  handleEvent(client: Socket, payload: AllMessageTypes) {
    console.log(`handleEvent ${payload.type} by ${client.id}`);

    switch (payload.type) {
      case MessageType.JoinRoom:
        this.roomService.joinRoom(client, payload.roomId);
        break;
      case MessageType.LeaveRoom:
        this.roomService.leaveRoom(client, payload.roomId);
        break;
      case MessageType.AddObject:
        this.roomService.addObject(client, payload.object);
        break;
      case MessageType.RemoveObject:
        this.roomService.removeObject(client, payload.objectId);
        break;
      case MessageType.UpdateObject:
        this.roomService.updateObject(client, payload.objectId, payload.object);
        break;
      case MessageType.SendNotification:
        this.roomService.sendNotification(client, payload.message);
        break;
      case MessageType.DiceRoll:
        this.roomService.diceRoll(client, payload);
        break;
      case MessageType.RoomInfo:
        this.roomService.updateRoomInfo(client, payload);
        break;
      default:
        console.error(`Unknown event: ${JSON.stringify(payload)}`);
    }
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const auth = client.handshake.auth["Authorization"];
    if (!auth) {
      client.emit("event", new ErrorMessage(401, "Unauthorized"));
      client.disconnect();
      return;
    }
    const token = auth.split(" ")[1];
    try {
      const decoded = await this.jwtService.verify(token);
      if (!decoded || !decoded["id"]) {
        client.emit("event", new ErrorMessage(401, "Unauthorized"));
        client.disconnect();
        return;
      }
      const userId = decoded["id"];
      connectedUsers.set(client, userId);
      const roomId = this.roomService.findUsersRoom(userId);
      if (roomId) {
        this.roomService.joinRoom(client, roomId);
      }
    } catch (error) {
      client.emit("event", new ErrorMessage(500, "Internal Server Error"));
      console.error(`Error verifying token: ${error}`);
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    this.roomService.leaveAllRooms(client);
    connectedUsers.delete(client);
  }
}
