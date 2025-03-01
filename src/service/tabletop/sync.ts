import { tabletopCamera, TabletopImageObject, tabletopObjects, TabletopObjectType } from ".";
import { PayloadTypeEnum, sendMessage } from "../room";

export function onMessageReceived(payload: any): void {
    if (payload.type === PayloadTypeEnum.AddTabletopObject) {
        console.log(payload);
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        tabletopObjects.value.push({
            id: payload.payload.id,
            type: TabletopObjectType.Image,
            position: [-tabletopCamera.value.position[0], -tabletopCamera.value.position[1]],
            rotation: 0,
            scale: 1,
            image: payload.payload.src
        } as TabletopImageObject);
    }
}

export function addObjectToSceneNetwork(id: string, src: string) {
    sendMessage({
        type: PayloadTypeEnum.AddTabletopObject,
        payload: {
            id,
            src
        }
    });
}