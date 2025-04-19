import { Module } from "../../scene";
import { world } from "../world";
import { Collider } from "./collider";
import * as Rapier from "@dimforge/rapier3d";
import * as Three from "three";

export type StaticBodyType = {
  body: Rapier.RigidBody;
  colliders: Rapier.Collider[];
};

export class StaticBodyModule extends Module<StaticBodyType> {
  constructor(private colliders: Collider[]) {
    super();
  }

  async init() {
    this.type = "Module::Physics";
    const body = world.createRigidBody(
      Rapier.RigidBodyDesc.fixed().setTranslation(
        this.entity.position.x,
        this.entity.position.y,
        this.entity.position.z
      )
    );
    for (const collider of this.colliders) {
      collider.init(this.entity.uuid, body);
    }
    this.data = {
      body,
      colliders: this.colliders
        .map((collider) => collider.data)
        .filter((collider) => collider !== null),
    };
  }
  async destroy() {
    world.removeRigidBody(this.data.body);
    for (const collider of this.colliders) {
      collider.destroy();
    }
  }
  physicsUpdate() {
    for (const collider of this.colliders) {
      collider.physicsUpdate();
    }
    this.data.body.setTranslation(
      {
        x: this.entity.position.x,
        y: this.entity.position.y,
        z: this.entity.position.z,
      },
      false
    );
    const rot = new Three.Quaternion().setFromEuler(
      new Three.Euler(
        this.entity.rotation.x,
        this.entity.rotation.y,
        this.entity.rotation.z
      )
    );
    this.data.body.setRotation(
      {
        x: rot.x,
        y: rot.y,
        z: rot.z,
        w: rot.w,
      },
      false
    );
  }
}
