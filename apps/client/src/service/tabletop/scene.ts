import * as Uuid from "uuid";

export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

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
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  modules: {
    [key: string]: Module<any>;
  };

  constructor(name: string) {
    this.uuid = Uuid.v7();
    this.name = name;
    this.position = new Vector3(0, 0, 0);
    this.rotation = new Vector3(0, 0, 0);
    this.scale = new Vector3(1, 1, 1);
    this.modules = {};
    scene.set(this.uuid, this);
  }

  getModule<T>(type: string): Module<T> | undefined {
    return this.modules[type] as Module<T>;
  }

  /**
   * Add a module to the entity.
   * @param type The type of the module to add
   * @param module The module to add
   */
  async addModule<T>(module: Module<T>): Promise<Module<T>> {
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

export function getAllComponentsOfType<T>(type: string): Module<T>[] {
  const objects = [...scene.values()]
    .map((obj) =>
      Object.values(obj.modules)
        .filter((module) => module.type.startsWith(type))
        .map((module) => module)
    )
    .flat() as Module<T>[];
  return objects;
}
