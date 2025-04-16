import * as Three from "three";
import Rapier from "@dimforge/rapier3d";

export type SceneObject = {
  mesh: Three.Mesh;
  collider: Rapier.Collider;
  rigidbody: Rapier.RigidBody;
};
export const scene = new Set<SceneObject>();
