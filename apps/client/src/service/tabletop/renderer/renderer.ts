import * as Three from "three";
import { CAMERA_MODULE, DIRECTIONAL_LIGHT_MODULE, RENDERER_MODULE } from "./module";
import { getAllComponentsOfType, Module } from "../scene";
import { threeScene } from "./scene";

function updateObjectTransforms(modules: Module<Three.Object3D>[]) {
  const objs = new Set<string>();
  for (const module of modules) {
    const entity = module.entity;
    objs.add(module.data.uuid);
    const { position, rotation, scale } = entity;
    module.data.position.set(position.x, position.y, position.z);
    module.data.rotation.set(rotation.x, rotation.y, rotation.z);
    module.data.scale.set(scale.x, scale.y, scale.z);
  }
}

function updateDirectionalLights(mdoule: Module<Three.DirectionalLight>[]) {
  for (const module of mdoule) {
    const entity = module.entity;
    const { position, rotation } = entity;
    const pitch = module.entity.rotation.x;
    const yaw = module.entity.rotation.y;
    const x = Math.cos(pitch) * Math.sin(yaw);
    const y = Math.sin(pitch);
    const z = Math.cos(pitch) * Math.cos(yaw);
    module.data.position.set(x, y, z);
  }
}

function animate() {
  updateObjectTransforms(
    getAllComponentsOfType<Three.Object3D>([RENDERER_MODULE])
  );
  updateDirectionalLights(
    getAllComponentsOfType<Three.DirectionalLight>([DIRECTIONAL_LIGHT_MODULE])
  );
  const cameraModules = getAllComponentsOfType<Three.Camera>([CAMERA_MODULE]);
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
renderer.shadowMap.autoUpdate = true;
renderer.shadowMap.type = Three.PCFSoftShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.domElement.id = "tabletop";
document.body.appendChild(renderer.domElement);
renderer.setAnimationLoop(animate);
