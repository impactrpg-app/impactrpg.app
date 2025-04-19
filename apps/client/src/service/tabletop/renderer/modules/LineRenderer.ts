import * as Three from "three";
import { Module } from "../../scene";
import { threeScene, threeToEntity } from "../scene";
import { Vector3 } from "../../vector";

export class LineRendererModule extends Module<
  Three.Line<Three.BufferGeometry, Three.LineBasicMaterial>
> {
  constructor(lineWidth: number = 5) {
    super();
    const geometry = new Three.BufferGeometry();
    const material = new Three.LineBasicMaterial({
      color: 0x000,
      linewidth: lineWidth,
    });
    this.data = new Three.Line(geometry, material);
  }
  async init(): Promise<void> {
    this.type = "Module::Renderer";
    threeScene.add(this.data);
    threeToEntity.set(this.data, this.entity.uuid);
    const pos = this.entity.position;
    const rot = this.entity.rotation;
    const scale = this.entity.scale;
    this.data.position.set(pos.x, pos.y, pos.z);
    this.data.rotation.set(rot.x, rot.y, rot.z);
    this.data.scale.set(scale.x, scale.y, scale.z);
  }
  async destroy() {
    threeScene.remove(this.data);
    threeToEntity.delete(this.data);
  }
  update(): void {
    if (!this.entity.isDirty) return;
    const pos = this.entity.position;
    const rot = this.entity.rotation;
    const scale = this.entity.scale;
    this.data.position.set(pos.x, pos.y, pos.z);
    this.data.rotation.set(rot.x, rot.y, rot.z);
    this.data.scale.set(scale.x, scale.y, scale.z);
  }

  setPoints(points: Vector3[]) {
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
}
