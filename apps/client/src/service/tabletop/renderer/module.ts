import * as Three from "three";
import { Module } from "../scene";
import { threeScene } from "./scene";
import { loadImage } from "./loader";
import { renderer } from "./renderer";

export const RENDERER_MODULE = "Module::Renderer";

export class RendererModule extends Module<Three.Object3D> {
  async init() {
    this.type = RENDERER_MODULE;
    threeScene.add(this.data);
  }
  async destroy() {
    threeScene.remove(this.data);
  }
}
export class ImageRendererModule extends RendererModule {
  constructor(private image: string) {
    super();
  }

  async init(): Promise<void> {
    this.type = RENDERER_MODULE;
    const texture = await loadImage(this.image);
    const geometry = new Three.PlaneGeometry(
      texture.image.width,
      texture.image.height
    );
    const material = new Three.MeshBasicMaterial({
      map: texture,
    });
    this.data = new Three.Mesh(geometry, material);
    threeScene.add(this.data);
  }
}
export class BoxRendererModule extends RendererModule {
  constructor(
    private width: number,
    private height: number,
    private depth: number
  ) {
    super();
  }

  async init() {
    this.type = RENDERER_MODULE;
    const geometry = new Three.BoxGeometry(this.width, this.height, this.depth);
    const material = new Three.MeshPhysicalMaterial({});
    this.data = new Three.Mesh(geometry, material);
    threeScene.add(this.data);
  }
}

export const CAMERA_MODULE = "Module::Camera";
export class CameraModule extends Module<Three.PerspectiveCamera> {
  constructor(
    private _fov: number,
    private _aspectRatio: number,
    private _nearClipPlane: number,
    private _farClipPlane: number
  ) {
    super();
  }

  get fov() {
    return this._fov;
  }
  set fov(value: number) {
    this._fov = value;
    this.data.fov = value;
    this.data.updateProjectionMatrix();
  }
  get aspectRatio() {
    return this._aspectRatio;
  }
  set aspectRatio(value: number) {
    this._aspectRatio = value;
    this.data.aspect = value;
    this.data.updateProjectionMatrix();
  }
  get nearClipPlane() {
    return this._nearClipPlane;
  }
  set nearClipPlane(value: number) {
    this._nearClipPlane = value;
    this.data.near = value;
    this.data.updateProjectionMatrix();
  }
  get farClipPlane() {
    return this._farClipPlane;
  }
  set farClipPlane(value: number) {
    this._farClipPlane = value;
    this.data.far = value;
    this.data.updateProjectionMatrix();
  }

  private onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.data.aspect = window.innerWidth / window.innerHeight;
    this.data.updateProjectionMatrix();
  }

  async init(): Promise<void> {
    this.type = CAMERA_MODULE;
    this.data = new Three.PerspectiveCamera(
      this._fov,
      this._aspectRatio,
      this._nearClipPlane,
      this._farClipPlane
    );
    threeScene.add(this.data);
    this.data.position.x = this.entity.position.x;
    this.data.position.y = this.entity.position.y;
    this.data.position.z = this.entity.position.z;
    this.data.setRotationFromEuler(
      new Three.Euler(
        this.entity.rotation.x,
        this.entity.rotation.y,
        this.entity.rotation.z
      )
    );
    window.addEventListener("resize", () => this.onResize());
  }

  async destroy(): Promise<void> {
    window.removeEventListener("resize", () => this.onResize());
    threeScene.remove(this.data);
  }
}
