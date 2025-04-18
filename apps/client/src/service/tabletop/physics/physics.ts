import * as Three from "three";
import { world } from "./world";
import { getAllComponentsOfType, Module } from "../scene";
import {
  PHYSICS_BODY_MODULE,
  PhysicsBodyType,
  STATIC_BODY_MODULE,
} from "./module";
import { Vector3 } from "../vector";
import * as Rapier from "@dimforge/rapier3d";

function updateBodyTransforms(modules: Module<PhysicsBodyType>[]) {
  const bodies = new Set<Rapier.RigidBody>();
  for (const module of modules) {
    bodies.add(module.data.body);
    const pos = module.data.body.translation();
    // console.log(module.data);
    const rot = module.data.body.rotation();
    module.entity.position = new Vector3(pos.x, pos.y, pos.z);
    const eular = new Three.Euler().setFromQuaternion(
      new Three.Quaternion(rot.x, rot.y, rot.z, rot.w)
    );
    module.entity.rotation = new Vector3(eular.x, eular.y, eular.z);
  }
}

function updateColliderTransforms(modules: Module<Rapier.Collider>[]) {
  const colliders = new Set<Rapier.Collider>();
  for (const module of modules) {
    colliders.add(module.data);
    const pos = module.entity.position;
    const rot = new Three.Quaternion().setFromEuler(
      new Three.Euler(
        module.entity.rotation.x,
        module.entity.rotation.y,
        module.entity.rotation.z
      )
    );
    module.data.setTranslation(new Rapier.Vector3(pos.x, pos.y, pos.z));
    module.data.setRotation(new Rapier.Quaternion(rot.x, rot.y, rot.z, rot.w));
  }
}

function physicsLoop() {
  world.step();
  updateBodyTransforms(
    getAllComponentsOfType<PhysicsBodyType>([PHYSICS_BODY_MODULE])
  );
  updateColliderTransforms(
    getAllComponentsOfType<Rapier.Collider>([STATIC_BODY_MODULE])
  );
  setTimeout(physicsLoop, 16);
}
physicsLoop();
