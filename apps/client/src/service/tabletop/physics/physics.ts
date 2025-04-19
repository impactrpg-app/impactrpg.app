import { scene } from "../scene";
import { world } from "./world";

function physicsLoop() {
  world.step();
  for (const entity of scene.values()) {
    for (const module of Object.values(entity.modules)) {
      module.physicsUpdate();
    }
  }
  setTimeout(physicsLoop, 16);
}
physicsLoop();
