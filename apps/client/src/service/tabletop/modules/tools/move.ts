import * as Physics from "../../physics";
import { BaseTool } from "./base";
import { scene, selectedObjects } from "../../scene";
import { Vector3 } from "../../vector";

export class MoveTool extends BaseTool {
  public name = "Move (Q)";
  public icon = "pi pi-arrows-alt";
  private _isDragging = false;
  private _objectOffset: Vector3[] = [];

  async init() {
    await super.init();
  }

  public onMouseDown(e: MouseEvent): void {
    if (!this._camera) return;
    if (e.button === 0) {
      this._isDragging = true;
      // Left mouse button down
      const ray = this._camera.getRayFromScreenPoint(e.clientX, e.clientY);
      const rayResult = Physics.CastRay(ray.origin, ray.direction, 100);
      if (rayResult && rayResult.entity.isInteractable) {
        selectedObjects.clear();
        selectedObjects.add(rayResult.entity.uuid);
        this._objectOffset = [
          rayResult.entity.position.subtract(rayResult.point),
        ];
      } else {
        selectedObjects.clear();
      }
    } else if (e.button === 2) {
      // Right mouse button down
    }
  }
  public onMouseUp(e: MouseEvent): void {
    if (e.button === 0) {
      this._isDragging = false;
    }
  }
  public onMouseMove(e: MouseEvent) {
    if (!this._camera) return;
    const uuids = [...selectedObjects.values()];
    for (let i = 0; i < uuids.length; i++) {
      const entity = scene.get(uuids[i]!);
      const offset = this._objectOffset[i]!;
      if (!entity) continue;
      const body = entity.getModule<Physics.BaseBodyModule>("Module::Physics");
      if (body) body.setActive(!this._isDragging);
      if (this._isDragging === false) continue;
      const ray = this._camera.getRayFromScreenPoint(e.clientX, e.clientY);
      const rayResult = Physics.CastRay(ray.origin, ray.direction, 100);
      if (rayResult) {
        if (body instanceof Physics.DynamicBodyModule) {
          entity.position = rayResult.point
            .add(offset)
            .add(new Vector3(0, 1, 0));
        } else {
          entity.position = rayResult.point
            .add(offset)
            .add(new Vector3(0, 0.1, 0));
        }
      }
    }
  }
}
