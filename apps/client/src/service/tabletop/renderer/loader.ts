import * as Three from "three";

const loader = new Three.LoadingManager();

export async function loadImage(url: string): Promise<Three.Texture> {
  if (!url) {
    return Promise.reject(new Error("URL is empty"));
  }
  return new Promise((resolve, reject) => {
    new Three.TextureLoader(loader).load(
      url,
      (texture) => {
        texture.colorSpace = Three.SRGBColorSpace;
        resolve(texture);
      },
      (progress) => {
        console.log("Loading texture", progress);
      },
      (error) => {
        console.error("Error loading texture", error);
        reject(error);
      }
    );
  });
}
