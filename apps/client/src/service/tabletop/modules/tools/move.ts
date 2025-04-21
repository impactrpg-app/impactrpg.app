import * as Physics from "../../physics";
import { BaseTool } from "./base";
import { Entity, isContextMenuOpen, scene, selectedObjects } from "../../scene";
import { Vector3 } from "../../vector";

export class MoveTool extends BaseTool {
  public name = "Move (Q)";
  public icon = "pi pi-arrows-alt";
  private _isShiftDown = false;
  private _isDragging = false;
  private _objectOffset: Vector3[] = [];

  async init() {
    await super.init();
  }

  private getClickedObject(e: MouseEvent): {
    entity: Entity;
    point: Vector3;
  } | null {
    if (!this._camera) return null;
    const ray = this._camera.getRayFromScreenPoint(e.clientX, e.clientY);
    const rayResult = Physics.CastRay(ray.origin, ray.direction, 100);
    if (!rayResult || !rayResult.entity.isInteractable) {
      return null;
    }
    return rayResult;
  }
  private addSelectedObject(entity: Entity, point: Vector3) {
    selectedObjects.add(entity.uuid);
    const pos = entity.position.subtract(point);
    this._objectOffset.push(new Vector3(pos.x, 0, pos.y));
  }

  onMouseDown(e: MouseEvent): void {
    if (e.button === 0) {
      this._isDragging = true;
      // Left mouse button down
      const result = this.getClickedObject(e);
      if (!this._isShiftDown) {
        selectedObjects.clear();
        this._objectOffset = [];
      }
      if (result) {
        if (!selectedObjects.has(result.entity.uuid)) {
          this.addSelectedObject(result.entity, result.point);
        }
        this._isDragging = true;
      }
    } else if (e.button === 2) {
      // Right mouse button down
      const result = this.getClickedObject(e);
      if (!this._isShiftDown) {
        selectedObjects.clear();
        this._objectOffset = [];
      }
      if (result) {
        if (!selectedObjects.has(result.entity.uuid)) {
          this.addSelectedObject(result.entity, result.point);
        }
      }
      isContextMenuOpen.value = !!result;
    }
  }
  onMouseUp(e: MouseEvent): void {
    if (e.button === 0) {
      this._isDragging = false;
    }
  }
  onMouseMove(e: MouseEvent) {
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
  onKeyDown(e: KeyboardEvent): void {
    if (e.key === "Shift") {
      this._isShiftDown = true;
    }
  }
  onKeyUp(e: KeyboardEvent): void {
    if (e.key === "Shift") {
      this._isShiftDown = false;
    }
  }
}
