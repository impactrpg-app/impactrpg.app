import "./input";
import { createDefaultScene } from "./defaultScene";

export * from "./scene";
export * from "./renderer";
export * from "./physics";
export * from "./modules";
export * from "./network";
export * from "./defaultScene";

export async function init() {
  await createDefaultScene();
}
