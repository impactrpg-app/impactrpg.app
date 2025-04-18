import * as Three from "three";

const directionalLight = new Three.DirectionalLight(new Three.Color(1, 1, 1));
directionalLight.setRotationFromEuler(new Three.Euler(45, 0, 45));
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.bias = -0.001;

const ambientLight = new Three.AmbientLight(0xffffff, 0.3);

export const threeScene = new Three.Scene();
threeScene.add(directionalLight);
threeScene.add(ambientLight);
