import { CAMERA_MODULE, CameraModule } from "../renderer";
import { Module } from "../scene";
import { Vector3 } from "../vector";
import { Tool } from "./tools/base";
import { MoveTool } from "./tools/move";

export class CameraControllsModule extends Module<any> {
  private isCameraMoveKeyDown: boolean = false;
  private previousCameraPos = Vector3.zero();
  private readonly minZoom = 0.5;
  private readonly maxZoom = 20;
  private currentTool: Tool = new MoveTool();

  async init() {
    this.type = "Module::CameraControlls";
    this.data = {};
    window.addEventListener("wheel", (e) => this.onWheelEvent(e));
    window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    window.addEventListener("mousedown", (e) => this.onMouseDown(e));
    window.addEventListener("mouseup", (e) => this.onMouseUp(e));
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
  }
  async destroy() {
    window.removeEventListener("wheel", (e) => this.onWheelEvent(e));
    window.removeEventListener("mousemove", (e) => this.onMouseMove(e));
    window.removeEventListener("mousedown", (e) => this.onMouseDown(e));
    window.removeEventListener("mouseup", (e) => this.onMouseUp(e));
    window.removeEventListener("keydown", (e) => this.onKeyDown(e));
    window.removeEventListener("keyup", (e) => this.onKeyUp(e));
  }

  private onWheelEvent(e: WheelEvent) {
    let pos = this.entity.position;
    pos.y += e.deltaY / 500;
    pos.y = Math.min(this.maxZoom, Math.max(this.minZoom, pos.y));
    this.entity.position = pos;
  }
  private onMouseMove(e: MouseEvent) {
    this.currentTool.onMouseMove(e);
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
  private onMouseDown(e: MouseEvent) {
    const cameraModule = this.entity.getModule<CameraModule>(CAMERA_MODULE);
    if (cameraModule)
      (this.currentTool as MoveTool).perspectiveCamera = cameraModule;
    this.currentTool.onMouseDown(e);
    if (e.button === 1) {
      this.isCameraMoveKeyDown = true;
    }
  }
  private onMouseUp(e: MouseEvent) {
    this.currentTool.onMouseUp(e);
    if (e.button === 1) {
      this.isCameraMoveKeyDown = false;
    }
  }
  private onKeyDown(e: KeyboardEvent) {
    if (e.key === " ") {
      this.isCameraMoveKeyDown = true;
    }
  }
  private onKeyUp(e: KeyboardEvent) {
    if (e.key === " ") {
      this.isCameraMoveKeyDown = false;
    }
  }
}
