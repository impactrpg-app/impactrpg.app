import { BoxCollider, PhysicsBody } from "./physics";
import { BoxModule, ImageModule, loadImage, RendererModule } from "./renderer";
import { Entity, scene, Vector3 } from "./scene";
import * as Three from "three";

export async function init() {
  const image = new Entity("Image");
  const imageUrl =
    "https://api.dev.impactrpg.app/image/67df255f73a91ebf12529b62%2Fdbe20305-1e44-435a-841b-2185d7eee686";
  image.addModule(new ImageModule(imageUrl));
  image.position = new Three.Vector3(0, 0, 0);
  image.rotation = new Three.Vector3(-Math.PI / 2, 0, 0);
  image.scale = new Three.Vector3(0.01, 0.01, 0.01);

  const dice = new Entity("dice");
  dice.position = new Vector3(0, 2, 0);
  dice.addModule(new BoxModule(1, 1, 1));
  dice.addModule(new PhysicsBody([new BoxCollider(1, 1, 1)]));
}
