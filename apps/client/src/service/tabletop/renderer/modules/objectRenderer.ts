import * as Three from "three";
import { Module } from "../../scene";
import { loadGltf } from "../loader";
import { threeScene } from "../scene";
import { GLTF } from "three/examples/jsm/Addons.js";
import { Vector3 } from "../../vector";

export class ObjectRenderer extends Module<Three.Object3D> {
  private gltf: GLTF | null = null;
  private _center = Vector3.zero();

  constructor(private glbFile: string) {
    super();
  }

  getFilePath() {
    return this.glbFile;
  }
  getGltf() {
    if (!this.gltf) {
      throw new Error("GLTF not loaded");
    }
    return this.gltf;
  }
  getBoundingBox() {
    const boundingBox = new Three.Box3().setFromObject(this.data);
    const threeCenter = new Three.Vector3();
    const threeSize = new Three.Vector3();
    boundingBox.getCenter(threeCenter);
    boundingBox.getSize(threeSize);
    const center = new Vector3(threeCenter.x, threeCenter.y, threeCenter.z);
    const size = new Vector3(threeSize.x, threeSize.y, threeSize.z);
    return { center, size };
  }

  async init(): Promise<void> {
    this.type = "Module::Renderer";
    const gltf = await loadGltf(this.glbFile);
    this.data = gltf.scene.clone();
    this._center = this.getBoundingBox().center;
    this.data.castShadow = true;
    this.data.receiveShadow = true;
    threeScene.add(this.data);
  }
  async destroy(): Promise<void> {
    threeScene.remove(this.data);
  }
  update(): void {
    const pos = this.entity.position.subtract(this._center);
    this.data.position.set(pos.x, pos.y, pos.z);
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
