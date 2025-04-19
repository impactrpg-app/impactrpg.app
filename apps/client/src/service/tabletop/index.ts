import { CameraControllsModule } from "./modules/cameraControlls";
import { BoxCollider, StaticBodyModule } from "./physics";
import { CameraModule, CameraType } from "./renderer";
import { Entity } from "./scene";
import { Vector3 } from "./vector";
import { LightModule, LightType } from "./renderer/modules/light";
import { MoveTool } from "./modules/tools";
import { DebuggerModule } from "./modules/debugger";
import "./input";

export * from "./scene";
export * from "./renderer";
export * from "./physics";
export * from "./modules";

export async function init() {
  // camera
  const camera = new Entity("Camera");
  camera.tags.push("Camera");
  camera.position = new Vector3(0, 5, 0);
  camera.rotation = Vector3.fromAngles(-85, 0, 0);
  await camera.addModule(new CameraModule(CameraType.Perspective));
  await camera.addModule(new CameraControllsModule());
  await camera.addModule(new MoveTool());

  // directional light
  const directionalLight = new Entity("DirectionalLight");
  directionalLight.rotation = Vector3.fromAngles(45, 30, 0);
  await directionalLight.addModule(new LightModule(LightType.Directional));

  const ambientLight = new Entity("AmbientLight");
  await ambientLight.addModule(new LightModule(LightType.Ambient));

  // ground
  const ground = new Entity("Ground");
  await ground.addModule(
    new StaticBodyModule([new BoxCollider(new Vector3(1000, 0.01, 1000))])
  );
  ground.isInteractable = false;

  new Entity("Debugger").addModule(new DebuggerModule());
}
