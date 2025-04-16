import * as Three from "three";
import Rapier from "@dimforge/rapier3d";
import * as RapierInit from "../rapier";
import * as ThreeInit from "../three";
import { scene } from "../scene";

export type Vector3 = { x: number; y: number; z: number };
export type Vector4 = { x: number; y: number; z: number; w: number };

export function createD6(
  position: Vector3 = { x: 0, y: 0, z: 0 },
  rotation: Vector4 = {
    x: 0,
    y: 0,
    z: 0,
    w: 0,
  },
  size: number = 1,
  velocity?: Vector3,
  angularVelocity?: Vector3
) {
  const rigidbody = RapierInit.world.createRigidBody(
    Rapier.RigidBodyDesc.dynamic().setTranslation(
      position.x,
      position.y,
      position.z
    )
  );
  rigidbody.setRotation(rotation, false);
  const collider = RapierInit.world.createCollider(
    Rapier.ColliderDesc.cuboid(size, size, size),
    rigidbody
  );
  collider.setFriction(1);

  const image = document.createElement("img");
  image.src = "/assets/themes/default/diffuse-dark.png";

  const geometry = new Three.BoxGeometry(size, size, size);
  const material = new Three.MeshPhysicalMaterial({
    map: new Three.Texture(image),
  });
  const mesh = new Three.Mesh(geometry, material);
  mesh.castShadow = true;
  ThreeInit.scene.add(mesh);
  scene.add({
    mesh,
    collider,
    rigidbody,
  });

  // add initial forces
  if (velocity) {
    rigidbody.setLinvel(velocity, true);
  }
  if (angularVelocity) {
    rigidbody.setAngvel(angularVelocity, false);
  }

  return {
    mesh,
    collider,
    rigidbody,
  };
}
