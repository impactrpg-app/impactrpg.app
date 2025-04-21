import * as Three from "three";
import { GLTF, GLTFLoader } from "three/addons";

const loader = new Three.LoadingManager();

export async function loadImage(url: string): Promise<Three.Texture> {
  if (!url) {
    return Promise.reject(new Error("URL is empty"));
  }
  const result = new Three.TextureLoader(loader).loadAsync(url);
  return result;
}
export async function loadGltf(url: string): Promise<GLTF> {
  const result = await new GLTFLoader(loader).loadAsync(url);
  return result;
}
