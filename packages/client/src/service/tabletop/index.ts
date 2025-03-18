export * from "./room";
export * from "./tools";
export * from "./sync";
export * from "./mouse";
export * from "./keyboard";
export * from "./update";
export * from "./scene";
import { canvasRef } from './scene';

export function init(canvas?: HTMLCanvasElement | null) {
    if (!canvas) {
        throw new Error('Canvas is required');
    }
    canvasRef.value = canvas;
}