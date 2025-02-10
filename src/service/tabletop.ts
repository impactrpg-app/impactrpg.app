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
    position: [number, number];
    pressed: boolean;
}>({
    position: [0, 0],
    pressed: false
});

export function onResize(canvas: HTMLCanvasElement) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

export function onKeyDown(event: KeyboardEvent) {
    console.log('keydown', event);
}

export function onKeyUp(event: KeyboardEvent) {
    console.log('keyup', event);
}

export function onMouseDown(event: MouseEvent) {
    console.log('mousedown', event);
}

export function onMouseUp(event: MouseEvent) {
    console.log('mouseup', event);
}

export function onMousemove(event: MouseEvent) {
    console.log('mousemove', event);
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

    // draw objects
    for (const object of tabletopObjects.value) {
        context.save();

        // translate to object position
        context.translate(
            object.position[0],
            object.position[1]
        );
        // rotate object
        context.rotate(object.rotation);
        // scale object
        context.scale(object.scale, object.scale);
        // draw object
        context.drawImage(
            object.image,
            -object.image.width / 2,
            -object.image.height / 2
        );

        context.restore();
    }

    context.restore();
}