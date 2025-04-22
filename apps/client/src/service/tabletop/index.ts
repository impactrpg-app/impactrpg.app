import "./input";
import * as Default from "./defaultScene";
import * as Network from "./network";
import * as Input from "./input";
import * as Renderer from "./renderer";

export * from "./scene";
export * from "./renderer";
export * from "./physics";
export * from "./modules";
export * from "./network";
export * from "./defaultScene";
export * from "./helpers";
export * from "./diceRoller";
export * from './audio';

export async function init(parent?: HTMLElement) {
  if (window.localStorage.getItem("DEBUGGER") === "true") {
    Default.enableDebugger();
  }

  Renderer.init(parent);
  Network.init();
  Input.init();
  await Default.createDefaultScene();
}
