import * as Uuid from "uuid";
import { Vector3 } from "./vector";

export class Module<T> {
  entity: Entity = null as any;
  type: string = "error";
  data: T = null as any;

  async init(): Promise<void> {}
  async destroy(): Promise<void> {}
}

export class Entity {
  uuid: string;
  name: string;
  isDirty: boolean;
  modules: {
    [key: string]: Module<any>;
  };

  private _position: Vector3;
  private _rotation: Vector3;
  private _scale: Vector3;

  get position() {
    return this._position;
  }
  set position(value: Vector3) {
    this._position = value;
    this.isDirty = true;
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(value: Vector3) {
    this._rotation = value;
    this.isDirty = true;
  }
  get scale() {
    return this._scale;
  }
  set scale(value: Vector3) {
    this._scale = value;
    this.isDirty = true;
  }

  constructor(name: string) {
    this.uuid = Uuid.v7();
    this.name = name;
    this._position = new Vector3(0, 0, 0);
    this._rotation = new Vector3(0, 0, 0);
    this._scale = new Vector3(1, 1, 1);
    this.isDirty = true;
    this.modules = {};
    scene.set(this.uuid, this);
  }

  /**
   * Get an existing module that is attached to the entity
   * @param type The type of module to get
   * @returns The returned module
   */
  getModule<A, B extends Module<A>>(type: string): B | undefined {
    return this.modules[type] as B;
  }

  /**
   * Add a module to the entity.
   * @param type The type of the module to add
   * @param module The module to add
   */
  async addModule<A, B extends Module<A>>(module: B): Promise<B> {
    if (!!this.modules[module.type]) {
      throw new Error(`duplicate module ${module.type}`);
    }
    module.entity = this;
    await module.init();
    this.modules[module.type] = module;
    scene.set(this.uuid, this);
    return module;
  }

  /**
   * Remove a module from the entity.
   * @param module The module to remove
   */
  async removeModule(type: string) {
    await this.modules[type]?.destroy();
    delete this.modules[type];
    scene.set(this.uuid, this);
  }

  /**
   * Destroy the entity and all its modules.
   * This will remove the entity from the scene and call destroy on all its modules.
   */
  destroy() {
    Object.values(this.modules).forEach((module) => module.destroy());
    this.modules = {};
    scene.delete(this.uuid);
  }

  update() {
    scene.set(this.uuid, this);
  }
}

export const scene = new Map<string, Entity>();
export const selectedObjects = new Set<string>();
export function clearScene() {
  for (const entity of scene.values()) {
    entity.destroy();
  }
}

export function getAllComponentsOfType<T>(types: string[]): Module<T>[] {
  const objects = [...scene.values()]
    .map((obj) =>
      Object.values(obj.modules)
        .filter((module) => types.includes(module.type))
        .map((module) => module)
    )
    .flat() as Module<T>[];
  return objects;
}
