import * as Three from "three";
import { CAMERA_MODULE, RENDERER_MODULE } from "./module";
import { getAllComponentsOfType } from "../scene";
import { threeScene } from "./scene";

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
  const cameraModules = getAllComponentsOfType<Three.Camera>(CAMERA_MODULE);
  for (const module of cameraModules) {
    module.data.position.set(
      module.entity.position.x,
      module.entity.position.y,
      module.entity.position.z
    );
    module.data.setRotationFromEuler(
      new Three.Euler(
        module.entity.rotation.x,
        module.entity.rotation.y,
        module.entity.rotation.z
      )
    );
    renderer.render(threeScene, module.data);
  }
}

export const renderer = new Three.WebGLRenderer({
  antialias: true,
});
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = Three.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = Three.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.domElement.id = "tabletop";
document.body.appendChild(renderer.domElement);
renderer.setAnimationLoop(animate);
