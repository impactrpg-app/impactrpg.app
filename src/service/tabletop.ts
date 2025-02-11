import { ref } from "vue";

export const tabletopObjects = ref<{
    position: [number, number];
    rotation: number;
    scale: number;
    image: HTMLImageElement;
}[]>([]);
export const tabletopCamera = ref<{
    position: [number, number];
}>({
    position: [0, 0]
});
export const tabletopMouse = ref<{
    delta: [number, number];
    position: [number, number];
    pressed: boolean;
}>({
    delta: [0, 0],
    position: [0, 0],
    pressed: false
});
export const selectedObject = ref<number>(-1);
export const canvasRef = ref<HTMLCanvasElement>();

export function onResize(canvas: HTMLCanvasElement) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

export function onKeyDown(event: KeyboardEvent) {
    // console.log('keydown', event);
}

export function onKeyUp(event: KeyboardEvent) {
    // console.log('keyup', event);
}

export function onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
        tabletopMouse.value.pressed = true;
        handleObjectSelection();
    }
}

export function onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
        tabletopMouse.value.pressed = false;
    }
}

export function onMousemove(event: MouseEvent) {
    tabletopMouse.value.delta = [
        event.clientX - tabletopMouse.value.position[0],
        event.clientY - tabletopMouse.value.position[1]
    ];
    tabletopMouse.value.position = [event.clientX, event.clientY];
    handleDrag();
}

function screenPositionToWorldPosition(pos: [number, number]) {
    let [mouseX, mouseY] = pos;
    if (canvasRef.value) {
        mouseX -= canvasRef.value.width / 2;
        mouseY -= canvasRef.value.height / 2;
    }
    const [cameraX, cameraY] = tabletopCamera.value.position;
    return [mouseX + cameraX, mouseY + cameraY];
}

function handleDrag() {
    if (!tabletopMouse.value.pressed) return;

    if (selectedObject.value !== -1) {
        tabletopObjects.value[selectedObject.value].position[0] += tabletopMouse.value.delta[0];
        tabletopObjects.value[selectedObject.value].position[1] += tabletopMouse.value.delta[1];
    } else {
        tabletopCamera.value.position[0] -= tabletopMouse.value.delta[0];
        tabletopCamera.value.position[1] -= tabletopMouse.value.delta[1];
    }
}

function handleObjectSelection() {
    const [mouseX, mouseY] = tabletopMouse.value.position;
    const [worldX, worldY] = screenPositionToWorldPosition([mouseX, mouseY]);
    let selected = false;
    for (const object of tabletopObjects.value) {
        const [objX, objY] = object.position;
        const [objWidth, objHeight] = [object.image.width, object.image.height];
        if (
            worldX >= objX &&
            worldX <= objX + objWidth &&
            worldY >= objY &&
            worldY <= objY + objHeight
        ) {
            selected = true;
            const objIndex = tabletopObjects.value.indexOf(object);
            selectedObject.value = objIndex;
        }
    }
    if (!selected) {
        selectedObject.value = -1;
    }
}

export function insertObject(image: HTMLImageElement) {
    const [cameraX, cameraY] = tabletopCamera.value.position;
    const [imageWidth, imageHeight] = [image.width, image.height];
    tabletopObjects.value.push({
        position: [cameraX - imageWidth / 2, cameraY - imageHeight / 2],
        rotation: 0,
        scale: 1,
        image: image
    });
}

export function onUpdate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();

    // translate to camera position
    context.translate(
        canvas.width / 2 - tabletopCamera.value.position[0],
        canvas.height / 2 - tabletopCamera.value.position[1]
    );
    canvasRef.value = canvas;

    // draw objects
    for (const object of tabletopObjects.value) {
        context.save();

        // translate to object position
        context.translate(
            object.position[0] - object.image.width / 2,
            object.position[1] - object.image.height / 2
        );
        // rotate object
        context.rotate(object.rotation);
        // scale object
        context.scale(object.scale, object.scale);
        // draw object
        context.drawImage(
            object.image,
            object.image.width / 2,
            object.image.height / 2
        );

        context.restore();
    }

    context.restore();
}