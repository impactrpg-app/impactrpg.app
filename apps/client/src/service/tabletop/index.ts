import "./input";
import * as Default from "./defaultScene";

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

  await Default.createDefaultScene();
}
