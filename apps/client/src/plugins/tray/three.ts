import * as Three from "three";
import { scene as worldScene } from "./scene";
import { camera as TabletopCamera } from "../../service/tabletop_old";

export const scene = new Three.Scene();

// setup lights
const light = new Three.DirectionalLight(new Three.Color(1, 1, 1));
light.setRotationFromEuler(new Three.Euler(45, 0, 45));
scene.add(light);
const ambient = new Three.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

export const renderer = new Three.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x000000, 0);
export function animate(_time: number) {
  for (const obj of worldScene) {
    const pos = obj.rigidbody.translation();
    const rot = obj.rigidbody.rotation();

    obj.mesh.position.x = pos.x;
    obj.mesh.position.y = pos.y;
    obj.mesh.position.z = pos.z;
    obj.mesh.setRotationFromQuaternion(
      new Three.Quaternion(rot.x, rot.y, rot.z, rot.w)
    );
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
renderer.toneMapping = Three.ACESFilmicToneMapping;

// setup three camera
export let camera = new Three.PerspectiveCamera(70, 0.5, 0.1, 100);
function setupCamera() {
  const width = renderer.domElement.clientWidth;
  const height = renderer.domElement.clientHeight;
  renderer.setSize(width, height);
  const aspectRatio = width / height;
  camera = new Three.PerspectiveCamera(70, aspectRatio, 0.1, 20);
  camera.position.set(0, 5, 0);
  camera.rotateX(-Math.PI / 2);
}
window.addEventListener("resize", setupCamera);
function camreaUpdate() {
  const { position, zoom } = TabletopCamera.value;
  camera.position.x = -position.x * 0.01;
  camera.position.y = 5.0 / zoom;
  camera.position.z = -position.y * 0.01;
}
window.addEventListener("wheel", camreaUpdate);
window.addEventListener("mousemove", camreaUpdate);
setTimeout(setupCamera, 1);
