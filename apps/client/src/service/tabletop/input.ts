import { Vector2 } from "@impact/shared";
import { ref } from "vue";
import { camera, removeObjectRequest, scene, selectedObjects } from "./scene";
import { ALL_TOOLS, tool } from "./tools";
import { mouseToScreenSpace } from "./utils";

export type MouseType = {
  position: Vector2;
  delta: Vector2;
  overCanvas: boolean;
  leftClickDown: boolean;
  rightClickDown: boolean;
  middleClickDown: boolean;
};

export type KeyboardType = {
  shift: boolean;
  alt: boolean;
  ctrl: boolean;
  space: boolean;
};

export const mouse = ref<MouseType>({
  position: { x: 0, y: 0 },
  delta: { x: 0, y: 0 },
  overCanvas: false,
  leftClickDown: false,
  rightClickDown: false,
  middleClickDown: false,
});

export const keyboard = ref<KeyboardType>({
  shift: false,
  alt: false,
  ctrl: false,
  space: false,
});

export function onMouseDown(event: MouseEvent) {
  if (!mouse.value.overCanvas) return;

  switch (event.button) {
    case 0:
      mouse.value.leftClickDown = true;
      break;
    case 1:
      mouse.value.middleClickDown = true;
      break;
    case 2:
      mouse.value.rightClickDown = true;
      break;
  }

  tool.value.onMouseDown(mouse.value);
}

export function onMouseUp(event: MouseEvent) {
  if (!mouse.value.overCanvas) return;

  switch (event.button) {
    case 0:
      mouse.value.leftClickDown = false;
      break;
    case 1:
      mouse.value.middleClickDown = false;
      break;
    case 2:
      mouse.value.rightClickDown = false;
      break;
  }

  tool.value.onMouseUp(mouse.value);
}

export function onMousemove(event: MouseEvent) {
  if (!mouse.value.overCanvas) return;

  // update mouse position
  const newMousePosition = mouseToScreenSpace({
    x: event.clientX,
    y: event.clientY,
  });
  mouse.value.delta = {
    x: newMousePosition.x - mouse.value.position.x,
    y: newMousePosition.y - mouse.value.position.y,
  };
  mouse.value.position = newMousePosition;

  // update camera position
  if (
    mouse.value.middleClickDown ||
    (keyboard.value.space && mouse.value.leftClickDown)
  ) {
    camera.value.position = new Vector2(
      camera.value.position.x + mouse.value.delta.x,
      camera.value.position.y + mouse.value.delta.y,
    );
  } else {
    // update tool
    tool.value.onMouseMove(mouse.value);
  }
}

export function onScroll(event: WheelEvent) {
  if (!mouse.value.overCanvas) return;
  camera.value.zoom -= event.deltaY / 1000;
  camera.value.zoom = Math.min(Math.max(camera.value.zoom, 0.28), 3.0);
}

export function onMouseOver(event: MouseEvent) {
  mouse.value.overCanvas = !!(event.target instanceof HTMLCanvasElement);
}

export function onContextMenu(event: MouseEvent, contextMenuRef: any) {
  if (!mouse.value.overCanvas) return;
  if (tool.value.disableContextMenu) return;
  if (selectedObjects.value.size === 0) return;
  contextMenuRef.show(event);
}

export function onKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case "Shift":
      keyboard.value.shift = true;
      break;
    case "Alt":
      keyboard.value.alt = true;
      break;
    case "Control":
      keyboard.value.ctrl = true;
      break;
    case " ":
      keyboard.value.space = true;
      break;
    case "Delete":
      if (selectedObjects.value.size > 0) {
        for (const object of selectedObjects.value) {
          const obj = scene.value.get(object);
          if (obj) {
            removeObjectRequest(obj);
          }
        }
        selectedObjects.value.clear();
      }
      break;
    case "Q":
    case "q":
      tool.value = ALL_TOOLS[0]!;
      break;
    case "W":
    case "w":
      tool.value = ALL_TOOLS[1]!;
      break;
  }

  tool.value.onKeyDown(keyboard.value);
}

export function onKeyUp(event: KeyboardEvent) {
  switch (event.key) {
    case "Shift":
      keyboard.value.shift = false;
      break;
    case "Alt":
      keyboard.value.alt = false;
      break;
    case "Control":
      keyboard.value.ctrl = false;
      break;
    case " ":
      keyboard.value.space = false;
      break;
  }

  tool.value.onKeyUp(keyboard.value);
}
