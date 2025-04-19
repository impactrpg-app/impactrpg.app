import { v4 as uuidv4 } from "uuid";
import { Vector3 } from "./vector";

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
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  modules: {
    [key: string]: any;
  };
}
