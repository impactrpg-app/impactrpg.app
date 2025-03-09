import { 
    canvasRef,
    tabletopCamera,
    TabletopImageObject,
    tabletopObjects,
    TabletopObjectType,
    TabletopStrokeObject
} from ".";

export function mouseToScreenSpace(pos: [number, number]): [number, number] {
    const canvasRect = canvasRef.value!.getBoundingClientRect();
    const canvasSizeHalf = [canvasRef.value!.width / 2, canvasRef.value!.height / 2];
    return [
        ((pos[0] - canvasRect.left - canvasSizeHalf[0]) / tabletopCamera.value.zoom),
        ((pos[1] - canvasRect.top - canvasSizeHalf[1]) / tabletopCamera.value.zoom)
    ];
}

export function screenToWorldSpace(pos: [number, number]): [number, number] {
    return [
        pos[0] - tabletopCamera.value.position[0],
        pos[1] - tabletopCamera.value.position[1]
    ]
}

export function worldToScreenSpace(pos: [number, number]): [number, number] {
    return [
        pos[0] + tabletopCamera.value.position[0],
        pos[1] + tabletopCamera.value.position[1]
    ]
}

export function objectCollider(
    point: [number, number],
    objectPosition: [number, number],
    objectSize: [number, number]
) {
    let [pointX, pointY] = point;
    let [objX, objY] = objectPosition;
    let [width, height] = objectSize;

    width = width / 2;
    height = height / 2;
    return (
        pointX >= objX - width &&
        pointX <= objX + width &&
        pointY >= objY - height &&
        pointY <= objY + height
    )
}

export function getImageSize(image?: HTMLImageElement | null): [number, number] {
    if (!image) return [0, 0];
    return [image.width, image.height];
}

export function getStrokeBounds(strokes: [number, number][]) {
    const minX = Math.min(...strokes.map(stroke => stroke[0]));
    const minY = Math.min(...strokes.map(stroke => stroke[1]));
    const maxX = Math.max(...strokes.map(stroke => stroke[0]));
    const maxY = Math.max(...strokes.map(stroke => stroke[1]));
    return { minX, minY, maxX, maxY };
}

export function getObjectAtPosition(targetPosition: [number, number], ignoreLocked: boolean = false): number {
    targetPosition = screenToWorldSpace(targetPosition);
    for (let i = tabletopObjects.value.length - 1; i >= 0; i--) {
        const object = tabletopObjects.value[i];
        if (!ignoreLocked && object.locked) continue;

        if (object.type === TabletopObjectType.Stroke) {
            const strokeObject = object as TabletopStrokeObject;
            const bounds = getStrokeBounds(strokeObject.strokes);
            const position: [number, number] = [
                bounds.minX + object.position[0],
                bounds.minY + object.position[1]
            ]
            const collision = objectCollider(
                targetPosition,
                position,
                [bounds.maxX - bounds.minX, bounds.maxY - bounds.minY]
            );
            if (!collision) continue;
            return i;
        } else {
            const collision = objectCollider(
                targetPosition,
                object.position,
                getImageSize((object as TabletopImageObject).image)
            );
            if (!collision) continue;
                return i;
        }
    }
    return -1;
}