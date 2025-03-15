import { canvasRef } from ".";

export function onResize(_: UIEvent) {
    if (!canvasRef.value) return;
    canvasRef.value.width = canvasRef.value.clientWidth;
    canvasRef.value.height = canvasRef.value.clientHeight;
}