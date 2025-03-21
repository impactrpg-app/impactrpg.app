import { MouseType } from "../input";
import { scene, selectedObjects, updateObjectRequest } from "../scene";
import { getObjectAtPosition, screenToWorldSpace } from "../utils";
import { TabletopTool } from "./base";

export class MoveTool extends TabletopTool {
  public name: string = "Move Tool (Q)";
  public icon: string = "pi pi-arrows-alt";
  public disableContextMenu: boolean = false;
  private draggingObjectId: string | null = null;

  public onMouseDown(mouse: MouseType): void {
    if (mouse.leftClickDown) {
      const object = getObjectAtPosition(screenToWorldSpace(mouse.position));
      if (object) {
        selectedObjects.value.add(object);
        this.draggingObjectId = object;
      }
    } else if (mouse.rightClickDown) {
      const object = getObjectAtPosition(screenToWorldSpace(mouse.position), true);
      if (object) {
        selectedObjects.value.add(object);
        this.draggingObjectId = object;
      }
    }
  }

  public onMouseUp(mouse: MouseType): void {
    if (!mouse.leftClickDown) {
      this.draggingObjectId = null;
    }
  }

  public onMouseMove(mouse: MouseType): void {
    if (!this.draggingObjectId) return;

    const obj = scene.value.get(this.draggingObjectId);
    if (!obj) return;

    obj.position = {
      x: obj.position.x + mouse.delta.x,
      y: obj.position.y + mouse.delta.y,
    };

    updateObjectRequest(this.draggingObjectId, {
      position: obj.position
    });
  }
}
