import { Module } from "../scene";
import * as Network from "../network";
import {
  AddObjectMessage,
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
      const addObjectMessage = new AddObjectMessage(
        Network.toNetworkEntity(this.entity)
      );
      Network.addObject(addObjectMessage);
      this.isInitialized = true;
    }
    if (this.entity.isDirty) {
      const updateObjectMessage = new UpdateObjectMessage(this.entity.uuid, {
        position: this.entity.position.toObject(),
        rotation: this.entity.rotation.toObject(),
        scale: this.entity.scale.toObject(),
      });
      this._lastUpdate = updateObjectMessage;
      if (Date.now() - this._lastUpdateTimestamp < 100) return;
      Network.updateObject(updateObjectMessage);
      this._lastUpdateTimestamp = Date.now();
    } else if (this._lastUpdate !== null) {
      Network.updateObject(this._lastUpdate);
      this._lastUpdate = null;
    }
  }

  despawn() {
    const removeObjectMessage = new RemoveObjectMessage(this.entity.uuid);
    Network.removeObject(removeObjectMessage);
    this.entity.destroy();
  }
}
