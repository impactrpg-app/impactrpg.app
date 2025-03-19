import type { Vector2, TabletopObject, AddObjectMessage, RemoveObjectMessage, UpdateObjectMessage, ImageChunkMessage, ImageChunkMessageEnd } from "@impact/shared";
import { ref } from "vue";
import { socket } from "./sync";

export const camera = ref<{
    position: Vector2;
    zoom: number;
}>({
    position: { x: 0, y: 0 },
    zoom: 1
});
export const selectedObject = ref<string | null>(null);
export const scene = ref<Map<string, TabletopObject>>(new Map());
export const imagesCache = ref<Map<string, HTMLImageElement>>(new Map());
const updateThrottle = ref<Map<string, number>>(new Map());

export function getImageElement(uuid: string, imageSrc: string) {
    if (imagesCache.value.has(uuid)) {
        return imagesCache.value.get(uuid);
    }
    const image = new Image();
    image.src = imageSrc;
    imagesCache.value.set(uuid, image);
    return image;
}

export function addObjectRequest(object: TabletopObject) {
    if (!socket.value) {
        throw new Error('Not connected to server');
    }

    if (object.type === 'image' && !object.image) {
        throw new Error('Image is required');
    } else if (object.type === 'stroke' && !object.strokes) {
        throw new Error('Strokes are required');
    }

    let chunks: number[] = [];
    if (object.type === 'image' && object.image) {
        const encoder = new TextEncoder();
        const arr = encoder.encode(object.image);
        chunks = Array.from(arr);
        object.image = 'undefined';
    }

    socket.value.emit('event', {
        type: 'addObject',
        object: object,
    } as AddObjectMessage);

    if (chunks.length > 0) {
        let count = 0;
        while (chunks.length > 0) {
            const chunk = chunks.splice(0, 100_000);
            socket.value.emit('event', {
                type: 'imageChunk',
                objectId: object.uuid,
                count: count++,
                chunk: chunk,
            } as ImageChunkMessage);
        }
        socket.value.emit('event', {
            type: 'imageChunkEnd',
            objectId: object.uuid,
            totalChunks: count,
        } as ImageChunkMessageEnd);
    }
}

export function addObjectResponse(message: AddObjectMessage) {
    scene.value.set(message.object.uuid, message.object);
}

export function removeObjectRequest(object: TabletopObject) {
    if (!socket.value) {
        throw new Error('Not connected to server');
    }

    if (object.type === 'image') {
        imagesCache.value.delete(object.uuid);
    }

    socket.value.emit('event', {
        type: 'removeObject',
        objectId: object.uuid,
    } as RemoveObjectMessage);
}

export function removeObjectResponse(message: RemoveObjectMessage) {
    imagesCache.value.delete(message.objectId);
    scene.value.delete(message.objectId);
}

export function updateObjectRequest(uuid: string, object: Partial<TabletopObject>, disableThrottle: boolean = false) {
    if (!socket.value) {
        throw new Error('Not connected to server');
    }

    if (!disableThrottle) {
        if (updateThrottle.value.has(uuid) && updateThrottle.value.get(uuid)! > Date.now()) {
            return;
        }
        updateThrottle.value.set(uuid, Date.now() + 10);
    }

    socket.value.emit('event', {
        type: 'updateObject',
        objectId: uuid,
        object: object,
    } as UpdateObjectMessage);
}

export function updateObjectResponse(message: UpdateObjectMessage) {
    if (!scene.value.has(message.objectId)) {
        throw new Error('Object not found');
    }

    scene.value.set(message.objectId, {
        ...scene.value.get(message.objectId)!,
        ...message.object,
    });
}