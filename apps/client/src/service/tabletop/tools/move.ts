import { UpdateObjectMessage, Vector2 } from "@impact/shared";
import { contextMenuRef } from "../contextMenu";
import { keyboard, MouseType } from "../input";
import {
  pushToHistory,
  scene,
  selectedObjects,
  updateObjectRequest,
} from "../scene";
import { getObjectAtPosition, screenToWorldSpace } from "../utils";
import { TabletopTool } from "./base";

export class MoveTool extends TabletopTool {
  public name: string = "Move Tool (Q)";
  public icon: string = "pi pi-arrows-alt";
  // contains dragging objects uuid and starting position
  private dragging: Map<string, Vector2> = new Map();

  public onMouseDown(mouse: MouseType): void {
    if (mouse.leftClickDown) {
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
      for (const objectUuid of selectedObjects.value) {
        this.dragging.set(objectUuid, scene.value.get(objectUuid)!.position);
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
        contextMenuRef.value.show(
          new MouseEvent("click", {
            clientX: mouse.rawPosition.x,
            clientY: mouse.rawPosition.y,
          })
        );
      }
    }
  }

  public onMouseUp(mouse: MouseType): void {
    if (!mouse.leftClickDown && this.dragging.size > 0) {
      pushToHistory(
        [...selectedObjects.value.values()].map((uuid) => {
          const obj = scene.value.get(uuid);
          if (!obj) {
            throw new Error("Object not found");
          }
          return new UpdateObjectMessage(uuid, {
            position: obj?.position,
          });
        }),
        [...this.dragging.keys()].map((uuid) => {
          const position = this.dragging.get(uuid);
          if (!position) {
            throw new Error("Something went wrong when dragging an object");
          }
          return new UpdateObjectMessage(uuid, {
            position,
          });
        })
      );
      this.dragging.clear();
    }
  }

  public onMouseMove(mouse: MouseType): void {
    if (this.dragging.size === 0) return;

    for (const objectUuid of selectedObjects.value) {
      const obj = scene.value.get(objectUuid);
      if (!obj) return;

      updateObjectRequest(
        objectUuid,
        {
          position: screenToWorldSpace(mouse.position),
        },
        false
      );
    }
  }
}
