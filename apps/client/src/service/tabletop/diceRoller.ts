import * as Three from "three";
import { createObject } from "./helpers";
import { DynamicBodyModule } from "./physics";
import { Entity } from "./scene";
import { Vector3 } from "./vector";
import { sendDiceRoll, sendNotification } from "./network";
import { DiceRollMessage } from "@impact/shared";
import * as Api from "../api";
import * as Audio from "./audio";

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export type DiceForces = {
  force: Vector3;
  torque: Vector3;
};
export function computeDiceForces(): DiceForces {
  const linearVelocity = new Vector3(
    randomRange(-1, 1),
    randomRange(-1, 1),
    randomRange(-1, 1)
  ).normalize();
  const angularVelocity = new Vector3(
    randomRange(-1, 1),
    randomRange(-1, 1),
    randomRange(-1, 1)
  ).normalize();
  const force = linearVelocity.multiply(randomRange(3, 5));
  const torque = angularVelocity.multiply(randomRange(10, 15));
  return {
    force,
    torque,
  };
}
const forcesTest = {
  force: new Vector3(0, 0, 1),
  torque: new Vector3(4, 2, 0),
}
async function rollADice(
  // startingPosition: Vector3,
  // forces: DiceForces
): Promise<Entity | null> {
  const startingPosition = new Vector3(0, 3, 0);
  const forces = forcesTest;

  const dice = await createObject("/dice.glb", false);
  if (!dice) return null;
  dice.isInteractable = false;
  dice.position = startingPosition;
  const body = dice.getModule<DynamicBodyModule>("Module::Physics");
  if (!body) return null;
  body.setLinearVelocity(forces.force);
  body.setAngularVelocity(forces.torque);
  return dice;
}
export type DiceRoll = DiceForces & {
  entity: Entity;
  startingPosition: Vector3;
};
export async function rollDice(amount: number): Promise<DiceRoll[]> {
  const camera = Entity.findWithTag("Camera");
  if (!camera) {
    console.error("Camera not found");
    return [];
  }

  Audio.play("/dice-roll.mp3");

  const forces: DiceRoll[] = [];
  for (let i = 0; i < amount; i++) {
    const startingPosition = camera.position.clone();
    startingPosition.x += i * 2 - (amount * 2) / 2;
    startingPosition.y = 5;

    const force = computeDiceForces();
    const entity = await rollADice(startingPosition, force);
    if (!entity) continue;
    forces.push({
      ...force,
      entity,
      startingPosition,
    });
  }
  return forces;
}
function waitForSecond(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
export async function getDiceResults(diceRolls: DiceRoll[]) {
  for (const dice of diceRolls) {
    const body = dice.entity.getModule<DynamicBodyModule>("Module::Physics");
    if (!body) continue;
    let velocity = body.getLinearVelocity().add(body.getAngularVelocity());
    while (velocity.length() > 0.1) {
      await waitForSecond(0.1);
      velocity = body.getLinearVelocity().add(body.getAngularVelocity());
    }
  }
  const results: number[] = [];
  for (const dice of diceRolls) {
    // use rotation to figure out up face
    const rotation = dice.entity.rotation;
    const upVector = new Vector3(0, 1, 0);

    const q = new Three.Quaternion().setFromEuler(
      new Three.Euler(rotation.x, rotation.y, rotation.z)
    );

    // Apply the quaternion to the up vector
    const transformedUp = new Vector3(
      upVector.x * (1 - 2 * (q.y * q.y + q.z * q.z)) +
        upVector.y * (2 * (q.x * q.y - q.w * q.z)) +
        upVector.z * (2 * (q.x * q.z + q.w * q.y)),
      upVector.x * (2 * (q.x * q.y + q.w * q.z)) +
        upVector.y * (1 - 2 * (q.x * q.x + q.z * q.z)) +
        upVector.z * (2 * (q.y * q.z - q.w * q.x)),
      upVector.x * (2 * (q.x * q.z - q.w * q.y)) +
        upVector.y * (2 * (q.y * q.z + q.w * q.x)) +
        upVector.z * (1 - 2 * (q.x * q.x + q.y * q.y))
    );

    const faces = [
      { face: 6, vector: new Vector3(0, 1, 0) },
      { face: 5, vector: new Vector3(-1, 0, 0) },
      { face: 4, vector: new Vector3(0, -1, 0) },
      { face: 3, vector: new Vector3(1, 0, 0) },
      { face: 2, vector: new Vector3(0, 0, 1) },
      { face: 1, vector: new Vector3(0, 0, -1) },
    ];

    let topFace = 1;
    let maxDot = -Infinity;

    for (const face of faces) {
      const dot = transformedUp.dot(face.vector);
      if (dot > maxDot) {
        maxDot = dot;
        topFace = face.face;
      }
    }

    results.push(topFace);
  }
  return results;
}
export async function clearDice(diceRolls: DiceRoll[], delayInSeconds = 2) {
  await waitForSecond(delayInSeconds);
  for (const dice of diceRolls) {
    dice.entity.destroy();
  }
}

export type DiceRollProps = DiceForces & { startingPosition: Vector3 };
export async function rollDiceWithProps(
  props: DiceRollProps[]
): Promise<DiceRoll[]> {
  Audio.play("/dice-roll.mp3");
  const diceRoll: DiceRoll[] = [];
  for (const prop of props) {
    const startingPosition = prop.startingPosition.clone();
    const force = computeDiceForces();
    const entity = await rollADice(startingPosition, force);
    if (!entity) continue;
    diceRoll.push({
      ...force,
      entity,
      startingPosition,
    });
  }
  return diceRoll;
}

export async function rollNetworkDice(amount: number) {
  const diceRolls = await rollDice(amount);
  sendDiceRoll(
    new DiceRollMessage(
      diceRolls.map((roll) => ({
        force: roll.force.toObject(),
        torque: roll.torque.toObject(),
        startingPosition: roll.startingPosition.toObject(),
      }))
    )
  );

  const results = await getDiceResults(diceRolls);
  await clearDice(diceRolls);
  const normal = results.filter(
    (result) => result === 4 || result === 5
  ).length;
  const crits = results.filter((result) => result === 6).length;
  const successes = normal + crits * 2;

  let displayName = "";
  const userClaims = await Api.getUserClaims();
  if (userClaims) {
    displayName = userClaims.displayName;
  }

  sendNotification(
    `${displayName} Rolled ${results.length} dice and got [${results.join(", ")}] = ${successes}`
  );
  if (crits > 0) {
    sendNotification(`${displayName} earned a progression point`);
  }
}
