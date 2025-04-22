import { world } from "../world";
import { BaseBodyModule } from "./baseBody";
import { Collider } from "./collider";
import * as Rapier from "@dimforge/rapier3d";

export type StaticBodyType = {
  body: Rapier.RigidBody;
  colliders: Rapier.Collider[];
};

export class StaticBodyModule extends BaseBodyModule {
  constructor(colliders: Collider[]) {
    super(colliders);
  }

  clone(): StaticBodyModule {
    return new StaticBodyModule(this._colliders);
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
    for (const collider of this._colliders) {
      collider.init(this.entity.uuid, body);
    }
    this.data = {
      body,
      colliders: this._colliders
        .map((collider) => collider.data)
        .filter((collider) => collider !== null),
    };
    this.autoUpdateTransform = false;
    this.entity.isDirty = true;
  }
}
