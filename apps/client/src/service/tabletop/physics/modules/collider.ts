import * as Rapier from "@dimforge/rapier3d";
import { Vector3 } from "../../vector";
import { colliderToEntity, world } from "../world";
import * as Three from "three";

export enum ColliderType {
  Box = "box",
}

export class Collider {
  protected _data: Rapier.Collider | null = null;

  constructor(public readonly type: ColliderType) {}
  get data() {
    return this._data;
  }

  resize(scale: Vector3) {}
  init(entityUuid: string, parent: Rapier.RigidBody) {}
  destroy() {}
  physicsUpdate() {}
}

export class BoxCollider extends Collider {
  constructor(private _size: Vector3 = Vector3.one()) {
    super(ColliderType.Box);
  }
  resize(scale: Vector3) {
    if (!this.data) return;
    this.data.setShape(
      new Rapier.Cuboid(
        this._size.x * scale.x,
        this._size.y * scale.y,
        this._size.z * scale.z
      )
    );
  }

  init(entityUuid: string, parent: Rapier.RigidBody) {
    this._data = world.createCollider(
      Rapier.ColliderDesc.cuboid(this._size.x, this._size.y, this._size.z),
      parent
    );
    colliderToEntity.set(this._data, entityUuid);
  }

  destroy(): void {
    if (this._data) {
      world.removeCollider(this._data, false);
      colliderToEntity.delete(this._data);
    }
  }
}
