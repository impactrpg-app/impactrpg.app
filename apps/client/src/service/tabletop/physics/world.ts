import * as Rapier from "@dimforge/rapier3d";

export let world = new Rapier.World({
  x: 0.0,
  y: -9.81,
  z: 0.0,
});

export function clearWorld() {
  world = new Rapier.World({
    x: 0.0,
    y: -9.81,
    z: 0.0,
  });
}
