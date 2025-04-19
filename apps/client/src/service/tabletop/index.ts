import { CameraControllsModule } from "./modules/cameraControlls";
import { BoxCollider, DynamicBodyModule, StaticBodyModule } from "./physics";
import {
  BoxRendererModule,
  CameraModule,
  CameraType,
  ImageRendererModule,
} from "./renderer";
import { clearScene, Entity } from "./scene";
import { Vector3 } from "./vector";
import { LightModule, LightType } from "./renderer/modules/light";
import { DebuggerModule } from "./modules/debugger";

export async function init() {
  clearScene();

  // camera
  const camera = new Entity("Camera");
  camera.position = new Vector3(0, 5, 0);
  camera.rotation = new Vector3(-Math.PI / 2, 0, 0);
  camera.addModule(new CameraModule(CameraType.Perspective));
  camera.addModule(new CameraControllsModule());

  // directional light
  const directionalLight = new Entity("DirectionalLight");
  directionalLight.rotation = Vector3.fromAngles(45, 30, 0);
  directionalLight.addModule(new LightModule(LightType.Directional));

  const ambientLight = new Entity("AmbientLight");
  ambientLight.addModule(new LightModule(LightType.Ambient));

  // ground
  const ground = new Entity("Ground");
  ground.addModule(
    new StaticBodyModule([new BoxCollider(new Vector3(1000, 0.01, 1000))])
  );
  ground.isInteractable = false;

  // image
  const image = new Entity("Image");
  const imageUrl =
    "https://api.dev.impactrpg.app/image/67df255f73a91ebf12529b62%2Fdbe20305-1e44-435a-841b-2185d7eee686";
  const imageRenderer = await image.addModule(
    new ImageRendererModule(imageUrl)
  );
  image.position = new Vector3(0, 0, 0);
  image.rotation = Vector3.fromAngles(-90, 0, 0);
  image.scale = new Vector3(0.01, 0.01, 0.01);
  const tex = imageRenderer.texture!.image;
  image.addModule(
    new DynamicBodyModule([
      new BoxCollider(new Vector3(tex.width / 2, tex.height / 2, 0.01)),
    ])
  );

  // dice
  const dice = new Entity("Dice");
  dice.position = new Vector3(0, 2, 0);
  dice.addModule(new BoxRendererModule(new Vector3(1, 1, 1)));
  dice.addModule(new DynamicBodyModule([new BoxCollider(Vector3.half())]));

  // const debug = new Entity("Debugger");
  // debug.addModule(new DebuggerModule());
}
