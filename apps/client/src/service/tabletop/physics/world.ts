import * as Rapier from "@dimforge/rapier3d";
import { Vector3 } from "../vector";
import { Entity, scene } from "../scene";
import { DynamicBodyModule } from "./modules";

export let world = new Rapier.World({
  x: 0.0,
  y: -9.81,
  z: 0.0,
});
export const colliderToEntity = new Map<Rapier.Collider, string>();

export function clearWorld() {
  world = new Rapier.World({
    x: 0.0,
    y: -9.81,
    z: 0.0,
  });
}

export function CastRay(origin: Vector3, direction: Vector3, distance: number) {
  const result = world.castRay(
    new Rapier.Ray(origin, direction),
    distance,
    true
  );
  if (!result) return null;
  const entityUuid = colliderToEntity.get(result.collider);
  if (!entityUuid) return null;
  const entity = scene.get(entityUuid);
  if (!entity) return null;
  const point = origin.add(direction.multiply(result.timeOfImpact));
  return {
    entity,
    point,
  };
}
