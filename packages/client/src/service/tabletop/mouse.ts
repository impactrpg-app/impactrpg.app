import { Vector2 } from "@impact/shared";
import { MenuItem } from "primevue/menuitem";
import { ref } from "vue";
import { camera } from "./scene";

const mouse = ref<{
    position: Vector2;
    delta: Vector2;
    overCanvas: boolean;
    leftClickDown: boolean;
    rightClickDown: boolean;
    middleClickDown: boolean;
}>({
    position: { x: 0, y: 0 },
    delta: { x: 0, y: 0 },
    overCanvas: false,
    leftClickDown: false,
    rightClickDown: false,
    middleClickDown: false,
});
export const contextMenuItems = ref<MenuItem[]>([
    {
        label: 'Delete Object',
        icon: 'pi pi-trash',
        command: () => {
            console.log('Delete Object');
        }
    }
]);

export function onMouseDown(event: MouseEvent) {

}

export function onMouseUp(event: MouseEvent) {

}

export function onMousemove(event: MouseEvent) {

}

export function onScroll(event: WheelEvent) {
    if (!mouse.value.overCanvas) return;
    camera.value.zoom -= event.deltaY / 1000;
    camera.value.zoom = Math.min(Math.max(camera.value.zoom, 0.28), 3.0);
}

export function onMouseOver(event: MouseEvent) {
    mouse.value.overCanvas = !!(event.target instanceof HTMLCanvasElement);
}

export function onContextMenu(event: MouseEvent, contextMenuRef: any) {
    contextMenuRef.show(event);
}