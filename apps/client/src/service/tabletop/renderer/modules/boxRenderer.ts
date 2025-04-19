import * as Three from "three";
import { Module } from "../../scene";
import { threeScene, threeToEntity } from "../scene";
import { Vector3 } from "../../vector";

export class BoxRendererModule extends Module<Three.Object3D> {
  constructor(private _bounds: Vector3) {
    super();
  }

  get bounds() {
    return this._bounds;
  }
  set bounds(value: Vector3) {
    this._bounds = value;
    const oldData = this.data;
    this.init();
    threeScene.remove(oldData);
  }

  async init() {
    this.type = "Module::Renderer";
    const geometry = new Three.BoxGeometry(
      this._bounds.x,
      this._bounds.y,
      this._bounds.z
    );
    const material = new Three.MeshPhysicalMaterial({});
    this.data = new Three.Mesh(geometry, material);
    this.data.castShadow = true;
    this.data.receiveShadow = true;
    threeScene.add(this.data);
    threeToEntity.set(this.data, this.entity.uuid);
  }
  async destroy() {
    threeScene.remove(this.data);
    threeToEntity.delete(this.data);
  }

  update(): void {
    this.data.position.set(
      this.entity.position.x,
      this.entity.position.y,
      this.entity.position.z
    );
    this.data.setRotationFromEuler(
      new Three.Euler(
        this.entity.rotation.x,
        this.entity.rotation.y,
        this.entity.rotation.z
      )
    );
    this.data.scale.set(
      this.entity.scale.x,
      this.entity.scale.y,
      this.entity.scale.z
    );
  }
}
