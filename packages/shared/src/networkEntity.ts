import { IsArray, IsEnum, IsObject, IsString } from "class-validator";
import { Vector3, Vector4 } from "./vector";

export enum NetworkModuleType {
  ImageRenderer = "ImageRenderer",
  ObjectRenderer = "ObjectRenderer",
  LineRenderer = "LineRenderer",
  BoxRenderer = "BoxRenderer",
  DynamicBody = "DynamicBody",
  StaticBody = "StaticBody",
  Network = "Network",
}

export class ImageRenderer {
  @IsEnum(NetworkModuleType)
  type: NetworkModuleType.ImageRenderer;
  @IsString()
  image: string;
}
export class ObjectRenderer {
  @IsEnum(NetworkModuleType)
  type: NetworkModuleType.ObjectRenderer;
  @IsString()
  url: string;
}
export class LineRenderer {
  @IsEnum(NetworkModuleType)
  type: NetworkModuleType.LineRenderer;
  @IsArray()
  points: Vector3[];
}
export class BoxRenderer {
  @IsEnum(NetworkModuleType)
  type: NetworkModuleType.BoxRenderer;
  @IsObject()
  size: Vector3;
}
export enum NetworkColliderType {
  Box = "box",
}
export class BoxCollider {
  @IsEnum(NetworkModuleType)
  type: NetworkColliderType.Box;
  @IsObject()
  size: Vector3;
}
export class DynamicBody {
  @IsEnum(NetworkModuleType)
  type: NetworkModuleType.DynamicBody;
  @IsArray()
  colliders: BoxCollider[];
}
export class StaticBody {
  @IsEnum(NetworkModuleType)
  type: NetworkModuleType.StaticBody;
  @IsArray()
  colliders: BoxCollider[];
}
export class Network {
  @IsEnum(NetworkModuleType)
  type: NetworkModuleType.Network;
}
export type NetworkModule =
  | ImageRenderer
  | ObjectRenderer
  | LineRenderer
  | BoxRenderer
  | DynamicBody
  | StaticBody
  | Network;

export class NetworkEntity {
  @IsString()
  uuid: string;
  @IsObject()
  position: Vector3;
  @IsObject()
  rotation: Vector4;
  @IsObject()
  scale: Vector3;
  @IsArray()
  modules: NetworkModule[];

  constructor(
    uuid: string,
    position: Vector3,
    rotation: Vector4,
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
