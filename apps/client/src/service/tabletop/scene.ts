import {
  Vector2,
  TabletopObject,
  AddObjectMessage,
  RemoveObjectMessage,
  UpdateObjectMessage,
} from "@impact/shared";
import { ref } from "vue";
import { socket } from "./sync";
import { API_URL } from "../api";

export const camera = ref<{
  position: Vector2;
  zoom: number;
}>({
  position: { x: 0, y: 0 },
  zoom: 1,
});
export const selectedObjects = ref<Set<string>>(new Set());
export const scene = ref<Map<string, TabletopObject>>(new Map());
export const imagesCache = ref<Map<string, HTMLImageElement>>(new Map());
const updateThrottle = ref<Map<string, number>>(new Map());

export function getImageElement(uuid: string, imageSrc: string) {
  if (imagesCache.value.has(uuid)) {
    return imagesCache.value.get(uuid);
  }
  const image = new Image();
  image.src = imageSrc;
  image.crossOrigin = "anonymous";
  imagesCache.value.set(uuid, image);
  return image;
}

export async function addObjectRequest(object: TabletopObject) {
  if (!socket) {
    throw new Error("Not connected to server");
  }

  if (object.type === "image" && !object.image) {
    throw new Error("Image is required");
  } else if (object.type === "stroke" && !object.strokes) {
    throw new Error("Strokes are required");
  }
  if (object.type === "image" && object.image && object.image.length > 1024) {
    throw new Error('image is too large, please upload it first');
  }
  socket.emit("event", new AddObjectMessage(object));
}

export function addObjectResponse(message: AddObjectMessage) {
  scene.value.set(message.object.uuid, message.object);
}

export function removeObjectRequest(object: TabletopObject) {
  if (!socket) {
    throw new Error("Not connected to server");
  }

  if (object.type === "image") {
    imagesCache.value.delete(object.uuid);
  }

  socket.emit("event", {
    type: "removeObject",
    objectId: object.uuid,
  } as RemoveObjectMessage);
}

export function removeObjectResponse(message: RemoveObjectMessage) {
  imagesCache.value.delete(message.objectId);
  scene.value.delete(message.objectId);
}

export function updateObjectRequest(
  uuid: string,
  object: Partial<TabletopObject>,
  disableThrottle: boolean = false
) {
  if (!socket) {
    throw new Error("Not connected to server");
  }

  if (!disableThrottle) {
    if (
      updateThrottle.value.has(uuid) &&
      updateThrottle.value.get(uuid)! > Date.now()
    ) {
      return;
    }
    updateThrottle.value.set(uuid, Date.now() + 10);
  }

  socket.emit("event", new UpdateObjectMessage(uuid, object));
}

export function updateObjectResponse(message: UpdateObjectMessage) {
  if (!scene.value.has(message.objectId)) {
    throw new Error("Object not found");
  }

  scene.value.set(message.objectId, {
    ...scene.value.get(message.objectId)!,
    ...message.object,
  });
}
