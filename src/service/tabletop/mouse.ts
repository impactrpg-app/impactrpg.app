import { MenuItem } from "primevue/menuitem";
import { ref } from "vue";
import {
    canvasRef,
    getImageSize,
    getObjectAtPosition,
    objectCollider,
    removeObjectFromScene,
    screenPositionToWorldPosition,
    selectedObject,
    tabletopCamera,
    TabletopImageObject,
    tabletopMouse,
    tabletopObjects,
    TabletopObjectType
} from ".";
import { GrabTool, TabletopTool, DrawTool } from "./tools";

export const ALL_TOOLS = [
    new GrabTool(),
    new DrawTool()
];
export const tool = ref<TabletopTool>(ALL_TOOLS[0]);
export const contextMenuItems = ref<MenuItem[]>([
    {
        visible: () => selectedObject.value !== -1 && !tabletopObjects.value[selectedObject.value].locked,
        label: 'Lock Object',
        icon: 'pi pi-lock',
        command: () => {
            if (selectedObject.value === -1) return;
            tabletopObjects.value[selectedObject.value].locked = true;
            tabletopObjects.value[selectedObject.value].isDirty = true;
            selectedObject.value = -1;
        }
    },
    {
        visible: () => selectedObject.value !== -1 && !!tabletopObjects.value[selectedObject.value].locked,
        label: 'Unlock Object',
        icon: 'pi pi-lock-open',
        command: () => {
            if (selectedObject.value === -1) return;
            delete tabletopObjects.value[selectedObject.value].locked;
            tabletopObjects.value[selectedObject.value].isDirty = true;
            selectedObject.value = -1;
        }
    },
    {
        label: 'Delete Object',
        icon: 'pi pi-trash',
        command: () => {
            if (selectedObject.value === -1) return;
            removeObjectFromScene(tabletopObjects.value[selectedObject.value].id);
            selectedObject.value = -1;
        }
    }
]);

export function onMouseDown(event: MouseEvent) {
    if (!(event.target instanceof HTMLCanvasElement)) return;

    if (event.button === 0) {
        tabletopMouse.value.pressed = true;
        tool.value.onMouseDown(event);
    }
    else if (event.button === 1) {
        tabletopMouse.value.middlePressed = true;
    }
    else if (event.button === 2) {
        tabletopMouse.value.rightPressed = true;
        handleObjectContextMenu();
    }
}

export function onMouseUp(event: MouseEvent) {
    if (!(event.target instanceof HTMLCanvasElement)) return;

    if (event.button === 0) {
        tabletopMouse.value.pressed = false;
        tool.value.onMouseUp(event);
    }
    else if (event.button === 1) {
        tabletopMouse.value.middlePressed = false;
    }
    else if (event.button === 2) {
        tabletopMouse.value.rightPressed = false;
    }
}

export function onMousemove(event: MouseEvent) {
    if (!(event.target instanceof HTMLCanvasElement)) return;

    if (tabletopMouse.value.middlePressed) {
        tabletopCamera.value.position[0] += tabletopMouse.value.delta[0];
        tabletopCamera.value.position[1] += tabletopMouse.value.delta[1];
    }

    tabletopMouse.value.delta = [
        event.clientX - tabletopMouse.value.position[0],
        event.clientY - tabletopMouse.value.position[1]
    ];
    tabletopMouse.value.position = [event.clientX, event.clientY];
    tool.value.onMouseMove(event);
}

export function onScroll(event: WheelEvent) {
    if (!tabletopMouse.value.overCanvas) return;
    if (canvasRef.value) {
        const rect = canvasRef.value.getBoundingClientRect();
        if (
            event.clientX < rect.left ||
            event.clientY < rect.top ||
            event.clientX > rect.right ||
            event.clientY > rect.bottom
        ) return;
    }
    tabletopCamera.value.zoom -= event.deltaY / 1000;
    tabletopCamera.value.zoom = Math.max(tabletopCamera.value.zoom, 0.28);
}

export function onMouseOver(event: MouseEvent) {
    tabletopMouse.value.overCanvas = !!(event.target instanceof HTMLCanvasElement);
}

export function handleObjectContextMenu() {
    const mouseWorldPosition = screenPositionToWorldPosition(tabletopMouse.value.position);
    selectedObject.value = getObjectAtPosition(mouseWorldPosition);
}