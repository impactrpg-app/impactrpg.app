import { io, Socket } from "socket.io-client";
import { ref } from "vue";
import { getSocketHeaders, SOCKET_URL } from "../api";
import type { AllMessageTypes } from "@impact/shared";
import { joinRoomResponse, leaveRoomResponse } from "./room";
import { addObjectResponse, removeObjectResponse, updateObjectResponse } from "./scene";

export const socket = ref<Socket | null>(null);

socket.value = io(SOCKET_URL, {
    auth: getSocketHeaders(),
    withCredentials: true,
    transports: ['websocket']
});

socket.value.on('event', (data: AllMessageTypes) => {
    switch (data.type) {
        case 'error':
            break;
        case 'joinRoom':
            joinRoomResponse(data);
            break;
        case 'leaveRoom':
            leaveRoomResponse(data);
            break;
        case 'addObject':
            addObjectResponse(data);
            break;
        case 'removeObject':
            removeObjectResponse(data);
            break;
        case 'updateObject':
            updateObjectResponse(data);
            break;
        default:
            console.error(`Unknown event: ${data}`);
    }
});