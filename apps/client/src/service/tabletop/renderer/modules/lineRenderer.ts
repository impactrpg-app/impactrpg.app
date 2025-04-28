import * as Three from "three";
import { Module } from "../../scene";
import { threeScene, threeToEntity } from "../scene";
import { Vector3 } from "../../vector";
import { updateThreeObject } from "./helper";

export class LineRendererModule extends Module<
  Three.Line<Three.BufferGeometry, Three.LineBasicMaterial>
> {
  private points: Vector3[] = [];

  constructor(lineWidth: number = 5) {
    super();
    const geometry = new Three.BufferGeometry();
    const material = new Three.LineBasicMaterial({
      color: 0x000,
      linewidth: lineWidth,
    });
    this.data = new Three.Line(geometry, material);
  }
  clone(): LineRendererModule {
    return new LineRendererModule();
  }
  async init(): Promise<void> {
    this.type = "Module::Renderer";
    threeScene.add(this.data);
    threeToEntity.set(this.data, this.entity.uuid);
    updateThreeObject(this.entity, this.data, true);
  }
  async destroy() {
    threeScene.remove(this.data);
    threeToEntity.delete(this.data);
  }
  update(): void {
    updateThreeObject(this.entity, this.data);
  }

  setPoints(points: Vector3[]) {
    this.points = points;
    const positions = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      const point = points[i]!;
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }
    this.data.geometry.setAttribute(
      "position",
      new Three.BufferAttribute(positions, 3)
    );
    this.data.geometry.computeBoundingSphere();
  }
  getPoints() {
    return this.points;
  }
}
