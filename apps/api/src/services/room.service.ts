import {
  AddObjectMessage,
  ErrorMessage,
  JoinRoomMessage,
  LeaveRoomMessage,
  RemoveObjectMessage,
  SendNotificationMessage,
  UpdateObjectMessage,
} from "@impact/shared";
import { connectedUsers } from "../events/users";
import { Socket } from "socket.io";
import { MessageType } from "@impact/shared";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { Room as RoomSchema } from "src/db/room";
import { TabletopObject } from "src/db/room";
import { StorageService } from "src/services/storage.service";
import { CronExpression } from "@nestjs/schedule";
import { Cron } from "@nestjs/schedule";

export type Room = {
  id: string;
  users: Map<string, Socket>; // userId -> Socket
  owner: string;
  tabletopObjects: TabletopObject[];
};

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  constructor(
    @InjectModel(RoomSchema.name)
    private readonly roomModel: Model<RoomSchema>,
    private readonly storageService: StorageService
  ) {}

  private async saveRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    await this.roomModel.findByIdAndUpdate(roomId, {
      objects: room.tabletopObjects,
    });
  }

  private async syncAllObjectsToClient(client: Socket) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    const roomId = this.findUsersRoom(userId);
    if (!roomId) {
      client.emit("event", {
        type: MessageType.Error,
        message: "Room not found",
      } as ErrorMessage);
      return;
    }

    for (const object of this.rooms.get(roomId)!.tabletopObjects) {
      client.emit("event", {
        type: MessageType.AddObject,
        object,
      } as AddObjectMessage);
    }
  }

  triggerForAllUsersInRoom(
    roomId: string,
    callback: (userId: string, socket: Socket) => void,
    excludeUserId: string[] = []
  ) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    for (const [userId, socket] of room.users) {
      if (excludeUserId.includes(userId)) {
        continue;
      }
      callback(userId, socket);
    }
  }

  findUsersRoom(userId: string, excludedRoomIds: string[] = []): string | null {
    for (const room of this.rooms.values()) {
      if (excludedRoomIds.includes(room.id)) {
        continue;
      }
      for (const user of room.users) {
        if (user[0] === userId) {
          return room.id;
        }
      }
    }
    return null;
  }
  private verifyUser(client: Socket): {
    userId: string;
    room: Room;
    error: boolean;
  } {
    const userId = connectedUsers.get(client);
    if (!userId) {
      console.error("User Id not found");
      client.disconnect();
      return { userId: null, room: null, error: true };
    }

    const roomId = this.findUsersRoom(userId);
    if (!roomId) {
      console.error("Room Id not found");
      client.emit("event", {
        type: MessageType.Error,
        message: "Room not found",
      } as ErrorMessage);
      return { userId, room: null, error: true };
    }

    const room = this.rooms.get(roomId);
    if (!room) {
      console.error("Room not found");
      client.emit("event", {
        type: MessageType.Error,
        message: "Room not found",
      } as ErrorMessage);
      return { userId, room, error: true };
    }

    return { userId, room, error: false };
  }

  async joinRoom(client: Socket, roomId: string) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    if (!Types.ObjectId.isValid(roomId)) {
      client.emit("event", new ErrorMessage(404, "Room not found"));
      return;
    }

    const foundRoomId = this.findUsersRoom(userId, [roomId]);
    if (foundRoomId) {
      await this.leaveRoom(client, foundRoomId);
    }

    if (!this.rooms.has(roomId)) {
      const query = await this.roomModel.findById(roomId);
      if (!query) {
        client.emit("event", new ErrorMessage(404, "Room not found"));
        return;
      }
      this.rooms.set(roomId, {
        id: roomId,
        users: new Map([[userId, client]]),
        owner: userId,
        tabletopObjects: query.objects,
      });
    }

    this.rooms.get(roomId)!.users.set(userId, client);
    client.emit("event", {
      type: MessageType.JoinRoom,
      roomId: roomId,
    } as JoinRoomMessage);
    await this.syncAllObjectsToClient(client);
  }
  async leaveRoom(client: Socket, roomId: string) {
    const { userId, room, error } = this.verifyUser(client);
    if (error) {
      return;
    }

    room.users.delete(userId);
    client.emit("event", {
      type: MessageType.LeaveRoom,
      roomId: roomId,
    } as LeaveRoomMessage);
    if (room.users.size === 0) {
      await this.saveRoom(roomId);
      this.rooms.delete(roomId);
    }
  }
  async leaveAllRooms(client: Socket) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    let roomId = this.findUsersRoom(userId);
    while (roomId) {
      this.leaveRoom(client, roomId);
      roomId = this.findUsersRoom(userId);
    }
  }
  async addObject(client: Socket, object: TabletopObject) {
    const { room, error } = this.verifyUser(client);
    if (error) {
      return;
    }

    this.rooms.get(room.id)!.tabletopObjects.push(object);
    // todo: replace image content with url
    this.triggerForAllUsersInRoom(room.id, (_userId, socket) =>
      socket.emit("event", {
        type: MessageType.AddObject,
        object: object,
      } as AddObjectMessage)
    );
  }
  async removeObject(client: Socket, objectId: string) {
    const { userId, room, error } = this.verifyUser(client);
    if (error) {
      return;
    }

    const object = room.tabletopObjects.find(
      (object) => object.uuid === objectId
    );
    if (!object) {
      client.emit("event", {
        type: MessageType.Error,
        message: "Object not found",
      } as ErrorMessage);
      return;
    }
    if (object.image) {
      const imageId = object.image.replace(
        new RegExp("http[s]*://[a-zA-Z0-9\:\.]+/image/"),
        ""
      );
      await this.storageService.delete(decodeURIComponent(imageId));
    }
    room.tabletopObjects = room.tabletopObjects.filter(
      (object) => object.uuid !== objectId
    );
    this.triggerForAllUsersInRoom(room.id, (_userId, socket) =>
      socket.emit("event", {
        type: MessageType.RemoveObject,
        objectId: objectId,
      } as RemoveObjectMessage)
    );
  }
  async updateObject(
    client: Socket,
    objectId: string,
    object: Partial<TabletopObject>
  ) {
    const { userId, room, error } = this.verifyUser(client);
    if (error) {
      return;
    }

    const objectIndex = room.tabletopObjects.findIndex(
      (object) => object.uuid === objectId
    );
    if (objectIndex === -1) {
      client.emit("event", {
        type: MessageType.Error,
        message: "Object not found",
      } as ErrorMessage);
      return;
    }

    this.rooms.get(room.id)!.tabletopObjects[objectIndex] = {
      ...this.rooms.get(room.id)!.tabletopObjects[objectIndex],
      ...object,
    };
    this.triggerForAllUsersInRoom(
      room.id,
      (userId, socket) =>
        socket.emit("event", {
          type: MessageType.UpdateObject,
          objectId: objectId,
          object: object,
        } as UpdateObjectMessage),
      [userId]
    );
  }
  async sendNotification(client: Socket, message: string, image?: string) {
    const { room, error } = this.verifyUser(client);
    if (error) {
      return;
    }

    this.triggerForAllUsersInRoom(room.id, (_userId, socket) =>
      socket.emit("event", {
        type: MessageType.SendNotification,
        message: message,
        image: image,
      } as SendNotificationMessage)
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async saveRooms() {
    console.log("Saving rooms");
    for (const room of this.rooms.values()) {
      await this.saveRoom(room.id);
    }
  }
}
