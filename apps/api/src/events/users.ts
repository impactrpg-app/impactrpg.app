import { Socket } from "socket.io";

// client id -> user id
export const connectedUsers: Map<Socket, string> = new Map();