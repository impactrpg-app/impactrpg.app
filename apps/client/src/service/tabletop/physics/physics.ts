import * as Rapier from "@dimforge/rapier3d";
import * as Three from "three";
import { world } from "./world";
import { getAllComponentsOfType, Vector3 } from "../scene";
import { PHYSICS_BODY_MODULE, PhysicsBodyType } from "./module";

function physicsLoop() {
  world.step();
  setTimeout(physicsLoop, 16);
}
physicsLoop();

function updateRigidbodies() {
  const modules = getAllComponentsOfType<PhysicsBodyType>(PHYSICS_BODY_MODULE);
  for (const module of modules) {
    const pos = module.data.body.translation();
    // console.log(module.data);
    const rot = module.data.body.rotation();
    module.entity.position = new Vector3(pos.x, pos.y, pos.z);
    const eular = new Three.Euler().setFromQuaternion(
      new Three.Quaternion(rot.x, rot.y, rot.z, rot.w)
    );
    module.entity.rotation = new Vector3(eular.x, eular.y, eular.z);
  }
  setTimeout(updateRigidbodies, 10);
}
updateRigidbodies();
