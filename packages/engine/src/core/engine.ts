import type { System } from "./system";
import { Events, EventType } from "./events";
import { Scene } from "./scene";
import { Entity } from "./entity";

export enum EngineEventType {
  SceneChanged = "sceneChanged",
}

export class Engine {
  private _activeScenes: Scene[] = [];
  private _systems: Set<System> = new Set();
  private _events: Events = new Events();
  private _hasUserInteractedWithWindow = false;

  public get events(): Events {
    return this._events;
  }

  constructor() {
    document.addEventListener("click", () => this.handleActivatedWindow);
  }

  // handle window activation
  private handleActivatedWindow() {
    this._hasUserInteractedWithWindow = true;
    document.removeEventListener("click", () => this.handleActivatedWindow);
  }
  get hasUserInteractedWithWindow(): boolean {
    return this._hasUserInteractedWithWindow;
  }

  // scene
  get activeScenes(): Scene[] {
    return this._activeScenes;
  }
  set activeScenes(value: Scene[]) {
    // change scene
    for (const prev of this._activeScenes) {
      for (const entity of prev.entities) {
        prev.removeEntity(entity);
      }
      prev.onStop();
    }
    for (const next of value) {
      next.onStart();
      for (const entity of next.entities) {
        this.recursivelyTriggerAddEvents(entity);
      }
    }
    this._activeScenes = value;

    // send scene change event
    //this._events.triggerEvent(EventType.SceneChanged, prev, value);
  }
  private recursivelyTriggerAddEvents(entity: Entity) {
    this._events.triggerEvent(EventType.EntityAdded, entity);
    this._events.triggerEvent(EventType.EntityTransformChanged, entity);
    for (const module of Object.values(entity.getModules())) {
      this._events.triggerEvent(EventType.ModuleAdded, module);
    }
    for (const child of entity.getChildren()) {
      this.recursivelyTriggerAddEvents(child);
    }
  }

  // system
  async addSystem<T extends System>(system: T): Promise<T> {
    await system.onAttached();
    this._systems.add(system);
    return system;
  }
  async removeSystem(system: System): Promise<void> {
    await system.onDetached();
    this._systems.delete(system);
  }

  // loop evenets
  public onPhysics() {
    for (const scene of this.activeScenes) {
      scene.onPhysics();
      for (const system of this._systems) {
        system.onPhysics();
      }
    }
  }
  public onRender() {
    for (const scene of this.activeScenes) {
      scene.onRender();
      for (const system of this._systems) {
        system.onRender();
      }
    }
  }
}
const _engine = new Engine();
export const engine = _engine;
