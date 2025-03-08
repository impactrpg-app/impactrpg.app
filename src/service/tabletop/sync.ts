import { tabletopCamera, TabletopImageObject, tabletopObjects, TabletopObjectType, TabletopStrokeObject } from ".";
import { PayloadTypeEnum, sendMessage, getRoomId } from "../room";

function addNetworkObject(payload: { id: string, type: TabletopObjectType, src?: string }) {
    if (payload.type === TabletopObjectType.Image) {
    const objectIndex = tabletopObjects.value.findIndex(obj => obj.id === payload.id);
    if (objectIndex !== -1) return;
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = payload.src!;
    tabletopObjects.value.push({
        id: payload.id,
        type: TabletopObjectType.Image,
        position: [-tabletopCamera.value.position[0], -tabletopCamera.value.position[1]],
        rotation: 0,
        scale: 1,
            image
        } as TabletopImageObject);
    } else if (payload.type === TabletopObjectType.Stroke) {
        const objectIndex = tabletopObjects.value.findIndex(obj => obj.id === payload.id);
        if (objectIndex !== -1) return;
        tabletopObjects.value.push({
            id: payload.id,
            type: TabletopObjectType.Stroke,
            position: [-tabletopCamera.value.position[0], -tabletopCamera.value.position[1]],
            rotation: 0,
            scale: 1,
            strokes: [],
            strokeColor: '#000',
            strokeWidth: 5,
            isDirty: false
        } as TabletopStrokeObject);
    }
}

function addNetworkImageChunk(payload: { id: string, chunk: string }) {
    const objectIndex = tabletopObjects.value.findIndex(obj => obj.id === payload.id);
    if (objectIndex === -1) return;
    (tabletopObjects.value[objectIndex] as TabletopImageObject).image.src += payload.chunk;
}

export function onMessageReceived(payload: any): void {
    if (payload.type === PayloadTypeEnum.AddTabletopObject) {
        addNetworkObject(payload.payload);
    } else if (payload.type === PayloadTypeEnum.AddTabletopImageChunk) {
        addNetworkImageChunk(payload.payload);
    } else if (payload.type === PayloadTypeEnum.RemoveTabletopObject) {
        tabletopObjects.value = tabletopObjects.value.filter(obj => obj.id !== payload.payload.id);
    } else if (payload.type === PayloadTypeEnum.UpdateTabletopObject) {
        const objectIndex = tabletopObjects.value.findIndex(obj => obj.id === payload.payload.id);
        if (objectIndex !== -1) {
            tabletopObjects.value[objectIndex].position = payload.payload.position;
            tabletopObjects.value[objectIndex].rotation = payload.payload.rotation;
            tabletopObjects.value[objectIndex].scale = payload.payload.scale;
            tabletopObjects.value[objectIndex].locked = payload.payload.locked;

            if (payload.payload.strokes && payload.payload.strokes.length > 0) {
                (tabletopObjects.value[objectIndex] as TabletopStrokeObject).strokes = payload.payload.strokes;
            }
        }
    } else if (payload.type === PayloadTypeEnum.RequestTabletopObjects) {
        for (const obj of tabletopObjects.value) {
            addObjectToSceneNetwork(obj.id, obj.type, (obj as TabletopImageObject)?.image?.src);
            obj.isDirty = true;
        }
    }
}

export async function addObjectToSceneNetwork(id: string, type: TabletopObjectType, src: string) {
    if (getRoomId() === null) return;

    sendMessage({
        type: PayloadTypeEnum.AddTabletopObject,
        payload: {
            id,
            type,
            src
        }
    });
}

export function removeObjectFromSceneNetwork(id: string) {
    if (getRoomId() === null) return;

    sendMessage({
        type: PayloadTypeEnum.RemoveTabletopObject,
        payload: { id }
    });
}

export function updateObjectsOnSceneNetwork() {
    if (getRoomId() === null) return;

    const objectsToUpdate = tabletopObjects.value.filter(obj => obj.isDirty).map(obj => {
        return {
            id: obj.id,
            type: obj.type,
            locked: obj.locked,
            position: obj.position,
            rotation: obj.rotation,
            scale: obj.scale,
            strokes: (obj as TabletopStrokeObject)?.strokes || []
        };
    });

    if (objectsToUpdate.length === 0) return;

    for (const obj of objectsToUpdate) {
        sendMessage({
            type: PayloadTypeEnum.UpdateTabletopObject,
            payload: obj
        });
    }

    tabletopObjects.value = tabletopObjects.value.map(obj => ({...obj, isDirty: false }));
}