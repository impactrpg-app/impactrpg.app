import { getImageElement, scene, selectedObject } from "./scene";

import type { TabletopObject, Vector2 } from "@impact/shared";
import { camera } from "./scene";
import { ref } from "vue";

export const canvasBindingRect = ref<DOMRect>();
export function onResize(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasBindingRect.value = canvas.getBoundingClientRect();
}

export function drawImageObject(object: TabletopObject, context: CanvasRenderingContext2D) {
    if (!object.image) {
        console.warn(`Image object ${object.uuid} has no image`);
        return;
    }
    if (object.image === 'undefined') {
        return;
    }
    const image = getImageElement(object.uuid, object.image!);
    if (!image) {
        console.warn(`Image object ${object.uuid} has no image`);
        return;
    }
    const imageSize = {
        x: image.width,
        y: image.height
    } as Vector2;

    context.scale(object.scale, object.scale);
    context.rotate(object.rotation);
    context.translate(
        object.position.x - imageSize.x / 2,
        object.position.y - imageSize.y / 2
    );
    context.drawImage(image, 0, 0, imageSize.x, imageSize.y);

    if (selectedObject.value === object.uuid) {
        context.strokeStyle = '#58c9af';
        context.lineWidth = 5 / camera.value.zoom;
        context.strokeRect(
            0,
            0,
            imageSize.x,
            imageSize.y
        );
    }
}

export function drawStrokeObject(object: TabletopObject, context: CanvasRenderingContext2D) {

}

export function drawObject(object: TabletopObject, context: CanvasRenderingContext2D) {
    context.save();
    switch (object.type) {
        case 'image':
            drawImageObject(object, context);
            break;
        case 'stroke':
            drawStrokeObject(object, context);
            break;
    }
    context.restore();
}

export function onUpdate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();

    // move to canvas centre
    const canvasSizeHalf = [canvas.width / 2, canvas.height / 2];
    context.translate(
        canvasSizeHalf[0],
        canvasSizeHalf[1],
    );
    context.scale(
        camera.value.zoom,
        camera.value.zoom
    );
    context.translate(
        camera.value.position.x,
        camera.value.position.y
    );

    // draw objects
    for (const object of scene.value.values()) {
        drawObject(object, context);
    }

    context.restore();
}