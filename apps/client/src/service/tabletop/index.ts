import "./input";
import * as Default from "./defaultScene";
import * as Network from "./network";
import * as Input from "./input";

export * from "./scene";
export * from "./renderer";
export * from "./physics";
export * from "./modules";
export * from "./network";
export * from "./defaultScene";

export async function init(enableDebugger: boolean = false) {
  if (enableDebugger) {
    Default.enableDebugger();
  }

  Network.init();
  Input.init();
  await Default.createDefaultScene();
}
