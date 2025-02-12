import { tabletopCamera } from ".";

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