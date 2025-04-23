import * as Uuid from "uuid";
import { Vector3, Vector4 } from "./vector";
import { ref } from "vue";

export class Module<T> {
  entity: Entity = null as any;
  type: string = "error";
  protected data: T = null as any;

  constructor() {}

  getData() {
    return this.data;
  }

  async init(): Promise<void> {}
  async destroy(): Promise<void> {}
  clone(): Module<T> {
    throw new Error('"clone" method not implemented');
  }
  update(): void {}
  physicsUpdate(): void {}

  // input events
  onMouseDown(e: MouseEvent): void {}
  onMouseUp(e: MouseEvent): void {}
  onMouseMove(e: MouseEvent): void {}
  onKeyDown(e: KeyboardEvent): void {}
  onKeyUp(e: KeyboardEvent): void {}
  onWheel(e: WheelEvent): void {}
}

export class Entity {
  uuid: string;
  name: string;
  // used internally to ignore player interactions with certain objects
  isInteractable: boolean;
  // used by the player to lock movement for a entity
  isLocked: boolean;
  modules: {
    [key: string]: Module<any>;
  };
  tags: string[];

  position: Vector3;
  rotation: Vector4;
  scale: Vector3;

  constructor(name: string) {
    this.uuid = Uuid.v7();
    this.name = name;
    this.position = new Vector3(0, 0, 0);
    this.rotation = new Vector4(0, 0, 0, 1);
    this.scale = new Vector3(1, 1, 1);
    this.isInteractable = true;
    this.isLocked = false;
    this.modules = {};
    this.tags = [];
    scene.set(this.uuid, this);
  }

  /**
   * Get an existing module that is attached to the entity
   * @param type The type of module to get
   * @returns The returned module
   */
  getModule<T extends Module<unknown>>(type: string): T | undefined {
    return this.modules[type] as T;
  }

  /**
   * Add a module to the entity.
   * @param module The module to add
   * @returns The added module
   * @throws Error if the module is already added
   */
  async addModule<T extends Module<unknown>>(module: T): Promise<T> {
    if (!!this.modules[module.type]) {
      return this.modules[module.type] as T;
    }
    module.entity = this;
    await module.init();
    this.modules[module.type] = module;
    if (moduleToEntity.has(module.type)) {
      moduleToEntity.set(module.type, [
        ...moduleToEntity.get(module.type)!,
        this.uuid,
      ]);
    } else {
      moduleToEntity.set(module.type, [this.uuid]);
    }
    return module;
  }

  /**
   * Remove a module from the entity.
   * @param module The module to remove
   */
  async removeModule(type: string) {
    await this.modules[type]?.destroy();
    delete this.modules[type];
    moduleToEntity.set(
      type,
      moduleToEntity.get(type)!.filter((uuid) => uuid !== this.uuid)
    );
    scene.set(this.uuid, this);
  }

  /**
   * Update a module attached to the entity.
   * @param data The module to update
   * @returns The updated module
   * @throws Error if the module is not found
   */
  async updateModule<T extends Module<unknown>>(data: T): Promise<T> {
    await data.init();
    const module = this.modules[data.type];
    if (!module) {
      await data.destroy();
      throw new Error(`Module ${data.type} not found`);
    }
    await module.destroy();
    data.entity = this;
    this.modules[data.type] = data;
    return data;
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

  static findModule<T extends Module<any>>(type: string): T[] | null {
    const uuids = moduleToEntity.get(type);
    if (!uuids) {
      return null;
    }
    const entities = uuids.map((uuid) => scene.get(uuid)!);
    const modules = entities.map((entity) => entity.getModule<T>(type)!);
    return modules;
  }
  static findWithTag(tag: string): Entity | null {
    for (const entity of scene.values()) {
      if (entity.tags.includes(tag)) {
        return entity;
      }
    }
    return null;
  }
}

export const scene = new Map<string, Entity>();
export const moduleToEntity = new Map<string, string[]>();
export const selectedObjects = new Set<string>();
export const isContextMenuOpen = ref(false);

export function clearScene() {
  for (const entity of scene.values()) {
    entity.destroy();
  }
}
export function clearPhysicsDirty() {
  for (const entity of scene.values()) {
    entity.position.isPhysicsDirty = false;
    entity.rotation.isPhysicsDirty = false;
    entity.scale.isPhysicsDirty = false;
  }
}

export function clearRenderDirty() {
  for (const entity of scene.values()) {
    entity.position.isRenderDirty = false;
    entity.rotation.isRenderDirty = false;
    entity.scale.isRenderDirty = false;
  }
}
