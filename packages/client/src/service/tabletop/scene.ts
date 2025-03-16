import { ref } from "vue";
import * as UUID from 'uuid';

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
    public isDirty: boolean = false; // if object is dirty then it will be updated on the network
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
    middlePressed: boolean;
    overCanvas: boolean;
}>({
    delta: [0, 0],
    position: [0, 0],
    pressed: false,
    rightPressed: false,
    middlePressed: false,
    overCanvas: false,
});
export const selectedObject = ref<number>(-1);

export function addObjectToScene(type: TabletopObjectType, image?: HTMLImageElement): string {
    const id = UUID.v7();
    if (type === TabletopObjectType.Image) {
        if (!image) throw new Error('Image is required');
        tabletopObjects.value.push({
            id: id,
            type: TabletopObjectType.Image,
            position: [-tabletopCamera.value.position[0], -tabletopCamera.value.position[1]],
            rotation: 0,
            scale: 1,
            image: image,
            isDirty: true,
        } as TabletopImageObject);
    } else if (type === TabletopObjectType.Stroke) {
        tabletopObjects.value.push({
            id: id,
            type: TabletopObjectType.Stroke,
            position: [-tabletopCamera.value.position[0], -tabletopCamera.value.position[1]],
            rotation: 0,
            scale: 1,
            isDirty: true,
            strokes: [],
            strokeColor: '#000000',
            strokeWidth: 5
        } as TabletopStrokeObject);
    } else {
        throw new Error('Invalid object type');
    }
    return id;
}

export function removeObjectFromScene(id: string) {
    tabletopObjects.value = tabletopObjects.value.filter(obj => obj.id !== id);
}