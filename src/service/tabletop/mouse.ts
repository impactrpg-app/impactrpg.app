import { MenuItem } from "primevue/menuitem";
import { ref } from "vue";
import {
    canvasRef,
    getImageSize,
    objectCollider,
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
            selectedObject.value = -1;
        }
    },
    {
        label: 'Delete Object',
        icon: 'pi pi-trash',
        command: () => {
            if (selectedObject.value === -1) return;
            tabletopObjects.value = tabletopObjects.value.filter((_, index) => index !== selectedObject.value);
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
    else if (event.button === 2) {
        tabletopMouse.value.rightPressed = false;
    }
}

export function onMousemove(event: MouseEvent) {
    if (!(event.target instanceof HTMLCanvasElement)) return;

    tabletopMouse.value.delta = [
        event.clientX - tabletopMouse.value.position[0],
        event.clientY - tabletopMouse.value.position[1]
    ];
    tabletopMouse.value.position = [event.clientX, event.clientY];
    tool.value.onMouseMove(event);
}

export function onScroll(event: WheelEvent) {
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

export function handleObjectContextMenu() {
    let selected = false;
    const mouseWorldPosition = screenPositionToWorldPosition(tabletopMouse.value.position);
    for (let i = tabletopObjects.value.length - 1; i >= 0; i--) {
        const object = tabletopObjects.value[i];
        if (object.type === TabletopObjectType.Image && 
            objectCollider(
                mouseWorldPosition,
                object.position,
                getImageSize((object as TabletopImageObject).image),
                tabletopCamera.value.zoom
            )
        ) {
            selected = true;
            selectedObject.value = i;
            break;
        }
    }
    if (!selected) {
        selectedObject.value = -1;
    }
}