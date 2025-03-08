import { tabletopCamera, TabletopImageObject, tabletopObjects, TabletopObjectType } from ".";
import { PayloadTypeEnum, sendMessage, getRoomId } from "../room";

export function onMessageReceived(payload: any): void {
    if (payload.type === PayloadTypeEnum.AddTabletopObject) {
        const objectIndex = tabletopObjects.value.findIndex(obj => obj.id === payload.payload.id);
        if (objectIndex !== -1) return;
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = payload.payload.src;
        tabletopObjects.value.push({
            id: payload.payload.id,
            type: TabletopObjectType.Image,
            position: [-tabletopCamera.value.position[0], -tabletopCamera.value.position[1]],
            rotation: 0,
            scale: 1,
            image
        } as TabletopImageObject);
    } else if (payload.type === PayloadTypeEnum.RemoveTabletopObject) {
        tabletopObjects.value = tabletopObjects.value.filter(obj => obj.id !== payload.payload.id);
    } else if (payload.type === PayloadTypeEnum.UpdateTabletopObject) {
        const objectIndex = tabletopObjects.value.findIndex(obj => obj.id === payload.payload.id);
        if (objectIndex !== -1) {
            tabletopObjects.value[objectIndex].position = payload.payload.position;
            tabletopObjects.value[objectIndex].rotation = payload.payload.rotation;
            tabletopObjects.value[objectIndex].scale = payload.payload.scale;
            tabletopObjects.value[objectIndex].locked = payload.payload.locked;
        }
    } else if (payload.type === PayloadTypeEnum.RequestTabletopObjects) {
        for (const obj of tabletopObjects.value) {
            if (obj.type === TabletopObjectType.Image) {
                addObjectToSceneNetwork(obj.id, (obj as TabletopImageObject).image.src);
                obj.isDirty = true;
            }
        }
    }
}

export function addObjectToSceneNetwork(id: string, src: string) {
    if (getRoomId() === null) return;

    sendMessage({
        type: PayloadTypeEnum.AddTabletopObject,
        payload: {
            id,
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
            locked: obj.locked,
            position: obj.position,
            rotation: obj.rotation,
            scale: obj.scale,
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