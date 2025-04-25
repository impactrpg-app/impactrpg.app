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
import {
  AddObjectMessage,
  DiceRollMessage,
  ErrorMessage,
  JoinRoomMessage,
  LeaveRoomMessage,
  MessageType,
  RemoveObjectMessage,
  RoomInfoMessage,
  SendNotificationMessage,
  UpdateObjectMessage,
} from "@impact/shared";
import { validate } from "class-validator";

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

  private async verifyMessagePayload<T extends object>(
    payload: T,
    prototype: object
  ): Promise<string[]> {
    const data = Object.setPrototypeOf(payload, prototype) as T;
    const errors = await validate(data);
    if (errors.length === 0) {
      return [];
    }
    // flatten constraints and send them as a single array
    const issues = errors.map((err) => Object.values(err.constraints)).flat();
    return issues;
  }

  private async handleInvalidPayloads<T extends object>(
    client: Socket,
    payload: T,
    prototype: object,
    callback: () => void
  ) {
    const issues = await this.verifyMessagePayload(payload, prototype);
    if (issues.length > 0) {
      client.emit(
        MessageType.Error,
        new ErrorMessage(400, `\n${issues.join("\n")}`)
      );
      return;
    }
    callback();
  }

  @SubscribeMessage(MessageType.JoinRoom)
  handleJoinRoom(client: Socket, payload: JoinRoomMessage) {
    this.handleInvalidPayloads(client, payload, JoinRoomMessage.prototype, () =>
      this.roomService.joinRoom(client, payload.roomId)
    );
  }

  @SubscribeMessage(MessageType.LeaveRoom)
  handleLeaveRoom(client: Socket, payload: LeaveRoomMessage) {
    this.handleInvalidPayloads(
      client,
      payload,
      LeaveRoomMessage.prototype,
      () => this.roomService.leaveRoom(client, payload.roomId)
    );
  }

  @SubscribeMessage(MessageType.AddObject)
  handleAddObject(client: Socket, payload: AddObjectMessage) {
    this.handleInvalidPayloads(
      client,
      payload,
      AddObjectMessage.prototype,
      () => this.roomService.addObject(client, payload.object)
    );
  }

  @SubscribeMessage(MessageType.RemoveObject)
  handleRemoveObject(client: Socket, payload: RemoveObjectMessage) {
    this.handleInvalidPayloads(
      client,
      payload,
      RemoveObjectMessage.prototype,
      () => this.roomService.removeObject(client, payload.objectId)
    );
  }

  @SubscribeMessage(MessageType.UpdateObject)
  handleUpdateObject(client: Socket, payload: UpdateObjectMessage) {
    this.handleInvalidPayloads(
      client,
      payload,
      UpdateObjectMessage.prototype,
      () =>
        this.roomService.updateObject(client, payload.objectId, payload.object)
    );
  }

  @SubscribeMessage(MessageType.SendNotification)
  handleSendNotification(client: Socket, payload: SendNotificationMessage) {
    this.handleInvalidPayloads(
      client,
      payload,
      SendNotificationMessage.prototype,
      () => this.roomService.sendNotification(client, payload.message)
    );
  }

  @SubscribeMessage(MessageType.DiceRoll)
  handleDiceRoll(client: Socket, payload: DiceRollMessage) {
    this.handleInvalidPayloads(client, payload, DiceRollMessage.prototype, () =>
      this.roomService.diceRoll(client, payload)
    );
  }

  @SubscribeMessage(MessageType.RoomInfo)
  handleRoomInfo(client: Socket, payload: RoomInfoMessage) {
    this.handleInvalidPayloads(client, payload, RoomInfoMessage.prototype, () =>
      this.roomService.updateRoomInfo(client, payload)
    );
  }

  @SubscribeMessage(MessageType.Error)
  handleError(client: Socket, payload: ErrorMessage) {
    console.error(`Error from client ${client.id}: ${payload.message}`);
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
