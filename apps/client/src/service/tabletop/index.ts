import { CameraControllsModule } from "./modules/cameraControlls";
import { BoxCollider, PhysicsBodyModule, StaticBodyModule } from "./physics";
import {
  BoxRendererModule,
  PerspectiveCameraModule,
  ImageRendererModule,
  DirectionalLightModule,
  AmbientLightModule,
} from "./renderer";
import { clearScene, Entity, scene } from "./scene";
import { Vector3 } from "./vector";

export async function init() {
  clearScene();

  window.addEventListener("click", (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    console.log(x, y);
    const entities = [...scene.values()];
    for (const entity of entities) {
    }
  });

  // camera
  const camera = new Entity("Camera");
  camera.position = new Vector3(0, 5, 0);
  camera.rotation = new Vector3(-Math.PI / 2, 0, 0);
  camera.addModule(
    new PerspectiveCameraModule(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  camera.addModule(new CameraControllsModule());

  // directional light
  const light = new Entity("Light");
  light.rotation = Vector3.fromAngles(45, 30, 0);
  const directionalLight = await light.addModule(new DirectionalLightModule());
  directionalLight.intensity = 2;
  light.addModule(new AmbientLightModule());

  // ground
  const ground = new Entity("Ground");
  ground.addModule(
    new StaticBodyModule(
      new BoxCollider(Vector3.zero(), new Vector3(1000, 0.01, 1000))
    )
  );

  // image
  const image = new Entity("Image");
  const imageUrl =
    "https://api.dev.impactrpg.app/image/67df255f73a91ebf12529b62%2Fdbe20305-1e44-435a-841b-2185d7eee686";
  const imageRenderer = await image.addModule(
    new ImageRendererModule(imageUrl)
  );
  image.position = new Vector3(0, 2, 0);
  image.rotation = Vector3.fromAngles(-90, 0, 0);
  image.scale = new Vector3(0.01, 0.01, 0.01);
  const tex = imageRenderer.texture!.image;
  image.addModule(
    new PhysicsBodyModule([
      new BoxCollider(
        Vector3.zero(),
        new Vector3(tex.width / 2, tex.height / 2, 0.01)
      ),
    ])
  );

  // dice
  const dice = new Entity("Dice");
  dice.position = new Vector3(0, 2, 0);
  dice.addModule(new BoxRendererModule(1, 1, 1));
  dice.addModule(
    new PhysicsBodyModule([new BoxCollider(Vector3.zero(), Vector3.half())])
  );
}
