import { Module } from "../scene";
import * as Network from "../network";
import {
  AddObjectMessage,
  RemoveObjectMessage,
  UpdateObjectMessage,
} from "@impact/shared";

export class NetworkModule extends Module<any> {
  public isReady = false;

  async init(): Promise<void> {
    this.type = "Module::Network";
    this.data = {};
  }
  async destroy(): Promise<void> {
    Network.removeObject(new RemoveObjectMessage(this.entity.uuid));
  }

  update(): void {
    if (!this.isReady) {
      const addObjectMessage = new AddObjectMessage(
        Network.toNetworkEntity(this.entity)
      );
      Network.addObject(addObjectMessage);
      this.isReady = true;
    }
    if (!this.entity.isDirty) {
      const updateObjectMessage = new UpdateObjectMessage(this.entity.uuid, {
        position: this.entity.position,
        rotation: this.entity.rotation,
        scale: this.entity.scale,
      });
      Network.updateObject(updateObjectMessage);
    }
  }
}
