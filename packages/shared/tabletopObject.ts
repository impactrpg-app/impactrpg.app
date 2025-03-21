import { Vector2 } from "./vector";

export enum TabletopObjectType {
  None = 'none',
  Image = 'image',
  Stroke = 'stroke'
}

export class TabletopObject {
  uuid: string;
  type: TabletopObjectType;
  position: Vector2;
  rotation: number;
  scale: number;
  locked: boolean;
  image?: string;
  strokes?: Vector2[];
  strokeWidth?: number;
  strokeColor?: string;

  static newImage(
    position: Vector2,
    image: string,
  ) {
    const obj =new TabletopObject();
    obj.type = TabletopObjectType.Image;
    obj.position = position;
    obj.rotation = 0;
    obj.scale = 1;
    obj.locked = false;
    obj.image = image;
    return obj;
  }
};