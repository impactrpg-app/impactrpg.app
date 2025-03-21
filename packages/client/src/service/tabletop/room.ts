import { ref } from "vue";
import { socket } from "./sync";
import { JoinRoomMessage, LeaveRoomMessage } from "@impact/shared";
import { scene } from "./scene";

export const joinedRoom = ref<string | null>(null);
export function isInRoom() {
    return joinedRoom.value !== null;
}

export function leaveRoomRequest() {
    if (!socket.value) {
        throw new Error('Not connected to server');
    }
    if (!joinedRoom.value) {
        throw new Error('Not in a room');
    }
    socket.value.emit('event', new LeaveRoomMessage(joinedRoom.value));
}

export function leaveRoomResponse(message: LeaveRoomMessage) {
    if (message.roomId === joinedRoom.value) {
        scene.value = new Map();
        joinedRoom.value = null;
    }
}

export function joinRoomRequest(roomId: string) {
    if (!socket.value) {
        throw new Error('Not connected to server');
    }

    socket.value.emit('event', new JoinRoomMessage(roomId));
}

export function joinRoomResponse(message: JoinRoomMessage) {
    scene.value = new Map();
    joinedRoom.value = message.roomId;
}