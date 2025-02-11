import { tabletopCamera } from ".";

export function screenPositionToWorldPosition(pos: [number, number]): [number, number] {
    const [posX, posY] = pos;
    const [cameraX, cameraY] = tabletopCamera.value.position;
    return [posX - cameraX, posY - cameraY];
}