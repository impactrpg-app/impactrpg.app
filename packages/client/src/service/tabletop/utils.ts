import { TabletopObject, Vector2 } from "@impact/shared";
import { camera, getImageElement } from "./scene";
import { canvasBindingRect } from "./update";
import { scene } from "./scene";

export function mouseToScreenSpace(pos: Vector2): Vector2 {
  const canvasRect = canvasBindingRect.value;
  if (!canvasRect) return new Vector2(0, 0);
  const screenPos = new Vector2(
    pos.x - canvasRect.left - canvasRect.width / 2,
    pos.y - canvasRect.top - canvasRect.height / 2,
  );
  return new Vector2(
    screenPos.x / camera.value.zoom,
    screenPos.y / camera.value.zoom,
  );
}

export function screenToWorldSpace(pos: Vector2): Vector2 {
  return new Vector2(
    pos.x - camera.value.position.x,
    pos.y - camera.value.position.y,
  );
}

export function worldToScreenSpace(pos: Vector2): Vector2 {
  return {
    x: pos.x + camera.value.position.x,
    y: pos.y + camera.value.position.y,
  };
}

export function collisionDetection(
  point: Vector2,
  objectPosition: Vector2,
  objectSize: Vector2
): boolean {
  const halfSize = new Vector2(objectSize.x / 2, objectSize.y / 2);

  return (
    point.x >= objectPosition.x - halfSize.x &&
    point.x <= objectPosition.x + halfSize.x &&
    point.y >= objectPosition.y - halfSize.y &&
    point.y <= objectPosition.y + halfSize.y
  );
}

export type Bounds = {
  position: Vector2;
  size: Vector2;
};

export function getStrokeBounds(object: TabletopObject) : Bounds {
  if (!object.strokes) return {
    position: object.position,
    size: new Vector2(0, 0),
  };
  const minX = Math.min(...object.strokes.map((stroke) => stroke.x));
  const minY = Math.min(...object.strokes.map((stroke) => stroke.y));
  const maxX = Math.max(...object.strokes.map((stroke) => stroke.x));
  const maxY = Math.max(...object.strokes.map((stroke) => stroke.y));

  const size = new Vector2(maxX - minX, maxY - minY);
  const position = {
    x: minX + object.position.x + size.x / 2,
    y: minY + object.position.y + size.y / 2,
  };
  return {
    position,
    size,
  };
}

export function getImageBounds(object: TabletopObject): Bounds {
  if (!object.image)
    return {
      position: new Vector2(0, 0),
      size: new Vector2(0, 0),
    };
  const imageEl = getImageElement(object.uuid, object.image);
  if (!imageEl)
    return {
      position: object.position,
      size: new Vector2(0, 0),
    };
  return {
    position: object.position,
    size: new Vector2(imageEl.width, imageEl.height),
  };
}

export function getObjectBounds(object: TabletopObject): Bounds {
  switch (object.type) {
    case "image":
      return getImageBounds(object);
    case "stroke":
      return getStrokeBounds(object);
    default:
      return {
        position: object.position,
        size: new Vector2(0, 0),
      };
  }
}

export function getObjectAtPosition(
  position: Vector2,
  ignoreLock: boolean = false
): string | null {
  const objectKeys = [...scene.value.keys()];
  for (let i = objectKeys.length - 1; i >= 0; i--) {
    const object = scene.value.get(objectKeys[i]);
    if (!object) continue;
    if (!ignoreLock && object.locked) continue;
    
    const bounds = getObjectBounds(object);
    if (collisionDetection(position, bounds.position, bounds.size)) {
      return objectKeys[i];
    }
  }
  return null;
}
