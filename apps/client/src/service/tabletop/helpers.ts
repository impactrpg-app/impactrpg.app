import { Vector3 } from "./vector";
import { Entity } from "./scene";
import { ImageRendererModule, ObjectRenderer } from "./renderer";
import { BoxCollider, DynamicBodyModule, StaticBodyModule } from "./physics";
import { NetworkModule } from "./modules";

export async function createImage(
  url: string,
  enableNetworking = true
): Promise<Entity | null> {
  const camera = Entity.findWithTag("Camera");
  if (!camera) {
    console.error("Camera not found");
    return null;
  }
  const entity = new Entity("image");
  entity.position = new Vector3(camera.position.x, 0, camera.position.z);
  entity.rotation = Vector3.fromAngles(-90, 0, 0);
  const imageRenderer = await entity.addModule(new ImageRendererModule(url));
  await entity.addModule(
    new StaticBodyModule([
      new BoxCollider(
        new Vector3(
          (imageRenderer.width / 2) * 0.01,
          (imageRenderer.height / 2) * 0.01,
          0.1 * 0.01
        )
      ),
    ])
  );
  if (enableNetworking) {
    await entity.addModule(new NetworkModule());
  }
  return entity;
}
export async function createObject(
  url: string,
  enableNetworking = true
): Promise<Entity | null> {
  const camera = Entity.findWithTag("Camera");
  if (!camera) {
    console.error("Camera not found");
    return null;
  }
  const entity = new Entity("object");
  entity.position = new Vector3(camera.position.x, 1, camera.position.z);
  entity.rotation = Vector3.fromAngles(-90, 0, 0);
  const renderer = await entity.addModule(new ObjectRenderer(url));
  const { size } = renderer.getBoundingBox();
  await entity.addModule(
    new DynamicBodyModule([new BoxCollider(size.divide(2))])
  );
  if (enableNetworking) {
    await entity.addModule(new NetworkModule());
  }
  return entity;
}
