import * as Rapier from "@dimforge/rapier3d";
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
  private lineEntity: Entity | null = null;
  private lineRenderer: LineRendererModule | null = null;
  private linePhysicsBody: Physics.StaticBodyModule | null = null;

  onMouseDown(e: MouseEvent): void {
    const ray = this._camera?.getRayFromScreenPoint(e.clientX, e.clientY);
    if (!ray) return;
    const hit = Physics.CastRay(ray.origin, ray.direction, 100);
    if (!hit) return;
    this.lineRenderer = null;
    this.isDrawing = true;
    this.lineEntity = new Entity("Drawing");
    this.lineEntity.position = hit.point.subtract(ray.direction.multiply(0.2));
    this.lastPoint = this.lineEntity.position;
    this.lines = [this.lineEntity.position];
  }
  onMouseUp(e: MouseEvent): void {
    if (this.linePhysicsBody) {
      const collider = this.linePhysicsBody.getData().colliders[0]!;
      const { center, size } = this.getBounds();
      this.linePhysicsBody.getData().body.setTranslation(center, true);
      collider.setShape(new Rapier.Cuboid(size.x / 2, size.y / 2, size.z / 2));
      this.linePhysicsBody.getData().body.setEnabled(true);
    } else {
      this.lineEntity?.destroy();
    }
    this.isDrawing = false;
    this.lastPoint = Vector3.zero();
    this.lineEntity = null;
    this.lineRenderer = null;
    this.linePhysicsBody = null;
    this.lines = [];
  }
  onMouseMove(e: MouseEvent): void {
    if (!this.isDrawing) return;
    if (!this.lineEntity) return;
    const ray = this._camera?.getRayFromScreenPoint(e.clientX, e.clientY);
    if (!ray) return;
    const hit = Physics.CastRay(ray.origin, ray.direction, 100);
    if (!hit) return;
    const point = hit.point.subtract(ray.direction.multiply(0.2));
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

  private getBounds() {
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minZ = Number.MAX_SAFE_INTEGER;
    let maxZ = Number.MIN_SAFE_INTEGER;
    for (const point of this.lines) {
      if (point.x < minX) minX = point.x;
      if (point.x > maxX) maxX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.y > maxY) maxY = point.y;
      if (point.z < minZ) minZ = point.z;
      if (point.z > maxZ) maxZ = point.z;
    }
    const center = new Vector3(
      (minX + maxX) / 2,
      (minY + maxY) / 2,
      (minZ + maxZ) / 2
    );
    const size = new Vector3(
      Math.abs(maxX - minX),
      Math.abs(maxY - minY),
      Math.abs(maxZ - minZ)
    );
    return {
      min: new Vector3(minX, minY, minZ),
      max: new Vector3(maxX, maxY, maxZ),
      center: center,
      size: size,
    };
  }

  private async createLineRenderer() {
    const lineRendererEntity = new Entity("LineRenderer");
    this.lineRenderer = await lineRendererEntity.addModule(
      new LineRendererModule(this.lineWidth)
    );
    this.linePhysicsBody = await lineRendererEntity.addModule(
      new Physics.StaticBodyModule([new Physics.BoxCollider()])
    );
    this.linePhysicsBody.autoUpdateTransform = false;
    this.linePhysicsBody.getData().body.setEnabled(false);
  }
}
