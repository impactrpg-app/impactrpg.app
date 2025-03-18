import { MenuItem } from "primevue/menuitem";
import { TabletopTool } from "./tools/base";
import { io, Socket } from 'socket.io-client';
import { ref } from "vue";
import { SOCKET_URL, getSocketHeaders } from "../api";
import type { AllMessageTypes, JoinRoomMessage, LeaveRoomMessage } from "@impact/shared";

export const contextMenuItems = ref<MenuItem[]>([
    {
        label: 'Delete Object',
        icon: 'pi pi-trash',
        command: () => {
            console.log('Delete Object');
        }
    }
]);

export const ALL_TOOLS = [
    new TabletopTool(),
];
export const tool = ref<TabletopTool>(ALL_TOOLS[0]);
export const joinedRoom = ref<string | null>(null);
export const socket = ref<Socket | null>(null);

export function isInRoom() {
    return joinedRoom.value !== null;
}

export function init(canvas?: HTMLCanvasElement | null) {
    socket.value = io(SOCKET_URL, {
        auth: getSocketHeaders(),
        withCredentials: true,
        transports: ['websocket']
    });

    socket.value.on('event', (data: AllMessageTypes) => {
        console.log('event', data);
        if (data.type === 'joinRoom') {
            joinRoomResponse(data.roomId);
        } else if (data.type === 'leaveRoom') {
            leaveRoomResponse();
        }
    });
}

export function onResize(event: UIEvent) {

}

export function onMouseDown(event: MouseEvent) {

}

export function onMouseUp(event: MouseEvent) {

}

export function onMousemove(event: MouseEvent) {

}

export function onScroll(event: WheelEvent) {

}

export function onMouseOver(event: MouseEvent) {

}

export function onKeyDown(event: KeyboardEvent) {

}

export function onUpdate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {

}

export function onContextMenu(event: MouseEvent) {
    event.preventDefault();
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

export function leaveRoomResponse() {
    joinedRoom.value = null;
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

export function joinRoomResponse(roomId: string) {
    joinedRoom.value = roomId;
}