import * as Three from "three";
import { Entity, Module } from "../../scene";
import { threeScene } from "../scene";
import { CAMERA_MODULE, CameraModule } from "./camera";
import { Vector3 } from "../../vector";

export enum LightType {
  Directional = "directional",
  Ambient = "ambient",
}

export class LightModule extends Module<Three.Light> {
  private shadowCamera: Three.OrthographicCamera | null;
  private mainCamera: CameraModule | null;

  constructor(private _lightType: LightType) {
    super();
    this.shadowCamera = null;
    this.mainCamera = null;
  }

  get lightType() {
    return this._lightType;
  }

  private getLightVector() {
    const pitch = this.entity.rotation.x;
    const yaw = this.entity.rotation.y;
    const x = Math.cos(pitch) * Math.sin(yaw);
    const y = Math.sin(pitch);
    const z = Math.cos(pitch) * Math.cos(yaw);
    return new Vector3(x, y, z);
  }

  updateShadowCamera() {
    if (!this.shadowCamera) {
      console.warn("shadow camera is not defined, shadows will not work");
      return;
    }
    if (!this.mainCamera) {
      const entity = Entity.findWithTag("Camera");
      if (!entity) {
        console.warn("failed to find camera using tags");
        return;
      }
      const camera = entity.getModule<CameraModule>(CAMERA_MODULE);
      if (!camera) {
        console.warn("failed to get CameraModule from entity");
        return;
      }
      this.mainCamera = camera!;
    }

    const mainCameraPos = this.mainCamera.entity.position;
    const shadowSize = Math.max(30, mainCameraPos.y * 3);
    this.shadowCamera.left = -shadowSize;
    this.shadowCamera.right = shadowSize;
    this.shadowCamera.bottom = -shadowSize;
    this.shadowCamera.top = shadowSize;
    this.shadowCamera.near = 1;
    this.shadowCamera.far = 500;
    this.shadowCamera.updateProjectionMatrix();

    const light = this.data as Three.DirectionalLight;
    const lightTarget = new Vector3(mainCameraPos.x, 0, mainCameraPos.z);
    lightTarget.x += shadowSize / 2;
    lightTarget.z += shadowSize / 2;
    light.target.position.set(lightTarget.x, 0, lightTarget.z);
    const lightPos = lightTarget.clone().add(this.getLightVector());
    light.position.set(lightPos.x, lightPos.y, lightPos.z);
  }

  clone(): LightModule {
    return new LightModule(this._lightType);
  }
  update(): void {
    if (this._lightType === LightType.Directional) {
      this.updateShadowCamera();
    }
  }

  async init(): Promise<void> {
    this.type = "Module::Light";
    switch (this._lightType) {
      case LightType.Directional:
        {
          const light = new Three.DirectionalLight(0xffffff, 1);
          this.data = light;
          this.data.castShadow = true;
          this.data.shadow!.autoUpdate = true;
          if (this.data.shadow) {
            this.shadowCamera = this.data.shadow
              .camera as Three.OrthographicCamera;
            this.data.shadow.mapSize.set(2048, 2048);
          }
          light.target = new Three.Object3D();
          threeScene.add(light.target);

          const lightVector = this.getLightVector();
          light.position.set(lightVector.x, lightVector.y, lightVector.z);
          light.updateMatrixWorld();
        }
        break;
      case LightType.Ambient:
        this.data = new Three.AmbientLight(0xffffff, 0.2);
        break;
      default:
        throw new Error("Unsupported light type");
    }
    threeScene.add(this.data);
  }
  async destroy() {
    threeScene.remove(this.data);
    if (this.lightType === LightType.Directional) {
      threeScene.remove((this.data as Three.DirectionalLight).target);
    }
  }
}
