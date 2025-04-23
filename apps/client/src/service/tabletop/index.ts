import "./input";
import * as Default from "./defaultScene";
import * as Network from "./network";
import * as Input from "./input";
import * as Renderer from "./renderer";
import * as Audio from "./audio";

export * from "./scene";
export * from "./renderer";
export * from "./physics";
export * from "./modules";
export * from "./network";
export * from "./defaultScene";
export * from "./helpers";
export * from "./diceRoller";
export * from "./audio";
export * from "./input";

export async function init(parent?: HTMLElement) {
  Renderer.init(parent);
  Network.init();
  Input.init();
  Audio.init();
  await Default.createDefaultScene();
}
