import { Vector2 } from "@impact/shared";
import { MenuItem } from "primevue/menuitem";
import { ref } from "vue";
import { camera, removeObjectRequest, scene, selectedObject } from "./scene";
import { tool } from "./tools";
import { mouseToScreenSpace } from "./utils";

export type MouseType = {
  position: Vector2;
  delta: Vector2;
  overCanvas: boolean;
  leftClickDown: boolean;
  rightClickDown: boolean;
  middleClickDown: boolean;
};

const mouse = ref<MouseType>({
  position: { x: 0, y: 0 },
  delta: { x: 0, y: 0 },
  overCanvas: false,
  leftClickDown: false,
  rightClickDown: false,
  middleClickDown: false,
});
export const contextMenuItems = ref<MenuItem[]>([
  {
    label: "Delete Object",
    icon: "pi pi-trash",
    command: () => {
      if (selectedObject.value === null) return;
      const object = scene.value.get(selectedObject.value);
      if (!object) return;
      removeObjectRequest(object);
    },
  },
]);

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

  setTimeout(() => tool.value.onMouseDown(mouse.value), 1);
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

  if (mouse.value.middleClickDown) {
    camera.value.position = {
      x: camera.value.position.x + mouse.value.delta.x,
      y: camera.value.position.y + mouse.value.delta.y
    } as Vector2;
  }
  const newMousePosition = mouseToScreenSpace(
    {x: event.clientX, y: event.clientY}
  );

  mouse.value.delta = {
    x: newMousePosition.x - mouse.value.position.x,
    y: newMousePosition.y - mouse.value.position.y
  };

  mouse.value.position = newMousePosition;
  tool.value.onMouseMove(mouse.value);
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
  if (selectedObject.value === null) return;
  contextMenuRef.show(event);
}