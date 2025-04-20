import * as Three from "three";
import { scene } from "../scene";
import { threeScene } from "./scene";

function animate() {
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.update();
    }
  }
}

let renderer: Three.WebGLRenderer;
export function init(parent?: HTMLElement) {
  renderer = new Three.WebGLRenderer({
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
  if (!parent) parent = document.body;
  parent.appendChild(renderer.domElement);
  renderer.setAnimationLoop(animate);
}
export function setRendererSize(width: number, height: number) {
  renderer.setSize(width, height);
}
export function renderCamera(camera: Three.Camera) {
  renderer.render(threeScene, camera);
}
