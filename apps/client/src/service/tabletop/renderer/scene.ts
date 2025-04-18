import * as Three from "three";

const ambientLight = new Three.AmbientLight(0xffffff, 0.2);
export const threeScene = new Three.Scene();
threeScene.add(ambientLight);
