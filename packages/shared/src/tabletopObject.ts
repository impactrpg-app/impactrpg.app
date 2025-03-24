import { v4 as uuidv4 } from "uuid";
import { Vector2 } from "./vector";

export enum TabletopObjectType {
  None = 'none',
  Image = 'image',
  Stroke = 'stroke'
}

export class UserToken {
  uuid: string;
  owner: string;
  name: string;
  wounds: number;
  corruption: number;
  defense: number;
  attack: number;
  constructor(owner: string) {
    this.owner = owner;
    this.uuid = "";
    this.name = "";
    this.wounds = 0;
    this.corruption = 0;
    this.defense = 2;
    this.attack = 2;
  }
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
  order?: number;
  userToken?: UserToken | null;

  constructor(type: TabletopObjectType, position: Vector2) {
    this.uuid = uuidv4();
    this.type = type;
    this.position = position;
    this.rotation = 0;
    this.scale = 1;
    this.locked = false;
    this.userToken = null;
  }

  static NewImageObject(
    position: Vector2,
    image: string,
  ) {
    const obj = new TabletopObject(TabletopObjectType.Image, position);
    obj.image = image;
    return obj;
  }

  static NewStrokeObject(stroke: Vector2) {
    const obj = new TabletopObject(TabletopObjectType.Stroke, new Vector2(0, 0));
    obj.strokeWidth = 5;
    obj.strokeColor = "black";
    obj.strokes = [stroke];
    return obj;
  }
};