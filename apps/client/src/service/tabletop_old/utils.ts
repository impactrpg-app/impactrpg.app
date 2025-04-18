import { TabletopObject, Vector2 } from "@impact/shared";
import { camera, getImageElement } from "./scene";
import { canvasBindingRect } from "./update";
import { scene } from "./scene";

export type Bounds = [number, number, number, number];

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
  return new Vector2(
    pos.x + camera.value.position.x,
    pos.y + camera.value.position.y,
  );
}

export function collisionDetection(
  point: Vector2,
  objectBounds: Bounds,
  objectPosition: Vector2,
  objectRotation: number,
  objectScale: number
): boolean {
  let localPoint = point.sub(objectPosition);
  localPoint = localPoint.rotate(-objectRotation);
  localPoint = localPoint.scale(1.0 / objectScale);

  return (
    localPoint.x >= objectBounds[0] &&
    localPoint.y >= objectBounds[1] &&
    localPoint.x <= objectBounds[2] &&
    localPoint.y <= objectBounds[3]
  );
}

export function getStrokeBounds(object: TabletopObject) : Bounds {
  if (!object.strokes) return [0, 0, 0, 0];
  let minX = Math.min(...object.strokes.map((stroke) => stroke.x));
  let minY = Math.min(...object.strokes.map((stroke) => stroke.y));
  let maxX = Math.max(...object.strokes.map((stroke) => stroke.x));
  let maxY = Math.max(...object.strokes.map((stroke) => stroke.y));

  const diffX = Math.abs(maxX - minX);
  if (diffX < 10) {
    const halfDiff = diffX / 2;
    minX -= halfDiff;
    maxX += halfDiff;
  }

  const diffY = Math.abs(maxY - minY);
  if (diffY < 10) {
    const halfDiff = diffY / 2;
    minY -= halfDiff;
    maxY += halfDiff;
  }

  return [minX, minY, maxX, maxY];
}

export function getImageBounds(object: TabletopObject): Bounds {
  if (!object.image)
    return [0, 0, 0, 0];
  const imageEl = getImageElement(object.uuid, object.image);
  if (!imageEl)
    return [object.position.x, object.position.y, 0, 0];

  return [
    - imageEl.width / 2,
    - imageEl.height / 2,
    imageEl.width / 2,
    imageEl.height / 2,
  ];
}

export function getObjectBounds(object: TabletopObject): Bounds {
  switch (object.type) {
    case "image":
      return getImageBounds(object);
    case "stroke":
      return getStrokeBounds(object);
    default:
      return [0, 0, 0, 0];
  }
}

export function getObjectAtPosition(
  position: Vector2,
  ignoreLock: boolean = false
): string | null {
  const objectKeys = [...scene.value.keys()];
  for (let i = objectKeys.length - 1; i >= 0; i--) {
    const object = scene.value.get(objectKeys[i]!);
    if (!object) continue;
    if (!ignoreLock && object.locked) continue;
    
    const bounds = getObjectBounds(object);
    if (collisionDetection(position, bounds, object.position, object.rotation, object.scale)) {
      return objectKeys[i]!;
    }
  }
  return null;
}
