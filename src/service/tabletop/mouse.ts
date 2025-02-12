import { PayloadTypeEnum, sendMessage } from "../room";
import { MenuItem } from "primevue/menuitem";
import { ref } from "vue";
import {
    screenPositionToWorldPosition,
    selectedObject,
    tabletopCamera,
    tabletopMouse,
    tabletopObjects
} from ".";

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
        handleObjectSelection();
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
    handleDrag();
}

export function onScroll(event: WheelEvent) {
    tabletopCamera.value.zoom -= event.deltaY / 1000;
    tabletopCamera.value.zoom = Math.max(tabletopCamera.value.zoom, 0.28);
}

export function handleDrag() {
    if (!tabletopMouse.value.pressed) return;
    if (selectedObject.value !== -1) {
        tabletopObjects.value[selectedObject.value].position[0] += tabletopMouse.value.delta[0];
        tabletopObjects.value[selectedObject.value].position[1] += tabletopMouse.value.delta[1];
        sendMessage({
            type: PayloadTypeEnum.UpdateTabletopObject,
            payload: {
                id: tabletopObjects.value[selectedObject.value].id,
                position: tabletopObjects.value[selectedObject.value].position,
                rotation: tabletopObjects.value[selectedObject.value].rotation,
                scale: tabletopObjects.value[selectedObject.value].scale
            }
        });
    } else {
        tabletopCamera.value.position[0] += tabletopMouse.value.delta[0];
        tabletopCamera.value.position[1] += tabletopMouse.value.delta[1];
    }
}

export function objectCollider(
    mouse: [number, number],
    position: [number, number],
    size: [number, number],
    zoom: number
) {
    const mouseX = mouse[0];
    const mouseY = mouse[1];
    const posX = position[0] * zoom;
    const posY = position[1] * zoom;
    const width = size[0] * zoom;
    const height = size[1] * zoom;

    return (
        mouseX >= posX &&
        mouseX <= posX + width &&
        mouseY >= posY &&
        mouseY <= posY + height
    )
}

export function handleObjectSelection() {
    let selected = false;
    const mouseWorldPosition = screenPositionToWorldPosition(tabletopMouse.value.position);
    for (let i = tabletopObjects.value.length - 1; i >= 0; i--) {
        const object = tabletopObjects.value[i];
        if (
            !object.locked &&
            objectCollider(
                mouseWorldPosition,
                object.position,
                [object.image.width, object.image.height],
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

export function handleObjectContextMenu() {
    let selected = false;
    const mouseWorldPosition = screenPositionToWorldPosition(tabletopMouse.value.position);
    for (let i = tabletopObjects.value.length - 1; i >= 0; i--) {
        const object = tabletopObjects.value[i];
        if (objectCollider(
            mouseWorldPosition,
            object.position,
            [object.image.width, object.image.height],
            tabletopCamera.value.zoom
        )) {
            selected = true;
            selectedObject.value = i;
            break;
        }
    }
    if (!selected) {
        selectedObject.value = -1;
    }
}