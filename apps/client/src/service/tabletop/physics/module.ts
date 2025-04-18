import * as Rapier from "@dimforge/rapier3d";
import * as Three from "three";
import { Module } from "../scene";
import { world } from "./world";

export type PhysicsBodyType = {
  body: Rapier.RigidBody;
  colliders: Rapier.Collider[];
};

export enum ColliderType {
  Box = "box",
}

export class Collider {
  constructor(public readonly type: ColliderType) {}
}

export class BoxCollider extends Collider {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly depth: number
  ) {
    super(ColliderType.Box);
  }
}

export const PHYSICS_BODY_MODULE = "Module::PhysicsBody";
export class PhysicsBody extends Module<PhysicsBodyType> {
  constructor(private colliders: Collider[]) {
    super();
  }

  private convertCollider(
    collider: Collider,
    rigidbody: Rapier.RigidBody
  ): Rapier.Collider {
    switch (collider.type) {
      case ColliderType.Box: {
        const col = collider as BoxCollider;
        return world.createCollider(
          Rapier.ColliderDesc.cuboid(col.width, col.height, col.depth),
          rigidbody
        );
      }
      default: {
        throw new Error(`Unknown collider type: ${collider.type}`);
      }
    }
  }

  private convertColliders(colliders: Collider[], rigidbody: Rapier.RigidBody) {
    return colliders.map((col) => this.convertCollider(col, rigidbody));
  }

  async init() {
    this.type = PHYSICS_BODY_MODULE;
    const rotation = new Three.Quaternion().setFromEuler(
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
          x: rotation.x,
          y: rotation.y,
          z: rotation.z,
          w: rotation.w,
        })
    );
    const colliders = this.convertColliders(this.colliders, body);
    this.data = {
      body,
      colliders,
    };
  }
  async destroy() {
    for (const collider of this.data.colliders) {
      world.removeCollider(collider, false);
    }
    world.removeRigidBody(this.data.body);
  }
}
