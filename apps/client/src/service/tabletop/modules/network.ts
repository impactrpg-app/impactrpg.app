import { Module } from "../scene";
import * as Network from "../network";
import { AddObjectMessage, RemoveObjectMessage } from "@impact/shared";

export class NetworkModule extends Module<any> {
  public isInitialized = false;

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
      // const updateObjectMessage = new UpdateObjectMessage(this.entity.uuid, {
      //   position: this.entity.position,
      //   rotation: this.entity.rotation,
      //   scale: this.entity.scale,
      // });
      // Network.updateObject(updateObjectMessage);
    }
  }
}
