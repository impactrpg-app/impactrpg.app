import Rapier from "@dimforge/rapier3d";

export const world = new Rapier.World({
  x: 0.0,
  y: -9.81,
  z: 0.0,
});
function physicsLoop() {
  world.step();
  setTimeout(physicsLoop, 16);
}
physicsLoop();

// setup ground for collision
export const ground = world.createCollider(Rapier.ColliderDesc.cuboid(50, 0.1, 50));
ground.setFriction(1);