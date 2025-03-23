import { getImageElement, scene, selectedObjects } from "./scene";

import { TabletopObject, Vector2 } from "@impact/shared";
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
    const imageSize = new Vector2(image.width, image.height);

    context.translate(
        object.position.x,
        object.position.y
    );
    context.rotate(object.rotation);
    context.scale(object.scale, object.scale);
    context.translate(
        -imageSize.x / 2,
        -imageSize.y / 2
    );
    context.drawImage(image, 0, 0, imageSize.x, imageSize.y);

    if (selectedObjects.value.has(object.uuid)) {
        context.strokeStyle = '#58c9af';
        context.lineWidth = 5 / (camera.value.zoom * object.scale);
        context.strokeRect(
            0,
            0,
            imageSize.x,
            imageSize.y
        );
    }
}

export function drawStrokeObject(object: TabletopObject, context: CanvasRenderingContext2D) {
    if (!object.strokes) {
        console.warn(`Stroke object ${object.uuid} has no strokes`);
        return;
    }
    // translate to object position
    context.translate(
        object.position.x,
        object.position.y
    );
    // rotate object
    context.rotate(object.rotation);
    // scale object
    context.scale(
        object.scale,
        object.scale
    );
    // draw strokes
    context.strokeStyle = object.strokeColor ?? 'black';
    context.lineWidth = object.strokeWidth ?? 5;
    context.beginPath();
    if (object.strokes && object.strokes.length > 1) {
        context.moveTo(
            object.strokes[0]!.x,
            object.strokes[0]!.y
        );
        let max: [number, number] = [-Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER];
        let min: [number, number] = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
        for (let j = 1; j < object.strokes.length; j++) {
            const stroke = object.strokes[j]!;
            context.lineTo(stroke.x, stroke.y);
            // get bounds
            if (stroke.x > max[0]) max[0] = stroke.x;
            if (stroke.y > max[1]) max[1] = stroke.y;
            if (stroke.x < min[0]) min[0] = stroke.x;
            if (stroke.y < min[1]) min[1] = stroke.y;
        }
        context.stroke();

        if (selectedObjects.value.has(object.uuid)) {
            context.strokeStyle = '#58c9af';
            context.lineWidth = 5 / camera.value.zoom;
            context.strokeRect(
                min[0],
                min[1],
                max[0] - min[0],
                max[1] - min[1]
            );
        }
    }
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
    context.imageSmoothingEnabled = false;
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();

    // move to canvas centre
    const canvasSizeHalf = new Vector2(
        canvas.width / 2, canvas.height / 2
    );
    context.translate(
        canvasSizeHalf.x,
        canvasSizeHalf.y,
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