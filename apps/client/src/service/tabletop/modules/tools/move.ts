import * as Physics from "../../physics";
import { BaseTool } from "./base";
import { Entity, isContextMenuOpen, scene, selectedObjects } from "../../scene";
import { Vector3 } from "../../vector";

const MIN_MOUSE_MOVE_PER_PIXEL = 10;

export class MoveTool extends BaseTool {
  public name = "Move (Q)";
  public icon = "pi pi-arrows-alt";
  private _isShiftDown = false;
  private _isDragging = false;
  private _objectOffset: Vector3[] = [];
  private _previousMouseMove: MouseEvent | null = null;

  async init() {
    await super.init();
  }
  clone(): MoveTool {
    return new MoveTool();
  }
  private getClickedObject(
    e: MouseEvent,
    allowLockedObjects: boolean = false
  ): {
    entity: Entity;
    point: Vector3;
  } | null {
    if (!this._camera) return null;
    const ray = this._camera.getRayFromScreenPoint(e.clientX, e.clientY);
    const rayResult = Physics.CastRay(ray.origin, ray.direction, 100);
    if (!rayResult || !rayResult.entity.isInteractable) return null;
    if (!allowLockedObjects && rayResult.entity.isLocked) return null;

    return rayResult;
  }
  private addSelectedObject(entity: Entity, point: Vector3) {
    selectedObjects.add(entity.uuid);
    const pos = entity.position.subtract(point);
    this._objectOffset.push(pos);
  }
  private setPhysicsForSelectedObjects(value: boolean) {
    for (const uuid of selectedObjects.values()) {
      const entity = scene.get(uuid);
      if (!entity) continue;
      const body = entity.getModule<Physics.BaseBodyModule>("Module::Physics");
      if (body) body.setActive(value);
    }
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
      this.setPhysicsForSelectedObjects(false);
    } else if (e.button === 2) {
      // Right mouse button down
      const result = this.getClickedObject(e, true);
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
      this.setPhysicsForSelectedObjects(true);
      this._isDragging = false;
    }
  }
  onMouseMove(e: MouseEvent) {
    if (!this._camera) return;

    const mouseMoveDiffX = e.clientX - (this._previousMouseMove?.clientX ?? 0);
    const mouseMoveDiffY = e.clientY - (this._previousMouseMove?.clientY ?? 0);
    const mouseMoveDiff = Math.sqrt(
      mouseMoveDiffX * mouseMoveDiffX + mouseMoveDiffY * mouseMoveDiffY
    );
    if (mouseMoveDiff >= MIN_MOUSE_MOVE_PER_PIXEL) {
      const ray = this._camera.getRayFromScreenPoint(e.clientX, e.clientY);
      const rayResult = Physics.CastRay(ray.origin, ray.direction, 100);

      const uuids = [...selectedObjects.values()];
      for (let i = 0; i < uuids.length; i++) {
        const entity = scene.get(uuids[i]!);
        const offset = this._objectOffset[i]!;
        if (!entity) continue;
        const body =
          entity.getModule<Physics.BaseBodyModule>("Module::Physics");
        if (this._isDragging === false) continue;
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
          entity.position.isNetworkDirty = true;
        }
      }
    }
    this._previousMouseMove = e;
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
