import * as Rapier from "@dimforge/rapier3d";
import * as Three from "three";
import { Module } from "../../scene";
import { world } from "../world";
import { Collider } from "./collider";
import { Vector3 } from "../../vector";

export type PhysicsBodyType = {
  body: Rapier.RigidBody;
  colliders: Rapier.Collider[];
};

export class BaseBodyModule extends Module<PhysicsBodyType> {
  public autoUpdateTransform = true;

  constructor(protected _colliders: Collider[]) {
    super();
  }

  get colliders() {
    return this._colliders;
  }

  setActive(value: boolean) {
    this.data.body.setEnabled(value);
  }
  async init() {
    this.type = "Module::Physics";
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
      for (const collider of this._colliders) {
        collider.setScale(this.entity.scale);
      }
      return;
    }
    if (!this.autoUpdateTransform) return;
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
