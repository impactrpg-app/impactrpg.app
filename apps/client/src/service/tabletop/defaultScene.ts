import { CameraControllsModule, DebuggerModule, MoveTool } from "./modules";
import { BoxCollider, StaticBodyModule } from "./physics";
import { CameraModule, CameraType } from "./renderer";
import { LightModule, LightType } from "./renderer/modules/light";
import { Entity } from "./scene";
import { Vector3, Vector4 } from "./vector";

export async function createDefaultScene() {
  // camera
  const camera = new Entity("Camera");
  camera.tags.push("Camera");
  camera.position = new Vector3(0, 5, 0);
  camera.rotation = Vector4.fromEulerAngles(-85, 0, 0);
  await camera.addModule(new CameraModule(CameraType.Perspective));
  await camera.addModule(new CameraControllsModule());
  await camera.addModule(new MoveTool());

  // directional light
  const directionalLight = new Entity("DirectionalLight");
  directionalLight.rotation = Vector4.fromEulerAngles(45, 30, 0);
  await directionalLight.addModule(new LightModule(LightType.Directional));

  const ambientLight = new Entity("AmbientLight");
  await ambientLight.addModule(new LightModule(LightType.Ambient));

  // ground
  const ground = new Entity("Ground");
  ground.position = new Vector3(0, -0.5, 0);
  await ground.addModule(
    new StaticBodyModule([new BoxCollider(new Vector3(1000, 0.01, 1000))])
  );
  ground.isInteractable = false;

  if (window.localStorage.getItem("DEBUGGER") === "true") {
    console.log("Creating default scene with debugger enabled");
    new Entity("Debugger").addModule(new DebuggerModule());
  }
}
