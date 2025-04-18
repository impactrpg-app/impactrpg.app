import { CameraControllsModule } from "./modules/cameraControlls";
import { BoxCollider, PhysicsBodyModule } from "./physics";
import {
  BoxRendererModule,
  CameraModule,
  ImageRendererModule,
} from "./renderer";
import { Entity } from "./scene";
import { Vector3 } from "./vector";

export async function init() {
  const camera = new Entity("Camera");
  camera.position = new Vector3(0, 5, 0);
  camera.rotation = new Vector3(-Math.PI / 2, 0, 0);
  camera.addModule(
    new CameraModule(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  );
  camera.addModule(new CameraControllsModule());

  const image = new Entity("Image");
  const imageUrl =
    "https://api.dev.impactrpg.app/image/67df255f73a91ebf12529b62%2Fdbe20305-1e44-435a-841b-2185d7eee686";
  image.addModule(new ImageRendererModule(imageUrl));
  image.position = new Vector3(0, 0, 0);
  image.rotation = new Vector3(-Math.PI / 2, 0, 0);
  image.scale = new Vector3(0.01, 0.01, 0.01);

  const dice = new Entity("dice");
  dice.position = new Vector3(0, 2, 0);
  dice.addModule(new BoxRendererModule(1, 1, 1));
  dice.addModule(
    new PhysicsBodyModule([new BoxCollider(Vector3.zero(), Vector3.one())])
  );
}
