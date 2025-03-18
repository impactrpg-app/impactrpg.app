import { AddObjectMessage, ErrorMessage, JoinRoomMessage, LeaveRoomMessage, Room as RoomSchema, TabletopObject } from '@impact/shared';
import { connectedUsers } from './users';
import { Socket } from 'socket.io';
import { MessageType } from '@impact/shared';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

export type User = {
  client: Socket;
  userId: string;
};

export type Room = {
  id: string;
  users: Set<User>;
  owner: string;
  tabletopObjects: TabletopObject[];
};

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  constructor(
    @InjectModel(RoomSchema.name)
    private readonly roomModel: Model<RoomSchema>,
  ){}

  private triggerForAllUsersInRoom(roomId: string, callback: (user: User) => void) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    for (const user of room.users) {
      callback(user);
    }
  }
  findUsersRoom(userId: string, excludedRoomIds: string[] = []): string | null {
    for (const room of this.rooms.values()) {
      if (excludedRoomIds.includes(room.id)) {
        continue;
      }
      for (const user of room.users) {
        if (user.userId === userId) {
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
        users: new Set([{ client, userId }]),
        owner: userId,
        tabletopObjects: query.objects,
      });
    }
  
    this.rooms.get(roomId)!.users.add({ client, userId });
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
  
    this.rooms.get(roomId)!.users.delete({ client, userId });
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
    while(roomId) {
      this.leaveRoom(client, roomId);
      roomId = this.findUsersRoom(userId);
    }
  }

  async syncAllObjectsToClient(client: Socket) {
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
      client.emit('event', {
        type: MessageType.AddObject,
        object: object,
      } as AddObjectMessage);
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
    this.triggerForAllUsersInRoom(roomId, (user) =>
      user.client.emit('event', {
        type: MessageType.AddObject,
        object: object,
      } as AddObjectMessage),
    );
  }
}

// export function addObject(
//   client: Socket,
//   roomId: string,
//   object: TabletopObject,
// ) {
//   if (!rooms.has(roomId)) {
//     return;
//   }

//   const userId = connectedUsers.get(client);
//   if (!userId) {
//     return;
//   }

//   const room = rooms.get(roomId);

//   if (!room?.users.has({ client, userId })) {
//     return;
//   }

//   room.tabletopObjects.push(object);
//   triggerForAllUsersInRoom(roomId, (user) =>
//     user.client.emit(MessageType.AddObject, object),
//   );
// }

// export function removeObject(client: Socket, roomId: string, objectId: string) {
//   if (!rooms.has(roomId)) {
//     return;
//   }

//   const userId = connectedUsers.get(client);
//   if (!userId) {
//     return;
//   }

//   const room = rooms.get(roomId);

//   if (!room?.users.has({ client, userId })) {
//     return;
//   }

//   room.tabletopObjects = room.tabletopObjects.filter(
//     (object) => object.uuid !== objectId,
//   );
//   triggerForAllUsersInRoom(roomId, (user) =>
//     user.client.emit(MessageType.RemoveObject, objectId),
//   );
// }

// export function updateObject(
//   client: Socket,
//   roomId: string,
//   object: TabletopObject,
// ) {
//   if (!rooms.has(roomId)) {
//     return;
//   }

//   const userId = connectedUsers.get(client);
//   if (!userId) {
//     return;
//   }

//   const room = rooms.get(roomId);

//   if (!room?.users.has({ client, userId })) {
//     return;
//   }

//   const objectIndex = room.tabletopObjects.findIndex(
//     (object) => object.uuid === object.uuid,
//   );
//   if (objectIndex === -1) {
//     return;
//   }

//   room.tabletopObjects[objectIndex] = object;
//   triggerForAllUsersInRoom(roomId, (user) =>
//     user.client.emit(MessageType.UpdateObject, object),
//   );
// }
