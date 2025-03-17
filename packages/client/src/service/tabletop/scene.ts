import { TabletopObject } from '@impact/shared';
import { ref } from "vue";

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