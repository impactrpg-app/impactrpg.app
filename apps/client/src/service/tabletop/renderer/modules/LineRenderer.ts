import * as Three from "three";
import { Module } from "../../scene";
import { threeScene, threeToEntity } from "../scene";
import { Vector3 } from "../../vector";

export class LineRendererModule extends Module<Three.Object3D> {
  private line: Three.Line<Three.BufferGeometry, Three.LineBasicMaterial>;

  constructor(lineWidth: number = 5) {
    super();
    const geometry = new Three.BufferGeometry();
    const material = new Three.LineBasicMaterial({
      color: 0x000,
      linewidth: lineWidth,
    });
    this.line = new Three.Line(geometry, material);
  }
  async init(): Promise<void> {
    this.type = "Module::Renderer";
    threeScene.add(this.line);
    threeToEntity.set(this.line, this.entity.uuid);
    const pos = this.entity.position;
    const rot = this.entity.rotation;
    const scale = this.entity.scale;
    this.line.position.set(pos.x, pos.y, pos.z);
    this.line.rotation.set(rot.x, rot.y, rot.z);
    this.line.scale.set(scale.x, scale.y, scale.z);
  }
  async destroy() {
    threeScene.remove(this.line);
    threeToEntity.delete(this.line);
  }
  update(): void {
    if (!this.entity.isDirty) return;
    const pos = this.entity.position;
    const rot = this.entity.rotation;
    const scale = this.entity.scale;
    this.line.position.set(pos.x, pos.y, pos.z);
    this.line.rotation.set(rot.x, rot.y, rot.z);
    this.line.scale.set(scale.x, scale.y, scale.z);
  }

  setPoints(points: Vector3[]) {
    const positions = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      const point = points[i]!;
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }
    this.line.geometry.setAttribute(
      "position",
      new Three.BufferAttribute(positions, 3)
    );
    this.line.geometry.computeBoundingSphere();
  }
}
