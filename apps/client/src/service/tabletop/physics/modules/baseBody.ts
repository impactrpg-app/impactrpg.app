import * as Rapier from "@dimforge/rapier3d";
import * as Three from "three";
import { Module, scene } from "../../scene";
import { world } from "../world";
import { Collider } from "./collider";
import { Vector3, Vector4 } from "../../vector";

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
  protected updatePhysicsObject(force: boolean = false) {
    let updated = false;
    if (this.entity.position.isPhysicsDirty || force) {
      updated = true;
      this.data.body.setTranslation(
        new Rapier.Vector3(
          this.entity.position.x,
          this.entity.position.y,
          this.entity.position.z
        ),
        false
      );
    }
    if (this.entity.rotation.isPhysicsDirty || force) {
      updated = true;
      this.data.body.setRotation(
        new Rapier.Quaternion(
          this.entity.rotation.x,
          this.entity.rotation.y,
          this.entity.rotation.z,
          this.entity.rotation.w
        ),
        false
      );
    }
    if (this.entity.scale.isPhysicsDirty || force) {
      updated = true;
      for (const collider of this._colliders) {
        collider.setScale(this.entity.scale);
      }
    }
    return updated;
  }
  physicsUpdate(): void {
    if (this.updatePhysicsObject()) return;
    if (!this.autoUpdateTransform) return;
    const translation = this.data.body.translation();
    this.entity.position = new Vector3(
      translation.x,
      translation.y,
      translation.z
    );
    const rotation = this.data.body.rotation();
    this.entity.rotation = new Vector4(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w
    );
  }
  setLinearVelocity(vec: Vector3) {
    this.data.body.setLinvel(new Rapier.Vector3(vec.x, vec.y, vec.z), false);
  }
  setAngularVelocity(vec: Vector3) {
    this.data.body.setAngvel(new Rapier.Vector3(vec.x, vec.y, vec.z), false);
  }
  getLinearVelocity(): Vector3 {
    const vec = this.data.body.linvel();
    return new Vector3(vec.x, vec.y, vec.z);
  }
  getAngularVelocity(): Vector3 {
    const vec = this.data.body.angvel();
    return new Vector3(vec.x, vec.y, vec.z);
  }
}
