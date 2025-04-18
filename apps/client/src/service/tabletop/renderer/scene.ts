import * as Three from "three";

const directionalLight = new Three.DirectionalLight(new Three.Color(1, 1, 1));
directionalLight.setRotationFromEuler(new Three.Euler(45, 0, 45));

const ambientLight = new Three.AmbientLight(0xffffff, 0.3);

export const threeScene = new Three.Scene();
threeScene.add(directionalLight);
threeScene.add(ambientLight);
