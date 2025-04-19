import { CameraModule } from "../../renderer";
import { Entity, Module } from "../../scene";

export class BaseTool extends Module<any> {
  public name: string = "unknown tool";
  public icon: string = "pi pi-exclamation-triangle";
  protected _camera: CameraModule | null = null;

  async init(): Promise<void> {
    this.type = "Module::Tool";
    const cameraEntity = Entity.findWithTag("Camera");
    if (!cameraEntity) {
      throw new Error("Camera not found");
    }
    const camera = cameraEntity.getModule<CameraModule>("Module::Camera");
    if (!camera) {
      throw new Error("Camera module not found");
    }
    this._camera = camera;
  }
}
