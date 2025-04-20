import * as Three from "three";
import { Module } from "../../scene";
import { loadImage } from "../loader";
import { threeScene } from "../scene";

export class ImageRendererModule extends Module<Three.Object3D> {
  private _texture: Three.Texture | null = null;

  constructor(private image: string) {
    super();
  }

  getImage() {
    return this.image;
  }
  get texture() {
    return this._texture;
  }

  async init(): Promise<void> {
    this.type = "Module::Renderer";
    this._texture = await loadImage(this.image);
    const geometry = new Three.PlaneGeometry(
      this._texture.image.width * 0.01,
      this._texture.image.height * 0.01
    );
    const material = new Three.MeshPhysicalMaterial({
      map: this._texture,
    });
    this.data = new Three.Mesh(geometry, material);
    this.data.castShadow = false;
    this.data.receiveShadow = true;
    threeScene.add(this.data);
  }
  async destroy(): Promise<void> {
    if (this._texture) {
      this._texture.dispose();
      this._texture = null;
    }
    threeScene.remove(this.data);
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
