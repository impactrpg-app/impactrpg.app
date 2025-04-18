import * as Three from "three";
import { Module } from "../scene";
import { threeScene } from "./scene";
import { loadImage } from "./loader";

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

export const IMAGE_MODULE = "Module::Renderer::Image";

export class ImageRendererModule extends RendererModule {
  constructor(private image: string) {
    super();
  }

  async init(): Promise<void> {
    this.type = IMAGE_MODULE;
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
