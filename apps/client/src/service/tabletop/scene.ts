import * as Uuid from "uuid";
import { Vector3 } from "./vector";
import { ref } from "vue";

export class Module<T> {
  entity: Entity = null as any;
  type: string = "error";
  protected data: T = null as any;

  getData() {
    return this.data;
  }

  async init(): Promise<void> {}
  async destroy(): Promise<void> {}
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
  // dirty entity is automatically set as false at the end of the scene
  isDirty: boolean;
  // used internally to ignore player interactions with certain objects
  isInteractable: boolean;
  // used by the player to lock movement for a entity
  isLocked: boolean;
  modules: {
    [key: string]: Module<any>;
  };
  tags: string[];

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
export function clearDirtyEntities() {
  for (const entity of scene.values()) {
    if (entity.isDirty) {
      entity.isDirty = false;
    }
  }
}
