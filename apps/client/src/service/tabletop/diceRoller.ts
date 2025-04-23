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
async function rollADice(
  startingPosition: Vector3,
  forces: DiceForces
): Promise<Entity | null> {
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
    const rotation = dice.entity.rotation; // Assuming this is {x, y, z} Euler angles

    // Create a Quaternion from the dice's Euler rotation
    const q = new Three.Quaternion(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w
    );

    // Define face normals in the dice's LOCAL coordinate system
    // IMPORTANT: This mapping depends on how your dice model (dice.glb) is oriented.
    // Adjust the vectors if your model's faces correspond to different axes.
    // This assumes a standard d6 layout: 1 opposite 6, 2 opposite 5, 3 opposite 4
    // And assumes: +Y is 6, -Y is 1, +X is 3, -X is 4, +Z is 2, -Z is 5
    const faces = [
      { face: 6, normal: new Three.Vector3(0, 1, 0) }, // Local +Y
      { face: 4, normal: new Three.Vector3(0, -1, 0) }, // Local -Y
      { face: 5, normal: new Three.Vector3(1, 0, 0) }, // Local +X
      { face: 3, normal: new Three.Vector3(-1, 0, 0) }, // Local -X
      { face: 1, normal: new Three.Vector3(0, 0, 1) }, // Local +Z
      { face: 2, normal: new Three.Vector3(0, 0, -1) }, // Local -Z
    ];

    const worldUp = new Three.Vector3(0, 1, 0); // World's Up direction

    let topFace = 1; // Default guess
    let maxDot = -Infinity;

    for (const face of faces) {
      // Transform the local face normal vector to world space using the dice's rotation
      const worldNormal = face.normal.clone().applyQuaternion(q);

      // Calculate the dot product between the world-space face normal and the world's Up vector.
      // The face whose normal points most upwards (highest dot product) is the top face.
      const dot = worldNormal.dot(worldUp);

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
    const entity = await rollADice(prop.startingPosition, {
      force: prop.force,
      torque: prop.torque,
    });
    if (!entity) continue;
    diceRoll.push({
      ...prop,
      entity,
      startingPosition: prop.startingPosition,
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
