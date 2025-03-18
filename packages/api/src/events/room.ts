import { TabletopObject } from '@impact/shared';
import { connectedUsers } from './users';
import { Socket } from 'socket.io';
import { MessageType } from '@impact/shared';

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

export const rooms: Map<string, Room> = new Map();

export function triggerForAllUsersInRoom(
  roomId: string,
  callback: (user: User) => void,
) {
  const room = rooms.get(roomId);
  if (!room) {
    return;
  }
  for (const user of room.users) {
    callback(user);
  }
}

export function joinRoom(client: Socket, roomId: string) {
  const userId = connectedUsers.get(client);
  if (!userId) {
    return;
  }

  if (!rooms.has(roomId)) {
    return;
  }

  rooms.get(roomId)!.users.add({ client, userId });
}

export function leaveRoom(client: Socket, roomId: string) {
  const userId = connectedUsers.get(client);
  if (!userId) {
    return;
  }

  if (!rooms.has(roomId)) {
    return;
  }

  rooms.get(roomId)!.users.delete({ client, userId });
}

export function addObject(
  client: Socket,
  roomId: string,
  object: TabletopObject,
) {
  if (!rooms.has(roomId)) {
    return;
  }

  const userId = connectedUsers.get(client);
  if (!userId) {
    return;
  }

  const room = rooms.get(roomId);

  if (!room?.users.has({ client, userId })) {
    return;
  }

  room.tabletopObjects.push(object);
  triggerForAllUsersInRoom(roomId, (user) =>
    user.client.emit(MessageType.AddObject, object),
  );
}

export function removeObject(client: Socket, roomId: string, objectId: string) {
  if (!rooms.has(roomId)) {
    return;
  }

  const userId = connectedUsers.get(client);
  if (!userId) {
    return;
  }

  const room = rooms.get(roomId);

  if (!room?.users.has({ client, userId })) {
    return;
  }

  room.tabletopObjects = room.tabletopObjects.filter(
    (object) => object.uuid !== objectId,
  );
  triggerForAllUsersInRoom(roomId, (user) =>
    user.client.emit(MessageType.RemoveObject, objectId),
  );
}

export function updateObject(
  client: Socket,
  roomId: string,
  object: TabletopObject,
) {
  if (!rooms.has(roomId)) {
    return;
  }

  const userId = connectedUsers.get(client);
  if (!userId) {
    return;
  }

  const room = rooms.get(roomId);

  if (!room?.users.has({ client, userId })) {
    return;
  }

  const objectIndex = room.tabletopObjects.findIndex(
    (object) => object.uuid === object.uuid,
  );
  if (objectIndex === -1) {
    return;
  }

  room.tabletopObjects[objectIndex] = object;
  triggerForAllUsersInRoom(roomId, (user) =>
    user.client.emit(MessageType.UpdateObject, object),
  );
}
