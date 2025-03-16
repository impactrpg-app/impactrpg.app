import { canvasRef, onResize } from ".";

export function init(canvas?: HTMLCanvasElement | null) {
    if (!canvas) {
        throw new Error('Canvas is required');
    }
    canvasRef.value = canvas;
    onResize(new UIEvent('resize'));
}