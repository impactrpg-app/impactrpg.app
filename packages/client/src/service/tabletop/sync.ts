import { io } from 'socket.io-client';
import { getSocketHeaders } from '../api';

const socket = io('http://localhost:3001', {
    transports: ['websocket'],
    withCredentials: true,
    auth: getSocketHeaders()
});

socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('event', {
        type: 'connection',
        data: {
            message: 'Hello from client'
        }
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});


// import { PayloadTypeEnum, sendMessage, getRoomId } from "../room";

// function addNetworkObject(id: string, type: TabletopObjectType) {
//     if (type === TabletopObjectType.Image) {
//         const objectIndex = tabletopObjects.value.findIndex(obj => obj.id === id);
//         if (objectIndex !== -1) return;
//         const image = new Image();
//         image.crossOrigin = 'Anonymous';
//         image.src = "";
//         tabletopObjects.value.push({
//             id: id,
//             type: TabletopObjectType.Image,
//             position: [-tabletopCamera.value.position[0], -tabletopCamera.value.position[1]],
//             rotation: 0,
//             scale: 1,
//             image
//         } as TabletopImageObject);
//     } else if (type === TabletopObjectType.Stroke) {
//         const objectIndex = tabletopObjects.value.findIndex(obj => obj.id === id);
//         if (objectIndex !== -1) return;
//         tabletopObjects.value.push({
//             id: id,
//             type: TabletopObjectType.Stroke,
//             position: [-tabletopCamera.value.position[0], -tabletopCamera.value.position[1]],
//             rotation: 0,
//             scale: 1,
//             strokes: [],
//             strokeColor: '#000',
//             strokeWidth: 5,
//             isDirty: false
//         } as TabletopStrokeObject);
//     }
// }

// const networkChunksReceived: Map<string, { chunks: any, order: number }[]> = new Map();

// function addNetworkImageChunk(id: string, chunks: string, order: number) {
//     const existingChunks = networkChunksReceived.get(id) || [];
//     existingChunks.push({ chunks, order });
//     networkChunksReceived.set(id, existingChunks);
// }

// async function waitForSeconds(seconds: number) {
//     return new Promise(resolve => setTimeout(resolve, seconds * 1000));
// }

// async function addNetworkImageChunkEnd(id: string, total: number) {
//     const objectIndex = tabletopObjects.value.findIndex(obj => obj.id === id);
//     if (objectIndex === -1) return;

//     let chunks = networkChunksReceived.get(id) || [];
//     let attempts = 0;
//     while (chunks.length !== total && attempts < 10) {
//         await waitForSeconds(1);
//         chunks = networkChunksReceived.get(id) || [];
//         attempts++;
//     }
//     networkChunksReceived.delete(id);
//     if (chunks.length !== total) {
//         console.error("Failed to receive all chunks for object", id);
//         return;
//     }
//     chunks.sort((a, b) => a.order - b.order);
    
//     if (tabletopObjects.value[objectIndex].type === TabletopObjectType.Image) {
//         const image = (tabletopObjects.value[objectIndex] as TabletopImageObject).image;
//         image.src = chunks.map(chunk => chunk.chunks).join("");
//     } else if (tabletopObjects.value[objectIndex].type === TabletopObjectType.Stroke) {
//         const stroke = (tabletopObjects.value[objectIndex] as TabletopStrokeObject);
//         stroke.strokes = chunks.map(chunk => chunk.chunks);
//     }
// }

// export function onMessageReceived(payload: any): void {
//     if (payload.type === PayloadTypeEnum.AddTabletopObject) {
//         addNetworkObject(payload.payload.id, payload.payload.type);
//     } else if (payload.type === PayloadTypeEnum.AddTabletopChunk) {
//         addNetworkImageChunk(payload.payload.id, payload.payload.chunks, payload.payload.order);
//     } else if (payload.type === PayloadTypeEnum.AddTabletopChunkEnd) {
//         addNetworkImageChunkEnd(payload.payload.id, payload.payload.total);
//     } else if (payload.type === PayloadTypeEnum.RemoveTabletopObject) {
//         tabletopObjects.value = tabletopObjects.value.filter(obj => obj.id !== payload.payload.id);
//     } else if (payload.type === PayloadTypeEnum.UpdateTabletopObject) {
//         const objectIndex = tabletopObjects.value.findIndex(obj => obj.id === payload.payload.id);
//         if (objectIndex !== -1) {
//             tabletopObjects.value[objectIndex].position = payload.payload.position;
//             tabletopObjects.value[objectIndex].rotation = payload.payload.rotation;
//             tabletopObjects.value[objectIndex].scale = payload.payload.scale;
//             tabletopObjects.value[objectIndex].locked = payload.payload.locked;
//         }
//     } else if (payload.type === PayloadTypeEnum.RequestTabletopObjects) {
//         for (const obj of tabletopObjects.value) {
//             addObjectToSceneNetwork(obj.id, obj.type);
//             obj.isDirty = true;
//         }
//     }
// }

// export async function addObjectToSceneNetwork(id: string, type: TabletopObjectType) {
//     if (getRoomId() === null) return;

//     console.log("addObjectToSceneNetwork", id, type);
//     sendMessage({
//         type: PayloadTypeEnum.AddTabletopObject,
//         payload: {
//             id,
//             type
//         }
//     });
//     await syncObjectContents(id);
// }

// export async function syncObjectContents(id: string) {
//     const object = tabletopObjects.value.find(obj => obj.id === id);
//     if (!object) return;

//     let total = 0;
//     if (object.type === TabletopObjectType.Image) {
//         const image = object as TabletopImageObject;
//         const chunks = image.image.src.match(/.{1,100000}/g) || [];
//         total = chunks.length;
//         for (let i = 0; i < chunks.length; i++) {
//             sendMessage({
//                 type: PayloadTypeEnum.AddTabletopChunk,
//                 payload: { id, chunks: chunks[i], order: i }
//             });
//             await waitForSeconds(0.01); // for rate limiting
//         }
//     } else if (object.type === TabletopObjectType.Stroke) {
//         const stroke = object as TabletopStrokeObject;
//         for (let i = 0; i < stroke.strokes.length; i += 1000) {
//             sendMessage({
//                 type: PayloadTypeEnum.AddTabletopChunk,
//                 payload: { id, chunks: stroke.strokes.slice(i, i + 1000), order: i }
//             });
//             total++;
//             await waitForSeconds(0.01); // for rate limiting
//         }
//     }

//     sendMessage({
//         type: PayloadTypeEnum.AddTabletopChunkEnd,
//         payload: { id, total }
//     });
// }

// export function removeObjectFromSceneNetwork(id: string) {
//     if (getRoomId() === null) return;

//     sendMessage({
//         type: PayloadTypeEnum.RemoveTabletopObject,
//         payload: { id }
//     });
// }

// export function updateObjectsOnSceneNetwork() {
//     if (getRoomId() === null) return;

//     const objectsToUpdate = tabletopObjects.value.filter(obj => obj.isDirty).map(obj => {
//         return {
//             id: obj.id,
//             type: obj.type,
//             locked: obj.locked,
//             position: obj.position,
//             rotation: obj.rotation,
//             scale: obj.scale
//         };
//     });

//     if (objectsToUpdate.length === 0) return;

//     for (const obj of objectsToUpdate) {
//         sendMessage({
//             type: PayloadTypeEnum.UpdateTabletopObject,
//             payload: obj
//         });
//     }

//     tabletopObjects.value = tabletopObjects.value.map(obj => ({...obj, isDirty: false }));
// }