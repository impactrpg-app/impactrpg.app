import { ref } from "vue";
import { socket } from "./sync";
import type { JoinRoomMessage, LeaveRoomMessage } from "@impact/shared";

export const joinedRoom = ref<string | null>(null);
export function isInRoom() {
    return joinedRoom.value !== null;
}

export function leaveRoomRequest() {
    if (!socket.value) {
        throw new Error('Not connected to server');
    }

    socket.value.emit('event', {
        type: 'leaveRoom',
        roomId: joinedRoom.value
    } as LeaveRoomMessage);
}

export function leaveRoomResponse(message: LeaveRoomMessage) {
    if (message.roomId === joinedRoom.value) {
        joinedRoom.value = null;
    }
}

export function joinRoomRequest(roomId: string) {
    if (!socket.value) {
        throw new Error('Not connected to server');
    }

    socket.value.emit('event', {
        type: 'joinRoom',
        roomId
    } as JoinRoomMessage);
}

export function joinRoomResponse(message: JoinRoomMessage) {
    joinedRoom.value = message.roomId;
}