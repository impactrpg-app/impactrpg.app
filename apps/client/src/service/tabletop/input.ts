import { scene } from "./scene";

let isMouseOverCanvas = false;

export function onMouseDown(e: MouseEvent): void {
  if (!isMouseOverCanvas) return;

  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onMouseDown(e);
    }
  }
}
export function onMouseUp(e: MouseEvent): void {
  if (!isMouseOverCanvas) return;
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onMouseUp(e);
    }
  }
}
export function onMouseMove(e: MouseEvent): void {
  if (!isMouseOverCanvas) return;
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onMouseMove(e);
    }
  }
}
export function onKeyDown(e: KeyboardEvent): void {
  if (!isMouseOverCanvas) return;
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onKeyDown(e);
    }
  }
}
export function onKeyUp(e: KeyboardEvent): void {
  if (!isMouseOverCanvas) return;
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onKeyUp(e);
    }
  }
}
export function onWheel(e: WheelEvent): void {
  if (!isMouseOverCanvas) return;
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.onWheel(e);
    }
  }
}
export function onMouseOver(e: MouseEvent) {
  isMouseOverCanvas = !!(e.target instanceof HTMLCanvasElement);
}
export function onContextMenu(e: MouseEvent) {
  e.preventDefault();
}
export function onDropItem(e: DragEvent) {
  console.warn("drag events are not currently supported");
}

export function init() {
  window.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseover", onMouseOver);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("wheel", onWheel);
  window.addEventListener("contextmenu", onContextMenu);
  window.addEventListener("drop", onDropItem);
}
