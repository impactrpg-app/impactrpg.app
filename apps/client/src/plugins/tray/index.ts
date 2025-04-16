import { createD6, Vector3 } from "./helpers";
import { renderer } from "./three";
export { clear } from "./helpers";

export type TrayOptions = {
  container?: string;
  id?: string;
};

export function init(options: TrayOptions = {}): void {
  // setup parent
  let parent = document.body;
  if (options.container) {
    const container = document.querySelector(options.container);
    if (container) parent = container as HTMLElement;
  }
  renderer.domElement.id = options.id || "tray-canvas";
  parent.appendChild(renderer.domElement);
}

function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export type RollForces = { velocity: Vector3; angularVelocity: Vector3 };

export function createRollForces(amount: number = 1): RollForces[] {
  if (amount < 1) {
    throw new Error("amount must be equal or greater than 1");
  }
  const val: RollForces[] = [];
  for (let i = 0; i < amount; i++) {
    const velocity = {
      x: randomNumber(-3, 3),
      y: 0.0,
      z: randomNumber(-3, 3),
    };
    const angularVelocity = {
      x: randomNumber(-3, 3),
      y: randomNumber(-3, 3),
      z: randomNumber(-3, 3),
    };
    val.push({ velocity, angularVelocity });
  }
  return val;
}

function waitForSecond(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000 * seconds);
  });
}

export async function roll(forces: RollForces[]): Promise<number[]> {
  const halfForcesLength = forces.length / 2;

  const d6s: ReturnType<typeof createD6>[] = [];

  for (let i = 0; i < forces.length; i++) {
    const position = {
      x: (i - halfForcesLength) / 0.5,
      y: 2 + i,
      z: 0,
    };
    const rotation = {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    };
    const scale = 0.5;

    const d6 = createD6(
      position,
      rotation,
      scale,
      forces[i]?.velocity,
      forces[i]?.angularVelocity
    );
    d6s.push(d6);
  }

  let diceRollFinished = false;
  while (!diceRollFinished) {
    const oldPos: Vector3[] = [];
    for (const d6 of d6s) {
      const pos = d6.mesh.position;
      oldPos.push({ x: pos.x, y: pos.y, z: pos.z });
    }
    await waitForSecond(1);
    diceRollFinished = true;
    for (let i = 0; i < d6s.length; i++) {
      const pos = d6s[i]!.mesh.position;
      if (
        oldPos[i]!.x !== pos.x ||
        oldPos[i]!.y !== pos.y ||
        oldPos[i]!.z !== pos.z
      ) {
        diceRollFinished = false;
        break;
      }
    }
  }

  const results: number[] = [];
  for (const d6 of d6s) {
    console.log(d6.mesh.up);
    break;
  }
  return results;
}
