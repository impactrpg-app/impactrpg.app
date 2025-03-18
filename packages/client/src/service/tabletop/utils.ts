import type { Vector2 } from "@impact/shared";
import { canvasRef, camera } from "./scene";

export function mouseToScreenSpace(pos: Vector2): Vector2 {
    const canvasRect = canvasRef.value!.getBoundingClientRect();
    const screenPos = {
        x: pos.x - canvasRect.left - canvasRect.width / 2,
        y: pos.y - canvasRect.top - canvasRect.height / 2
    };
    return {
        x: screenPos.x / camera.value.zoom,
        y: screenPos.y / camera.value.zoom
    };
}


export function screenToWorldSpace(pos: Vector2): Vector2 {
    return {
        x: pos.x - camera.value.position.x,
        y: pos.y - camera.value.position.y
    };
}

export function worldToScreenSpace(pos: Vector2): Vector2 {
    return {
        x: pos.x + camera.value.position.x,
        y: pos.y + camera.value.position.y
    };
}
