import * as Physics from "../../physics";
import { Vector3 } from "../../vector";
import { BaseTool } from "./base";
import { LineRendererModule } from "../../renderer/modules/LineRenderer";
import { Entity } from "../../scene";

export class DrawTool extends BaseTool {
  public lineWidth: number = 5;

  private isDrawing: boolean = false;
  private lastPoint = Vector3.zero();
  private lines: Vector3[] = [];
  private lineRenderer: LineRendererModule | null = null;

  onMouseDown(e: MouseEvent): void {
    const ray = this._camera?.getRayFromScreenPoint(e.clientX, e.clientY);
    if (!ray) return;
    const hit = Physics.CastRay(ray.origin, ray.direction, 100);
    if (!hit) return;
    this.lineRenderer = null;
    this.isDrawing = true;
    this.lastPoint = hit.point.add(new Vector3(0, 0.1, 0));
    this.lines = [this.lastPoint];
  }
  onMouseUp(e: MouseEvent): void {
    this.isDrawing = false;
    this.lastPoint = Vector3.zero();
  }
  onMouseMove(e: MouseEvent): void {
    if (!this.isDrawing) return;
    const ray = this._camera?.getRayFromScreenPoint(e.clientX, e.clientY);
    if (!ray) return;
    const hit = Physics.CastRay(ray.origin, ray.direction, 100);
    if (!hit) return;
    const point = hit.point.add(new Vector3(0, 0.1, 0));
    const distance = point.distanceTo(this.lastPoint);
    if (distance < 0.1) return;
    this.lines.push(point);
    if (this.lines.length > 1 && this.lineRenderer === null) {
      this.createLineRenderer();
    }
    if (this.lineRenderer) {
      this.lineRenderer.setPoints(this.lines);
    }
    this.lastPoint = point;
  }

  private async createLineRenderer() {
    const lineRendererEntity = new Entity("LineRenderer");
    this.lineRenderer = await lineRendererEntity.addModule(
      new LineRendererModule(this.lineWidth)
    );
  }
}
