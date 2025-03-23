import { TabletopObjectType } from "@impact/shared";
import { MouseType } from "../input";
import {
  addObjectRequest,
  removeObjectRequest,
  scene,
  updateObjectRequest,
} from "../scene";
import { screenToWorldSpace } from "../utils";
import { TabletopTool } from "./base";
import { v4 as uuidv4 } from "uuid";

export class DrawTool extends TabletopTool {
  public name: string = "Draw Tool (W)";
  public icon: string = "pi pi-pencil";
  public disableContextMenu: boolean = false;
  private strokeId: string | null = null;

  public onMouseDown(mouse: MouseType): void {
    if (mouse.leftClickDown) {
      const pos = screenToWorldSpace(mouse.position);
      this.strokeId = uuidv4();
      addObjectRequest({
        uuid: this.strokeId,
        type: TabletopObjectType.Stroke,
        position: { x: 0, y: 0 },
        rotation: 0,
        scale: 1,
        locked: false,
        strokeColor: "black",
        strokeWidth: 5,
        strokes: [pos],
      });
    }
  }

  public onMouseUp(mouse: MouseType): void {
    if (!mouse.leftClickDown) {
      if (!this.strokeId) return;
      const stroke = scene.value.get(this.strokeId);
      if (!stroke) return;
      if (stroke.strokes!.length <= 10) {
        removeObjectRequest(stroke);
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

    stroke.strokes!.push(mouseToWorld);
    updateObjectRequest(this.strokeId, {
      strokes: stroke.strokes,
    });
  }
}
