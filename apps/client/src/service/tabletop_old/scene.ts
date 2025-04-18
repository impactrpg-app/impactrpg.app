import {
  Vector2,
  TabletopObject,
  AddObjectMessage,
  RemoveObjectMessage,
  UpdateObjectMessage,
  AllMessageTypes,
  MessageType,
} from "@impact/shared";
import { ref } from "vue";
import { socket } from "./sync";

export const camera = ref<{
  position: Vector2;
  zoom: number;
}>({
  position: new Vector2(0, 0),
  zoom: 1,
});
export const selectedObjects = ref<Set<string>>(new Set());
export const scene = ref<Map<string, TabletopObject>>(new Map());
export const imagesCache = ref<Map<string, HTMLImageElement>>(new Map());
const updateThrottle = ref<Map<string, number>>(new Map());

type HistoryItem = {
  performedActions: AllMessageTypes[];
  revertActions: AllMessageTypes[];
};

const history = ref<HistoryItem[]>([]);
const redoHistory = ref<HistoryItem[]>([]);

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

export async function addObjectRequest(
  object: TabletopObject,
  addToHistory: boolean = true
) {
  if (!socket) {
    throw new Error("Not connected to server");
  }

  if (object.type === "image" && !object.image) {
    throw new Error("Image is required");
  } else if (object.type === "stroke" && !object.strokes) {
    throw new Error("Strokes are required");
  }
  if (object.type === "image" && object.image && object.image.length > 1024) {
    throw new Error("image is too large, please upload it first");
  }
  socket.emit("event", new AddObjectMessage(object));
  if (addToHistory) {
    pushToHistory(
      [new AddObjectMessage(object)],
      [new RemoveObjectMessage(object.uuid)]
    );
  }
}

export function addObjectResponse(message: AddObjectMessage) {
  if ("strokes" in message.object) {
    message.object.strokes = message.object.strokes!.map((stroke) =>
      Vector2.convert(stroke)
    );
  }
  message.object.position = Vector2.convert(message.object.position);
  scene.value.set(message.object.uuid, message.object);
  sortScene();
}

export function removeObjectRequest(
  object: TabletopObject,
  addToHistory: boolean = true
) {
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
  if (addToHistory) {
    pushToHistory(
      [new RemoveObjectMessage(object.uuid)],
      [new AddObjectMessage(object)]
    );
  }
}

export function removeObjectResponse(message: RemoveObjectMessage) {
  if (!scene.value.get(message.objectId)) return;
  imagesCache.value.delete(message.objectId);
  scene.value.delete(message.objectId);
}

export function updateObjectRequest(
  uuid: string,
  object: Partial<TabletopObject>,
  addToHistory: boolean = true,
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
  
  if (addToHistory) {
    pushToHistory(
      [new UpdateObjectMessage(uuid, object)],
      [new UpdateObjectMessage(uuid, scene.value.get(uuid)! as TabletopObject)]
    );
  }

  scene.value.set(uuid, {
    ...scene.value.get(uuid)!,
    ...object,
    uuid,
  });
  socket.emit("event", new UpdateObjectMessage(uuid, object));
}

export function updateObjectResponse(message: UpdateObjectMessage) {
  if (!scene.value.has(message.objectId)) {
    throw new Error("Object not found");
  }

  if ("position" in message.object) {
    message.object.position = Vector2.convert(message.object.position!);
  }
  if ("strokes" in message.object) {
    message.object.strokes = message.object.strokes!.map((stroke) =>
      Vector2.convert(stroke)
    );
  }

  scene.value.set(message.objectId, {
    ...scene.value.get(message.objectId)!,
    ...message.object,
  });
  sortScene();
}

export function sortScene() {
  const sortedScene = [...scene.value.values()].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  scene.value = new Map(sortedScene.map((object) => [object.uuid, object]));
}

export function clearHistory() {
  history.value = [];
}

export function undo() {
  if (history.value.length === 0) return;
  const item = history.value.pop();
  if (!item) return;
  for (const action of item.revertActions) {
    socket?.emit("event", action);
    if (action.type === MessageType.UpdateObject) {
      updateObjectResponse(action as UpdateObjectMessage);
    }
  }
  redoHistory.value.push(item);
}

export function redo() {
  if (redoHistory.value.length === 0) return;
  const item = redoHistory.value.pop();
  if (!item) return;
  for (const action of item.performedActions) {
    socket?.emit("event", action);
    if (action.type === MessageType.UpdateObject) {
      updateObjectResponse(action as UpdateObjectMessage);
    }
  }
  history.value.push(item);
}

export function pushToHistory(
  action: AllMessageTypes[],
  revertAction: AllMessageTypes[]
) {
  history.value.push({
    performedActions: action,
    revertActions: revertAction,
  });
}
