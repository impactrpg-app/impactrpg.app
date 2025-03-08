import { tabletopCamera, TabletopImageObject, tabletopObjects, TabletopObjectType, TabletopStrokeObject } from ".";

export function screenPositionToWorldPosition(pos: [number, number]): [number, number] {
    const [posX, posY] = pos;
    const [cameraX, cameraY] = tabletopCamera.value.position;
    return [posX - cameraX, posY - cameraY];
}

export function objectCollider(
    point: [number, number],
    objectPosition: [number, number],
    objectSize: [number, number],
    cameraZoom: number
) {
    const mouseX = point[0];
    const mouseY = point[1];
    const posX = objectPosition[0] * cameraZoom;
    const posY = objectPosition[1] * cameraZoom;
    const width = objectSize[0] * cameraZoom;
    const height = objectSize[1] * cameraZoom;

    return (
        mouseX >= posX &&
        mouseX <= posX + width &&
        mouseY >= posY &&
        mouseY <= posY + height
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

export function getObjectAtPosition(targetPosition: [number, number]): number {
    for (let i = tabletopObjects.value.length - 1; i >= 0; i--) {
        const object = tabletopObjects.value[i];
        if (object.locked) continue;

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
                [bounds.maxX - bounds.minX, bounds.maxY - bounds.minY],
                tabletopCamera.value.zoom
            );
            if (!collision) continue;
            return i;
        } else {
            const collision = objectCollider(
                targetPosition,
                object.position,
                getImageSize((object as TabletopImageObject).image),
                tabletopCamera.value.zoom
            );
            if (!collision) continue;
                return i;
        }
    }
    return -1;
}