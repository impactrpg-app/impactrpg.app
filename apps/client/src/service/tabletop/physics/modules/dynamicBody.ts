import * as Rapier from "@dimforge/rapier3d";
import * as Three from "three";
import { world } from "../world";
import { Collider } from "./collider";
import { BaseBodyModule } from "./baseBody";

export class DynamicBodyModule extends BaseBodyModule {
  constructor(colliders: Collider[]) {
    super(colliders);
  }

  async init() {
    this.type = "Module::Physics";
    const rot = new Three.Quaternion().setFromEuler(
      new Three.Euler(
        this.entity.rotation.x,
        this.entity.rotation.y,
        this.entity.rotation.z
      )
    );
    const body = world.createRigidBody(
      Rapier.RigidBodyDesc.dynamic()
        .setTranslation(
          this.entity.position.x,
          this.entity.position.y,
          this.entity.position.z
        )
        .setRotation({
          x: rot.x,
          y: rot.y,
          z: rot.z,
          w: rot.w,
        })
    );
    for (const collider of this._colliders) {
      collider.init(this.entity.uuid, body);
    }
    this.data = {
      body,
      colliders: this._colliders
        .map((collider) => collider.data)
        .filter((collider) => collider !== null),
    };
    this.entity.isDirty = true;
  }
}
