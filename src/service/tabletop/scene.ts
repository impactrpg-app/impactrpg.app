import { ref } from "vue";
import * as UUID from 'uuid';
import { addObjectToSceneNetwork } from "./sync";

export enum TabletopObjectType {
    None,
    Image,
    Stroke
}

export class TabletopObject {
    public type: TabletopObjectType = TabletopObjectType.None;
    public id: string = UUID.v7();
    public position: [number, number] = [0, 0];
    public rotation: number = 0;
    public scale: number = 1;
    public locked?: boolean = false; // locked object cannot be moved or selected
    public owner?: string = undefined; // only owner can move the object;
}

export class TabletopImageObject extends TabletopObject {
    public type: TabletopObjectType = TabletopObjectType.Image;
    public image: HTMLImageElement = new Image();
}

export class TabletopStrokeObject extends TabletopObject {
    public type: TabletopObjectType = TabletopObjectType.Stroke;
    public strokes: [number, number][] = [];
    public strokeColor: string = '#000000';
    public strokeWidth: number = 1;
}

export type ALL_TABLETOP_OBJECT_TYPES = TabletopObject | TabletopImageObject | TabletopStrokeObject;

export const tabletopObjects = ref<ALL_TABLETOP_OBJECT_TYPES[]>([]);
export const tabletopCamera = ref<{
    position: [number, number];
    zoom: number;
}>({
    position: [0, 0],
    zoom: 1
});
export const tabletopMouse = ref<{
    delta: [number, number];
    position: [number, number];
    pressed: boolean;
    rightPressed: boolean;
}>({
    delta: [0, 0],
    position: [0, 0],
    pressed: false,
    rightPressed: false
});
export const selectedObject = ref<number>(-1);

export function addObjectToScene(image: HTMLImageElement) {
    const id = UUID.v7();
    tabletopObjects.value.push({
        id: id,
        type: TabletopObjectType.Image,
        position: [-tabletopCamera.value.position[0], -tabletopCamera.value.position[1]],
        rotation: 0,
        scale: 1,
        image: image
    } as TabletopImageObject);
    addObjectToSceneNetwork(
        id,
        image.src
    );
}

export function removeObjectFromScene(id: string) {
    tabletopObjects.value = tabletopObjects.value.filter(obj => obj.id !== id);
}