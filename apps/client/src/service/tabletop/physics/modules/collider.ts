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
  init(entityUuid: string, parent: Rapier.RigidBody) {}
  destroy() {}
  physicsUpdate() {}
}

export class BoxCollider extends Collider {
  constructor(private _size: Vector3 = Vector3.one()) {
    super(ColliderType.Box);
  }
  get size() {
    return this._size;
  }
  set size(value: Vector3) {
    this._size = new Vector3(value.x, value.y, value.z);
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
