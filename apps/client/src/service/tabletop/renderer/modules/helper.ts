import { Entity } from "../../scene";
import * as Three from "three";

export function updateThreeObject(
  entity: Entity,
  obj: Three.Object3D,
  forceUpdate: boolean = false
) {
  if (entity.position.isRenderDirty || forceUpdate) {
    obj.position.set(entity.position.x, entity.position.y, entity.position.z);
  }
  if (entity.rotation.isRenderDirty || forceUpdate) {
    obj.setRotationFromQuaternion(
      new Three.Quaternion(
        entity.rotation.x,
        entity.rotation.y,
        entity.rotation.z,
        entity.rotation.w
      )
    );
  }
  if (entity.scale.isRenderDirty || forceUpdate) {
    obj.scale.set(entity.scale.x, entity.scale.y, entity.scale.z);
  }
}
