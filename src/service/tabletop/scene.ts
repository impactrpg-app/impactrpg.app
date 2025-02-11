import { ref } from "vue";
import * as UUID from 'uuid';

export type TabletopObject = {
    id: string;
    position: [number, number];
    rotation: number;
    scale: number;
    image: HTMLImageElement;
    locked?: boolean; // locked object cannot be moved or selected
    owner?: string; // only owner can move the object
};

export const tabletopObjects = ref<TabletopObject[]>([]);
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
    tabletopObjects.value.push({
        id: UUID.v7(),
        position: [-tabletopCamera.value.position[0], -tabletopCamera.value.position[1]],
        rotation: 0,
        scale: 1,
        image: image
    });
}

export function removeObjectFromScene(id: string) {
    tabletopObjects.value = tabletopObjects.value.filter(obj => obj.id !== id);
}