import type { TabletopObject, Vector2 } from "@impact/shared";
import { camera, getImageElement } from "./scene";
import { canvasBindingRect } from "./update";
import { scene } from "./scene";

export function mouseToScreenSpace(pos: Vector2): Vector2 {
  const canvasRect = canvasBindingRect.value;
  if (!canvasRect) return { x: 0, y: 0 };
  const screenPos = {
    x: pos.x - canvasRect.left - canvasRect.width / 2,
    y: pos.y - canvasRect.top - canvasRect.height / 2,
  };
  return {
    x: screenPos.x / camera.value.zoom,
    y: screenPos.y / camera.value.zoom,
  };
}

export function screenToWorldSpace(pos: Vector2): Vector2 {
  return {
    x: pos.x - camera.value.position.x,
    y: pos.y - camera.value.position.y,
  };
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
  const halfSize = {
    x: objectSize.x / 2,
    y: objectSize.y / 2,
  } as Vector2;

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
    size: { x: 0, y: 0 },
  };
  const minX = Math.min(...object.strokes.map((stroke) => stroke.x));
  const minY = Math.min(...object.strokes.map((stroke) => stroke.y));
  const maxX = Math.max(...object.strokes.map((stroke) => stroke.x));
  const maxY = Math.max(...object.strokes.map((stroke) => stroke.y));

  const size = {
    x: maxX - minX,
    y: maxY - minY,
  };
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
      position: { x: 0, y: 0 },
      size: { x: 0, y: 0 },
    };
  const imageEl = getImageElement(object.uuid, object.image);
  if (!imageEl)
    return {
      position: object.position,
      size: { x: 0, y: 0 },
    };
  return {
    position: object.position,
    size: { x: imageEl.width, y: imageEl.height },
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
        size: { x: 0, y: 0 },
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
