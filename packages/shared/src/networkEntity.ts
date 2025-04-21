import { Vector3 } from "./vector";

export enum NetworkModuleType {
  ImageRenderer = "ImageRenderer",
  ObjectRenderer = "ObjectRenderer",
  LineRenderer = "LineRenderer",
  BoxRenderer = "BoxRenderer",
  DynamicBody = "DynamicBody",
  StaticBody = "StaticBody",
  Network = "Network",
}

export type ImageRenderer = {
  type: NetworkModuleType.ImageRenderer;
  image: string;
};
export type ObjectRenderer = {
  type: NetworkModuleType.ObjectRenderer;
  url: string;
};
export type LineRenderer = {
  type: NetworkModuleType.LineRenderer;
  points: Vector3[];
};
export type BoxRenderer = {
  type: NetworkModuleType.BoxRenderer;
  size: Vector3;
};
export enum NetworkColliderType {
  Box = "box",
}
export type BoxCollider = {
  type: NetworkColliderType.Box;
  size: Vector3;
};
export type DynamicBody = {
  type: NetworkModuleType.DynamicBody;
  colliders: BoxCollider[];
};
export type StaticBody = {
  type: NetworkModuleType.StaticBody;
  colliders: BoxCollider[];
};
export type Network = {
  type: NetworkModuleType.Network;
};
export type NetworkModule =
  | ImageRenderer
  | ObjectRenderer
  | LineRenderer
  | BoxRenderer
  | DynamicBody
  | StaticBody
  | Network;

export class NetworkEntity {
  uuid: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  modules: NetworkModule[];

  constructor(
    uuid: string,
    position: Vector3,
    rotation: Vector3,
    scale: Vector3,
    modules: NetworkModule[]
  ) {
    this.uuid = uuid;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.modules = modules;
  }
}
