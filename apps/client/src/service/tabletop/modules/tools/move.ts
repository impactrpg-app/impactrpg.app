import * as Physics from "../../physics";
import { BaseTool } from "./base";
import { scene, selectedObjects } from "../../scene";
import { Vector3 } from "../../vector";

export class MoveTool extends BaseTool {
  public name = "Move (Q)";
  public icon = "pi pi-arrows-alt";
  private _isDragging = false;

  async init() {
    await super.init();
  }

  public onMouseDown(e: MouseEvent): void {
    if (!this._camera) return;
    if (e.button === 0) {
      this._isDragging = true;
      // Left mouse button down
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      const ray = this._camera.getRayFromScreenPoint(x, y);
      const rayResult = Physics.CastRay(ray.origin, ray.direction, 100);
      if (rayResult && rayResult.entity.isInteractable) {
        selectedObjects.clear();
        selectedObjects.add(rayResult.entity.uuid);
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
    for (const uuid of selectedObjects) {
      const entity = scene.get(uuid);
      if (!entity) continue;
      const body =
        entity.getModule<Physics.DynamicBodyModule>("Module::Physics");
      if (body) body.setActive(!this._isDragging);
      if (this._isDragging === false) continue;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      const ray = this._camera.getRayFromScreenPoint(x, y);
      const rayResult = Physics.CastRay(ray.origin, ray.direction, 100);
      if (rayResult) {
        entity.position = rayResult.point.add(new Vector3(0, 1, 0));
      }
    }
  }
}
