import { io, Socket } from "socket.io-client";
import { ref } from "vue";
import { getSocketHeaders, SOCKET_URL } from "../api";
import type { AllMessageTypes, ImageChunkMessage, ImageChunkMessageEnd } from "@impact/shared";
import { joinRoomResponse, leaveRoomResponse } from "./room";
import { addObjectResponse, imagesCache, removeObjectResponse, scene, updateObjectResponse } from "./scene";

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
        case 'imageChunk':
            imageChunkResponse(data);
            break;
        case 'imageChunkEnd':
            imageChunkEndResponse(data);
            break;
        default:
            console.error(`Unknown event: ${data}`);
    }
});

type ImageChunk = {
    data: number[];
    count: number;
}

const imageChunks: Map<string, ImageChunk[]> = new Map();

function imageChunkResponse(data: ImageChunkMessage) {
    const object = scene.value.get(data.objectId);
    if (!object) {
        return;
    }

    if (object.type === 'image') {
        imageChunks.set(object.uuid, [...(imageChunks.get(object.uuid) || []), {
            data: data.chunk,
            count: data.count,
        }]);
    }
}

async function imageChunkEndResponse(data: ImageChunkMessageEnd) {
    const object = scene.value.get(data.objectId);
    if (!object) {
        return;
    }

    const chunks = imageChunks.get(object.uuid);
    if (!chunks) {
        return;
    }

    let timeout = 0;
    while (chunks.length < data.totalChunks) {
      await new Promise(resolve => setTimeout(() => {
        timeout++;
        resolve(null);
      }, 100));
      if (timeout > 50) {
        imageChunks.delete(object.uuid);
        return;
      }
    }

    const imageArray = new Uint8Array(
        chunks.sort((a, b) => a.count - b.count).map(chunk => chunk.data).flat()
    );
    const image = Buffer.from(imageArray).toString();
    object.image = image;
    imageChunks.delete(object.uuid);
    imagesCache.value.delete(object.uuid);
}