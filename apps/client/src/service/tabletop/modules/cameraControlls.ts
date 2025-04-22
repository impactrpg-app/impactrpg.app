import { Module } from "../scene";
import { Vector3 } from "../vector";

export class CameraControllsModule extends Module<any> {
  private isCameraMoveKeyDown: boolean = false;
  private previousCameraPos = Vector3.zero();
  private readonly minZoom = 0.5;
  private readonly maxZoom = 20;

  clone() {
    return new CameraControllsModule();
  }
  async init() {
    this.type = "Module::CameraControlls";
    this.data = {};
  }

  onWheel(e: WheelEvent) {
    let pos = this.entity.position;
    pos.y += e.deltaY / 500;
    pos.y = Math.min(this.maxZoom, Math.max(this.minZoom, pos.y));
    this.entity.position = pos;
  }
  onMouseMove(e: MouseEvent) {
    const currentCameraPos = new Vector3(e.clientX, 0, e.clientY);
    if (this.isCameraMoveKeyDown) {
      const mouseDelta = this.previousCameraPos.subtract(currentCameraPos);
      let pos = this.entity.position.add(
        mouseDelta.divide(500 / this.entity.position.y)
      );
      this.entity.position = pos;
    }
    this.previousCameraPos = currentCameraPos.clone();
  }
  onMouseDown(e: MouseEvent) {
    if (e.button === 1) {
      this.isCameraMoveKeyDown = true;
    }
  }
  onMouseUp(e: MouseEvent) {
    if (e.button === 1) {
      this.isCameraMoveKeyDown = false;
    }
  }
  onKeyDown(e: KeyboardEvent) {
    if (e.key === " ") {
      this.isCameraMoveKeyDown = true;
    }
  }
  onKeyUp(e: KeyboardEvent) {
    if (e.key === " ") {
      this.isCameraMoveKeyDown = false;
    }
  }
}
