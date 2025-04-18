import * as Three from "three";
import { RENDERER_MODULE } from "./module";
import { getAllComponentsOfType } from "../scene";
import { threeScene, camera } from "./scene";

function animate() {
  const rendererModules =
    getAllComponentsOfType<Three.Object3D>(RENDERER_MODULE);
  for (const module of rendererModules) {
    const entity = module.entity;
    const { position, rotation, scale } = entity;
    module.data.position.set(position.x, position.y, position.z);
    module.data.rotation.set(rotation.x, rotation.y, rotation.z);
    module.data.scale.set(scale.x, scale.y, scale.z);
  }
  renderer.render(threeScene, camera);
}

export const renderer = new Three.WebGLRenderer({
  antialias: true,
});
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = Three.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.domElement.id = "tabletop";
document.body.appendChild(renderer.domElement);
renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
