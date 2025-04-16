import * as Three from "../three";
import * as Rapier from "../rapier";
import { scene } from "../scene";

export * from "./d6";

export function clear() {
  Three.scene.clear();
  for (const obj of scene) {
    Rapier.world.removeCollider(obj.collider, false);
    Rapier.world.removeRigidBody(obj.rigidbody);
  }
  scene.clear();
}
