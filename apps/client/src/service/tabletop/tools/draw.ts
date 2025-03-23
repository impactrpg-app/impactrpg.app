import {
  AddObjectMessage,
  RemoveObjectMessage,
  TabletopObject,
  TabletopObjectType,
  Vector2,
} from "@impact/shared";
import { MouseType } from "../input";
import {
  addObjectRequest,
  pushToHistory,
  removeObjectRequest,
  scene,
  updateObjectRequest,
} from "../scene";
import { screenToWorldSpace } from "../utils";
import { TabletopTool } from "./base";

export class DrawTool extends TabletopTool {
  public name: string = "Draw Tool (W)";
  public icon: string = "pi pi-pencil";
  private strokeId: string | null = null;

  public onMouseDown(mouse: MouseType): void {
    if (mouse.leftClickDown) {
      const pos = screenToWorldSpace(mouse.position);
      const obj = TabletopObject.NewStrokeObject(pos);
      this.strokeId = obj.uuid;
      addObjectRequest(obj, false);
    }
  }

  public onMouseUp(mouse: MouseType): void {
    if (!mouse.leftClickDown) {
      if (!this.strokeId) return;
      const stroke = scene.value.get(this.strokeId);
      if (!stroke) return;
      if (stroke.strokes!.length <= 10) {
        removeObjectRequest(stroke, false);
      } else {
        pushToHistory(
          [new AddObjectMessage(stroke)],
          [new RemoveObjectMessage(this.strokeId)]
        );
      }
      this.strokeId = null;
    }
  }

  public onMouseMove(mouse: MouseType): void {
    if (!this.strokeId) return;

    const stroke = scene.value.get(this.strokeId);
    if (!stroke) return;

    const mouseToWorld = screenToWorldSpace(mouse.position);
    const lastStroke = stroke.strokes![stroke.strokes!.length - 1]!;
    const distance = Math.sqrt(
      Math.pow(lastStroke.x - mouseToWorld.x, 2) +
        Math.pow(lastStroke.y - mouseToWorld.y, 2)
    );
    if (distance <= 1) return;

    updateObjectRequest(
      this.strokeId,
      {
        strokes: [...(stroke.strokes ?? []), mouseToWorld],
      },
      false
    );
  }
}
