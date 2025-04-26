import {
  AddObjectMessage,
  DiceRollMessage,
  ErrorMessage,
  JoinRoomMessage,
  LeaveRoomMessage,
  NetworkModuleType,
  NetworkUser,
  RemoveObjectMessage,
  RoomInfoMessage,
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
import { UserService } from "./user.service";

export type Room = {
  id: string;
  users: Map<string, Socket>; // userId -> Socket
  owner: string;
  rollTarget: number;
  name: string;
  tabletopObjects: TabletopObject[];
};

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  constructor(
    @InjectModel(RoomSchema.name)
    private readonly roomModel: Model<RoomSchema>,
    private readonly storageService: StorageService,
    private readonly userService: UserService
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
      client.emit(MessageType.Error, new ErrorMessage(404, "Room not found"));
      return;
    }

    for (const object of this.rooms.get(roomId)!.tabletopObjects) {
      client.emit(MessageType.AddObject, new AddObjectMessage(object));
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
      client.emit(MessageType.Error, new ErrorMessage(404, "Room not found"));
      return { userId, room: null, error: true };
    }

    const room = this.rooms.get(roomId);
    if (!room) {
      console.error("Room not found");
      client.emit(MessageType.Error, new ErrorMessage(404, "Room not found"));
      return { userId, room, error: true };
    }

    return { userId, room, error: false };
  }

  private async sendNewRoomInfo(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    const userIds = [...room.users.keys()];
    const users = await this.userService.getUsersById(userIds);
    const displayNames = users.map(
      (user) =>
        ({
          displayName: user.displayName,
          uuid: user._id.toString(),
        }) as NetworkUser
    );
    const message = new RoomInfoMessage(
      room.owner,
      room.name,
      room.rollTarget,
      displayNames
    );
    this.triggerForAllUsersInRoom(room.id, (_userId, socket) =>
      socket.emit(MessageType.RoomInfo, message)
    );
  }
  async updateRoomInfo(client: Socket, roomInfo: RoomInfoMessage) {
    const { userId, room, error } = this.verifyUser(client);
    if (error) {
      return;
    }
    if (userId !== room.owner) {
      client.emit(MessageType.Error, new ErrorMessage(403, "Not the owner"));
      return;
    }
    await this.roomModel.findOneAndUpdate(
      { _id: new Types.ObjectId(room.id) },
      { rollTarget: roomInfo.rollTarget, name: roomInfo.roomName }
    );
    room.rollTarget = roomInfo.rollTarget;
    room.name = roomInfo.roomName;
    const userIds = roomInfo.users.map((user) => user.uuid);
    for (const user of room.users) {
      if (!userIds.includes(user[0])) {
        await this.sendNotification(
          user[1],
          "You have been kicked from the room"
        );
        await this.leaveRoom(user[1], room.id);
      }
    }
    this.rooms.set(room.id, room);
    this.sendNewRoomInfo(room.id);
  }
  async joinRoom(client: Socket, roomId: string) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    if (!Types.ObjectId.isValid(roomId)) {
      client.emit(MessageType.Error, new ErrorMessage(404, "Room not found"));
      return;
    }

    const foundRoomId = this.findUsersRoom(userId, [roomId]);
    if (foundRoomId) {
      await this.leaveRoom(client, foundRoomId);
    }

    if (!this.rooms.has(roomId)) {
      const query = await this.roomModel.findById(roomId);
      if (!query) {
        client.emit(MessageType.Error, new ErrorMessage(404, "Room not found"));
        return;
      }
      this.rooms.set(roomId, {
        id: roomId,
        users: new Map([[userId, client]]),
        owner: userId,
        tabletopObjects: query.objects,
        rollTarget: query.rollTarget,
        name: query.name,
      });
    }

    this.rooms.get(roomId)!.users.set(userId, client);
    client.emit(MessageType.JoinRoom, new JoinRoomMessage(roomId));
    await this.syncAllObjectsToClient(client);
    await this.sendNewRoomInfo(roomId);
  }
  async leaveRoom(client: Socket, roomId: string) {
    const { userId, room, error } = this.verifyUser(client);
    if (error) {
      return;
    }

    room.users.delete(userId);
    client.emit(MessageType.LeaveRoom, new LeaveRoomMessage(roomId));
    if (room.users.size === 0) {
      await this.saveRoom(roomId);
      this.rooms.delete(roomId);
    } else {
      await this.sendNewRoomInfo(roomId);
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
      await this.leaveRoom(client, roomId);
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
      socket.emit(MessageType.AddObject, new AddObjectMessage(object))
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
    for (const module of object.modules) {
      if (module.type === NetworkModuleType.ImageRenderer) {
        const imageId = module.image.replace(
          new RegExp("http[s]*://[a-zA-Z0-9\:\.]+/image/"),
          ""
        );
        await this.storageService.delete(decodeURIComponent(imageId));
      }
    }
    if (!object) {
      client.emit(MessageType.Error, new ErrorMessage(404, "Object not found"));
      return;
    }
    room.tabletopObjects = room.tabletopObjects.filter(
      (object) => object.uuid !== objectId
    );
    this.triggerForAllUsersInRoom(room.id, (_userId, socket) =>
      socket.emit(MessageType.RemoveObject, new RemoveObjectMessage(objectId))
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
      client.emit(MessageType.Error, new ErrorMessage(404, "Object not found"));
      return;
    }

    this.rooms.get(room.id)!.tabletopObjects[objectIndex] = {
      ...this.rooms.get(room.id)!.tabletopObjects[objectIndex],
      ...object,
    };
    this.triggerForAllUsersInRoom(
      room.id,
      (userId, socket) =>
        socket.emit(
          MessageType.UpdateObject,
          new UpdateObjectMessage(objectId, object)
        ),
      [userId]
    );
  }
  async sendNotification(client: Socket, message: string) {
    const { room, error } = this.verifyUser(client);
    if (error) {
      return;
    }

    this.triggerForAllUsersInRoom(room.id, (_userId, socket) =>
      socket.emit(
        MessageType.SendNotification,
        new SendNotificationMessage(message)
      )
    );
  }
  async diceRoll(client: Socket, payload: DiceRollMessage) {
    const { userId, room, error } = this.verifyUser(client);
    if (error) {
      return;
    }

    this.triggerForAllUsersInRoom(
      room.id,
      (_userId, socket) =>
        socket.emit(MessageType.DiceRoll, new DiceRollMessage(payload.props)),
      [userId]
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
