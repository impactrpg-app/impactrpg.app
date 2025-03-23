import { contextMenuRef } from "../contextMenu";
import { keyboard, MouseType } from "../input";
import { scene, selectedObjects, updateObjectRequest } from "../scene";
import { getObjectAtPosition, screenToWorldSpace } from "../utils";
import { TabletopTool } from "./base";

export class MoveTool extends TabletopTool {
  public name: string = "Move Tool (Q)";
  public icon: string = "pi pi-arrows-alt";
  private enableDragging: boolean = false;

  public onMouseDown(mouse: MouseType): void {
    if (mouse.leftClickDown) {
      this.enableDragging = true;
      const objectUuid = getObjectAtPosition(
        screenToWorldSpace(mouse.position)
      );
      if (objectUuid) {
        if (keyboard.value.shift) {
          selectedObjects.value.add(objectUuid);
        } else if (!selectedObjects.value.has(objectUuid)) {
          selectedObjects.value = new Set([objectUuid]);
        }
      } else {
        selectedObjects.value.clear();
      }
    } else if (mouse.rightClickDown) {
      const object = getObjectAtPosition(
        screenToWorldSpace(mouse.position),
        true
      );
      if (object) {
        if (keyboard.value.shift) {
          selectedObjects.value.add(object);
        } else if (!selectedObjects.value.has(object)) {
          selectedObjects.value = new Set([object]);
        }
        contextMenuRef.value.show(new MouseEvent('click', {
          clientX: mouse.rawPosition.x,
          clientY: mouse.rawPosition.y,
        }));
      }
    }
  }

  public onMouseUp(mouse: MouseType): void {
    if (!mouse.leftClickDown) {
      this.enableDragging = false;
    }
  }

  public onMouseMove(mouse: MouseType): void {
    if (!this.enableDragging) return;

    for (const objectUuid of selectedObjects.value) {
      const obj = scene.value.get(objectUuid);
      if (!obj) return;

      obj.position = obj.position.add(mouse.delta);

      updateObjectRequest(objectUuid, {
        position: obj.position,
      });
    }
  }
}
