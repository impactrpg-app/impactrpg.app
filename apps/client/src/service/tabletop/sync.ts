import { io, type Socket } from "socket.io-client";
import { ref } from "vue";
import { API_URL, getSocketHeaders } from "../api";
import {
  MessageType,
  type AllMessageTypes,
  type ImageChunkMessage,
  type ImageChunkMessageEnd,
} from "@impact/shared";
import { joinRoomResponse, leaveRoomResponse } from "./room";
import {
  addObjectResponse,
  imagesCache,
  removeObjectResponse,
  scene,
  updateObjectResponse,
} from "./scene";

export let socket: Socket | null = null;

export function init() {
  socket = io(API_URL, {
    auth: getSocketHeaders(),
    withCredentials: true,
    transports: ["websocket"],
  });

  socket.on("event", (data: AllMessageTypes) => {
    switch (data.type) {
      case MessageType.Error:
        break;
      case MessageType.JoinRoom:
        joinRoomResponse(data);
        break;
      case MessageType.LeaveRoom:
        leaveRoomResponse(data);
        break;
      case MessageType.AddObject:
        addObjectResponse(data);
        break;
      case MessageType.RemoveObject:
        removeObjectResponse(data);
        break;
      case MessageType.UpdateObject:
        updateObjectResponse(data);
        break;
      case MessageType.ImageChunk:
        imageChunkResponse(data);
        break;
      case MessageType.ImageChunkEnd:
        imageChunkEndResponse(data);
        break;
      default:
        console.error(`Unknown event: ${data}`);
    }
  });
}

type ImageChunk = {
  data: number[];
  count: number;
};

const imageChunks: Map<string, ImageChunk[]> = new Map();

function imageChunkResponse(data: ImageChunkMessage) {
  const object = scene.value.get(data.objectId);
  if (!object) {
    return;
  }

  if (object.type === "image") {
    imageChunks.set(object.uuid, [
      ...(imageChunks.get(object.uuid) || []),
      {
        data: data.chunk,
        count: data.count,
      },
    ]);
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
    await new Promise((resolve) =>
      setTimeout(() => {
        timeout++;
        resolve(null);
      }, 100)
    );
    if (timeout > 50) {
      imageChunks.delete(object.uuid);
      return;
    }
  }

  const imageArray = new Uint8Array(
    chunks
      .sort((a, b) => a.count - b.count)
      .map((chunk) => chunk.data)
      .flat()
  );
  const image = Buffer.from(imageArray).toString();
  object.image = image;
  imageChunks.delete(object.uuid);
  imagesCache.value.delete(object.uuid);
}
