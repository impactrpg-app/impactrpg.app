import * as Three from "three";
import { Module } from "../../scene";
import { threeScene } from "../scene";

export enum LightType {
  Directional = "directional",
  Ambient = "ambient",
}

export class LightModule extends Module<Three.Light> {
  constructor(private _lightType: LightType) {
    super();
  }

  get lightType() {
    return this._lightType;
  }

  updateDirectionalLightVector() {
    const pitch = this.entity.rotation.x;
    const yaw = this.entity.rotation.y;
    const x = Math.cos(pitch) * Math.sin(yaw);
    const y = Math.sin(pitch);
    const z = Math.cos(pitch) * Math.cos(yaw);
    this.data.position.set(x, y, z);
  }

  update(): void {
    if (this._lightType === LightType.Directional) {
      this.updateDirectionalLightVector();
    }
  }

  async init(): Promise<void> {
    this.type = "Module::Light";
    switch (this._lightType) {
      case LightType.Directional:
        this.data = new Three.DirectionalLight(0xffffff, 1);
        this.data.castShadow = true;
        this.updateDirectionalLightVector();
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
  }
}
