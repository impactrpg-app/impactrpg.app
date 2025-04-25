import { Module } from "../scene";
import * as Network from "../network";
import {
  AddObjectMessage,
  NetworkEntity,
  RemoveObjectMessage,
  UpdateObjectMessage,
} from "@impact/shared";

export class NetworkModule extends Module<any> {
  public isInitialized = false;
  private _lastUpdateTimestamp = 0;
  private _lastUpdate: UpdateObjectMessage | null = null;

  constructor() {
    super();
  }

  clone(): NetworkModule {
    return new NetworkModule();
  }
  async init(): Promise<void> {
    this.type = "Module::Network";
    this.data = {};
  }

  update(): void {
    if (!this.isInitialized) {
      this.spawn();
    }

    let hasUpdated = false;
    let updates: Partial<NetworkEntity> = {};
    if (this.entity.position.isNetworkDirty) {
      updates.position = this.entity.position.toObject();
      hasUpdated = true;
      this.entity.position.isNetworkDirty = false;
    }
    if (this.entity.rotation.isNetworkDirty) {
      updates.rotation = this.entity.rotation.toObject();
      hasUpdated = true;
      this.entity.rotation.isNetworkDirty = false;
    }
    if (this.entity.scale.isNetworkDirty) {
      updates.scale = this.entity.scale.toObject();
      hasUpdated = true;
      this.entity.scale.isNetworkDirty = false;
    }

    if (hasUpdated) {
      const updateObjectMessage = new UpdateObjectMessage(
        this.entity.uuid,
        updates
      );
      this._lastUpdate = updateObjectMessage;
      if (Date.now() - this._lastUpdateTimestamp < 100) return;
      Network.updateObject(updateObjectMessage);
      this._lastUpdateTimestamp = Date.now();
    } else if (this._lastUpdate !== null) {
      Network.updateObject(this._lastUpdate);
      this._lastUpdate = null;
    }
  }

  spawn() {
    const addObjectMessage = new AddObjectMessage(
      Network.toNetworkEntity(this.entity)
    );
    Network.addObject(addObjectMessage);
    this.isInitialized = true;
  }
  despawn() {
    const removeObjectMessage = new RemoveObjectMessage(this.entity.uuid);
    Network.removeObject(removeObjectMessage);
    this.entity.destroy();
  }
  updateEntityModules() {
    const modules = Object.values(this.entity.modules).map((module) =>
      Network.toNetworkModule(module)
    );
    const updates: Partial<NetworkEntity> = {
      uuid: this.entity.uuid,
      modules: modules.filter((module) => !!module),
    };
    Network.updateObject(new UpdateObjectMessage(this.entity.uuid, updates));
  }
}
