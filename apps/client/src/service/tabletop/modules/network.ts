import { Module } from "../scene";
import * as Network from "../network";
import { AddObjectMessage, UpdateObjectMessage } from "@impact/shared";

export class NetworkModule extends Module<any> {
  public isInitialized = false;
  private _lastUpdateTimestamp = 0;

  constructor() {
    super();
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
    if (!this.entity.isDirty) {
      if (Date.now() - this._lastUpdateTimestamp < 100) return;
      const updateObjectMessage = new UpdateObjectMessage(this.entity.uuid, {
        position: this.entity.position,
        rotation: this.entity.rotation,
        scale: this.entity.scale,
      });
      Network.updateObject(updateObjectMessage);
      this._lastUpdateTimestamp = Date.now();
    }
  }
}
