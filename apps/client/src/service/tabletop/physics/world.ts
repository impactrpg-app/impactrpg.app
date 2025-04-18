import * as Rapier from "@dimforge/rapier3d";

export const world = new Rapier.World({
  x: 0.0,
  y: -9.81,
  z: 0.0,
});

export const ground = world.createCollider(
  Rapier.ColliderDesc.cuboid(1000, 0.1, 1000)
);
ground.setFriction(1);
