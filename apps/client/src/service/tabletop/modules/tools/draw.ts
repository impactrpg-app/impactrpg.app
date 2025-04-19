import { Vector3 } from "../../vector";
import { BaseTool } from "./base";
import * as Physics from "../../physics";

export class DrawTool extends BaseTool {
  private isDrawing: boolean = false;
  private lastPoint = Vector3.zero();
  private lines: Vector3[] = [];

  onMouseDown(e: MouseEvent): void {
    console.log('test');
    const ray = this._camera?.getRayFromScreenPoint(e.clientX, e.clientY);
    if (!ray) return;
    const hit = Physics.CastRay(ray.origin, ray.direction, 100);
    if (!hit) return;
    this.isDrawing = true;
    this.lastPoint = hit.point.add(new Vector3(0, 0.1, 0));
    this.lines.push(this.lastPoint);
  }
  onMouseUp(e: MouseEvent): void {
    this.isDrawing = false;
    this.lastPoint = Vector3.zero();
  }
  onMouseMove(e: MouseEvent): void {
    console.log('test');
    if (!this.isDrawing) return;
    const ray = this._camera?.getRayFromScreenPoint(e.clientX, e.clientY);
    if (!ray) return;
    const hit = Physics.CastRay(ray.origin, ray.direction, 100);
    if (!hit) return;
    const point = hit.point.add(new Vector3(0, 0.1, 0));
    const distance = point.distanceTo(this.lastPoint);
    if (distance < 0.1) return;
    this.lines.push(point);
    console.log("test");
  }
}
