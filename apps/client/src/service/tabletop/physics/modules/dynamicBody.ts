import * as Rapier from "@dimforge/rapier3d";
import * as Three from "three";
import { Module } from "../../scene";
import { world } from "../world";
import { Collider } from "./collider";
import { Vector3 } from "../../vector";

export type DynamicBodyType = {
  body: Rapier.RigidBody;
  colliders: Rapier.Collider[];
};

export class DynamicBodyModule extends Module<DynamicBodyType> {
  constructor(private _colliders: Collider[]) {
    super();
  }

  setActive(value: boolean) {
    this.data.body.setEnabled(value);
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
  }
  async destroy() {
    world.removeRigidBody(this.data.body);
    for (const collider of this._colliders) {
      collider.destroy();
    }
  }
  physicsUpdate(): void {
    if (this.entity.isDirty) {
      this.data.body.setTranslation(
        new Rapier.Vector3(
          this.entity.position.x,
          this.entity.position.y,
          this.entity.position.z
        ),
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
        new Rapier.Quaternion(rot.x, rot.y, rot.z, rot.w),
        true
      );
      return;
    }
    for (const collider of this._colliders) {
      collider.physicsUpdate();
    }
    const translation = this.data.body.translation();
    this.entity.position = new Vector3(
      translation.x,
      translation.y,
      translation.z
    );
    const rotation = this.data.body.rotation();
    const rot = new Three.Euler().setFromQuaternion(
      new Three.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    );
    this.entity.rotation = new Vector3(rot.x, rot.y, rot.z);
  }
}
