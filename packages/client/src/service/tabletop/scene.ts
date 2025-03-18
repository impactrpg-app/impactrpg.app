import type { Vector2, TabletopObject, AddObjectMessage, RemoveObjectMessage, UpdateObjectMessage } from "@impact/shared";
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
const imagesCache = ref<Map<string, HTMLImageElement>>(new Map());

export function getImageElement(uuid: string, url: string) {
    if (imagesCache.value.has(uuid)) {
        return imagesCache.value.get(uuid);
    }
    const image = new Image();
    image.src = url;
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

    socket.value.emit('event', {
        type: 'addObject',
        object: object,
    } as AddObjectMessage);
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

export function updateObjectRequest(uuid: string, object: Partial<TabletopObject>) {
    if (!socket.value) {
        throw new Error('Not connected to server');
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