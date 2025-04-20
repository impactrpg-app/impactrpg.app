import * as Rapier from "@dimforge/rapier3d";
import * as Physics from "../../physics";
import { Vector3 } from "../../vector";
import { BaseTool } from "./base";
import { LineRendererModule } from "../../renderer/modules/LineRenderer";
import { Entity } from "../../scene";
import { NetworkModule } from "../network";
import { toNetworkEntity, updateObject } from "../../network";
import { UpdateObjectMessage } from "@impact/shared";

export class DrawTool extends BaseTool {
  public name: string = "Draw (W)";
  public icon: string = "pi pi-pencil";

  public lineWidth: number = 5;

  private isDrawing: boolean = false;
  private lastPoint = Vector3.zero();
  private points: Vector3[] = [];

  private _entity: Entity | null = null;
  private _renderer: LineRendererModule | null = null;

  onMouseDown(e: MouseEvent): void {
    const ray = this._camera?.getRayFromScreenPoint(e.clientX, e.clientY);
    if (!ray) return;
    const hit = Physics.CastRay(ray.origin, ray.direction, 100);
    if (!hit) return;
    this.isDrawing = true;
    const startPosition = hit.point.subtract(ray.direction.multiply(0.2));
    this.lastPoint = Vector3.zero();
    this.points = [this.lastPoint];

    // create line renderer
    this._entity = new Entity("Line");
    this._entity.position = startPosition;
    this._renderer = new LineRendererModule(this.lineWidth);
    this._renderer
      .getData()
      .position.set(startPosition.x, startPosition.y, startPosition.z);
    this._entity.addModule(this._renderer!);
    this._entity.addModule(new NetworkModule());
  }
  onMouseUp(e: MouseEvent): void {
    if (this.points.length <= 2) {
      this._entity?.destroy();
    } else {
      const { center, size } = this.getBounds();
      this.points = this.points.map((line) => line.subtract(center));
      this._renderer?.setPoints(this.points);
      if (this._entity) {
        this._entity.position = this._entity.position.add(center);
        this._entity
          .addModule(
            new Physics.StaticBodyModule([
              new Physics.BoxCollider(
                new Vector3(size.x / 2, size.y / 2, size.z / 2)
              ),
            ])
          )
          .then((body) => {
            updateObject(
              new UpdateObjectMessage(
                body.entity.uuid,
                toNetworkEntity(body.entity)
              )
            );
          });
      }
    }
    this.isDrawing = false;
    this._entity = null;
    this._renderer = null;
    this.lastPoint = Vector3.zero();
    this.points = [];
  }
  onMouseMove(e: MouseEvent): void {
    if (!this.isDrawing || !this._entity) return;
    const ray = this._camera?.getRayFromScreenPoint(e.clientX, e.clientY);
    if (!ray) return;
    const hit = Physics.CastRay(ray.origin, ray.direction, 100);
    if (!hit) return;
    const point = hit.point
      .subtract(this._entity?.position)
      .subtract(ray.direction.multiply(0.2));
    const distance = point.distanceTo(this.lastPoint);
    if (distance < 0.1) return;
    this.points.push(point);
    this.lastPoint = point;
    this._renderer!.setPoints(this.points);
    updateObject(
      new UpdateObjectMessage(this._entity.uuid, toNetworkEntity(this._entity))
    );
  }

  private getBounds() {
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minZ = Number.MAX_SAFE_INTEGER;
    let maxZ = Number.MIN_SAFE_INTEGER;
    for (const point of this.points) {
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
}
