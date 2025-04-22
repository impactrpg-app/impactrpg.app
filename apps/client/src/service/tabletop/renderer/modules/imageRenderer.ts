import * as Three from "three";
import { Module } from "../../scene";
import { loadImage } from "../loader";
import { threeScene } from "../scene";

export class ImageRendererModule extends Module<Three.Object3D> {
  private _texture: Three.Texture | null = null;
  private _width: number = 0;
  private _height: number = 0;

  constructor(private image: string) {
    super();
  }

  getImage() {
    return this.image;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }

  async init(): Promise<void> {
    this.type = "Module::Renderer";
    this._texture = await loadImage(this.image);
    this._width = this._texture.image.width;
    this._height = this._texture.image.height;
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
