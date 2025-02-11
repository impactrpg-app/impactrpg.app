import { TabletopObject, tabletopObjects } from ".";
import { PayloadTypeEnum, sendMessage } from "../room";

export type TabletopObjectForRequest = {
    id: string;
    position: [number, number];
    rotation: number;
    scale: number;
    image: string;
};

export function tabletopObjectToRequest(obj: TabletopObject): TabletopObjectForRequest {
    return {
        id: obj.id,
        position: obj.position,
        rotation: obj.rotation,
        scale: obj.scale,
        image: obj.image.src
    }
}

export function tabletopObjectFromRequest(obj: TabletopObjectForRequest): TabletopObject {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = obj.image;
    return {
        ...obj,
        image: image
    }
}

export function onMessageReceived(payload: any): void {
    switch(payload.type) {
        case PayloadTypeEnum.ListTabletopObjects:
            tabletopObjects.value = payload.payload.map(tabletopObjectFromRequest);
            break;
        case PayloadTypeEnum.AddTabletopObject:
            tabletopObjects.value.push(tabletopObjectFromRequest(payload.payload));
            break;
        case PayloadTypeEnum.RemoveTabletopObject:
            tabletopObjects.value = tabletopObjects.value.filter(obj => obj.id !== payload.payload.id);
            break;
        case PayloadTypeEnum.UpdateTabletopObject:
            const index = tabletopObjects.value.findIndex(obj => obj.id === payload.payload.id);
            if (index !== -1) {
                tabletopObjects.value[index].position = payload.payload.position;
                tabletopObjects.value[index].rotation = payload.payload.rotation;
                tabletopObjects.value[index].scale = payload.payload.scale;
            }
            break;
        case PayloadTypeEnum.RequestTabletopObjects:
            sendMessage({
                type: PayloadTypeEnum.ListTabletopObjects,
                payload: tabletopObjects.value.map(tabletopObjectToRequest)
            });
            break;
    }
}