import * as Rapier from "@dimforge/rapier3d";
import * as Three from "three";
import { world } from "../physics";
import { threeScene } from "../renderer";
import { Module } from "../scene";

export class DebuggerModule extends Module<any> {
  private world: Rapier.World;
  private mesh: Three.LineSegments;

  constructor() {
    super();
    this.world = world;
    this.mesh = new Three.LineSegments(
      new Three.BufferGeometry(),
      new Three.LineBasicMaterial({
        color: 0xffffff,
        vertexColors: true,
        linewidth: 5,
      })
    );
    this.mesh.frustumCulled = false;
    threeScene.add(this.mesh);
  }
  async destroy(): Promise<void> {
    threeScene.remove(this.mesh);
  }

  clone(): DebuggerModule {
    return new DebuggerModule();
  }
  update() {
    const { vertices, colors } = this.world.debugRender();
    this.mesh.geometry.setAttribute(
      "position",
      new Three.BufferAttribute(vertices, 3)
    );
    this.mesh.geometry.setAttribute(
      "color",
      new Three.BufferAttribute(colors, 4)
    );
    this.mesh.visible = true;
  }
}
