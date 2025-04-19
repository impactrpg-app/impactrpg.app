import { scene } from "./scene";

export function onMouseDown(e: MouseEvent): void {
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onMouseDown(e);
    }
  }
}
export function onMouseUp(e: MouseEvent): void {
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onMouseUp(e);
    }
  }
}
export function onMouseMove(e: MouseEvent): void {
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onMouseMove(e);
    }
  }
}
export function onKeyDown(e: KeyboardEvent): void {
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onKeyDown(e);
    }
  }
}
export function onKeyUp(e: KeyboardEvent): void {
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onKeyUp(e);
    }
  }
}
export function onWheel(e: WheelEvent): void {
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onWheel(e);
    }
  }
}

window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.addEventListener("wheel", onWheel);
