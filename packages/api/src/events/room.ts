import { Room as RoomSchema, TabletopObject } from '@impact/shared';
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
  findUsersRoom(userId: string): string | null {
    for (const room of this.rooms.values()) {
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
      return;
    }

    const foundRoomId = this.findUsersRoom(userId);
    if (foundRoomId) {
      await this.leaveRoom(client, foundRoomId);
    }

    if (!this.rooms.has(roomId)) {
      const query = await this.roomModel.findById(roomId);
      if (!query) {
        return;
      }
      const userId = connectedUsers.get(client);
      if (!userId) {
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
    client.emitWithAck('event', {
      type: MessageType.JoinRoom,
      roomId: roomId,
    });
  }
  async leaveRoom(client: Socket, roomId: string) {
    const userId = connectedUsers.get(client);
    if (!userId) {
      return;
    }
  
    if (!this.rooms.has(roomId)) {
      return;
    }
  
    this.rooms.get(roomId)!.users.delete({ client, userId });
    client.emitWithAck('event', {
      type: MessageType.LeaveRoom,
      roomId: roomId,
    });
  }
  async leaveAllRooms(client: Socket) {
    for (const room of this.rooms.values()) {
      this.leaveRoom(client, room.id);
    }
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
