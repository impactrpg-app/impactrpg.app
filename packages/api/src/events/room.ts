import {
  AddObjectMessage,
  ErrorMessage,
  ImageChunkMessage,
  ImageChunkMessageEnd,
  JoinRoomMessage,
  LeaveRoomMessage,
  RemoveObjectMessage,
  Room as RoomSchema,
  TabletopObject,
  UpdateObjectMessage,
  User,
} from '@impact/shared';
import { connectedUsers } from './users';
import { Socket } from 'socket.io';
import { MessageType } from '@impact/shared';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

export type Room = {
  id: string;
  users: Map<string, Socket>; // userId -> Socket
  owner: string;
  tabletopObjects: TabletopObject[];
};

type ImageChunk = {
  data: number[];
  count: number;
};

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();
  private imageChunks: Map<string, ImageChunk[]> = new Map();

  constructor(
    @InjectModel(RoomSchema.name)
    private readonly roomModel: Model<RoomSchema>,
  ) {}

  private triggerForAllUsersInRoom(
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

  private async syncAllObjectsToClient(client: Socket) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    const roomId = this.findUsersRoom(userId);
    if (!roomId) {
      client.emit('event', {
        type: MessageType.Error,
        message: 'Room not found',
      } as ErrorMessage);
      return;
    }

    for (const object of this.rooms.get(roomId)!.tabletopObjects) {
      let chunks: number[] = [];
      if (object.type === 'image' && object.image) {
        const encoder = new TextEncoder();
        const arr = encoder.encode(object.image);
        chunks = Array.from(arr);
      }

      client.emit('event', {
        type: MessageType.AddObject,
        object: {
          ...object,
          image: 'undefined',
        },
      } as AddObjectMessage);

      if (chunks.length > 0) {
        let count = 0;
        while (chunks.length > 0) {
          const chunk = chunks.splice(0, 100_000);
          client.emit('event', {
            type: MessageType.ImageChunk,
            objectId: object.uuid,
            count: count++,
            chunk: chunk,
          } as ImageChunkMessage);
        }
        client.emit('event', {
          type: MessageType.ImageChunkEnd,
          objectId: object.uuid,
          totalChunks: count,
        } as ImageChunkMessageEnd);
      }
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

  async joinRoom(client: Socket, roomId: string) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    const foundRoomId = this.findUsersRoom(userId, [roomId]);
    if (foundRoomId) {
      await this.leaveRoom(client, foundRoomId);
    }

    if (!this.rooms.has(roomId)) {
      const query = await this.roomModel.findById(roomId);
      if (!query) {
        client.emit('event', {
          type: MessageType.Error,
          message: 'Room not found',
        } as ErrorMessage);
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
    client.emit('event', {
      type: MessageType.JoinRoom,
      roomId: roomId,
    } as JoinRoomMessage);
    await this.syncAllObjectsToClient(client);
  }
  async leaveRoom(client: Socket, roomId: string) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    if (!this.rooms.has(roomId)) {
      client.emit('event', {
        type: MessageType.Error,
        message: 'Room not found',
      } as ErrorMessage);
      return;
    }

    const room = this.rooms.get(roomId)!;
    room.users.delete(userId);
    client.emit('event', {
      type: MessageType.LeaveRoom,
      roomId: roomId,
    } as LeaveRoomMessage);
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
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    const roomId = this.findUsersRoom(userId);
    if (!roomId) {
      client.emit('event', {
        type: MessageType.Error,
        message: 'Room not found',
      } as ErrorMessage);
      return;
    }

    this.rooms.get(roomId)!.tabletopObjects.push(object);
    this.triggerForAllUsersInRoom(roomId, (_userId, socket) =>
      socket.emit('event', {
        type: MessageType.AddObject,
        object: object,
      } as AddObjectMessage),
    );
  }

  async removeObject(client: Socket, objectId: string) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    const roomId = this.findUsersRoom(userId);
    if (!roomId) {
      client.emit('event', {
        type: MessageType.Error,
        message: 'Room not found',
      } as ErrorMessage);
      return;
    }

    this.rooms.get(roomId)!.tabletopObjects = this.rooms
      .get(roomId)!
      .tabletopObjects.filter((object) => object.uuid !== objectId);
    this.triggerForAllUsersInRoom(roomId, (userId, socket) =>
      socket.emit('event', {
        type: MessageType.RemoveObject,
        objectId: objectId,
      } as RemoveObjectMessage),
    );
  }

  async updateObject(
    client: Socket,
    objectId: string,
    object: Partial<TabletopObject>,
  ) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    const roomId = this.findUsersRoom(userId);
    if (!roomId) {
      client.emit('event', {
        type: MessageType.Error,
        message: 'Room not found',
      } as ErrorMessage);
      return;
    }

    const objectIndex = this.rooms
      .get(roomId)!
      .tabletopObjects.findIndex((object) => object.uuid === objectId);
    if (objectIndex === -1) {
      client.emit('event', {
        type: MessageType.Error,
        message: 'Object not found',
      } as ErrorMessage);
      return;
    }

    this.rooms.get(roomId)!.tabletopObjects[objectIndex] = {
      ...this.rooms.get(roomId)!.tabletopObjects[objectIndex],
      ...object,
    };
    this.triggerForAllUsersInRoom(roomId, (userId, socket) =>
      socket.emit('event', {
        type: MessageType.UpdateObject,
        objectId: objectId,
        object: object,
      } as UpdateObjectMessage),
      [userId],
    );
  }

  async imageChunk(
    client: Socket,
    objectId: string,
    chunk: number[],
    count: number,
  ) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    const roomId = this.findUsersRoom(userId);
    if (!roomId) {
      client.emit('event', {
        type: MessageType.Error,
        message: 'Room not found',
      } as ErrorMessage);
      return;
    }

    const objectIndex = this.rooms
      .get(roomId)!
      .tabletopObjects.findIndex((object) => object.uuid === objectId);
    if (objectIndex === -1) {
      client.emit('event', {
        type: MessageType.Error,
        message: 'Object not found',
      } as ErrorMessage);
      return;
    }

    this.imageChunks.set(objectId, [
      ...(this.imageChunks.get(objectId) || []),
      {
        data: chunk,
        count: count,
      },
    ]);
    this.triggerForAllUsersInRoom(roomId, (_userId, socket) =>
      socket.emit('event', {
        type: MessageType.ImageChunk,
        objectId: objectId,
        chunk: chunk,
        count: count,
      } as ImageChunkMessage),
    );
  }

  async imageChunkEnd(client: Socket, objectId: string, totalChunks: number) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      client.disconnect();
      return;
    }

    const roomId = this.findUsersRoom(userId);
    if (!roomId) {
      client.emit('event', {
        type: MessageType.Error,
        message: 'Room not found',
      } as ErrorMessage);
      return;
    }

    const objectIndex = this.rooms
      .get(roomId)!
      .tabletopObjects.findIndex((object) => object.uuid === objectId);
    if (objectIndex === -1) {
      client.emit('event', {
        type: MessageType.Error,
        message: 'Object not found',
      } as ErrorMessage);
      return;
    }

    const imageChunks = this.imageChunks.get(objectId);
    if (!imageChunks) {
      client.emit('event', {
        type: MessageType.Error,
        message: 'Object not found',
      } as ErrorMessage);
      return;
    }

    let timeout = 0;
    while (imageChunks.length < totalChunks) {
      await new Promise((resolve) =>
        setTimeout(() => {
          timeout++;
          resolve(null);
        }, 100),
      );
      if (timeout > 50) {
        client.emit('event', {
          type: MessageType.Error,
          message: 'Object not found',
        } as ErrorMessage);
        this.imageChunks.delete(objectId);
        return;
      }
    }

    const data = imageChunks
      .sort((a, b) => a.count - b.count)
      .map((chunk) => chunk.data)
      .flat();
    const imageArray = new Uint8Array(data);
    const imageString = Buffer.from(imageArray).toString();
    this.rooms.get(roomId)!.tabletopObjects[objectIndex].image = imageString;
    this.imageChunks.delete(objectId);

    this.triggerForAllUsersInRoom(roomId, (_userId, socket) =>
      socket.emit('event', {
        type: MessageType.ImageChunkEnd,
        objectId: objectId,
        totalChunks: totalChunks,
      } as ImageChunkMessageEnd),
    );
  }
}
