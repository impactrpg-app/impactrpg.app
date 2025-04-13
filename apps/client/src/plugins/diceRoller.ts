import { App, inject, ref } from "vue";
// @ts-ignore dice-box does not support typescript
import DiceBox from "@3d-dice/dice-box";
import { $dt } from "@primeuix/themes";

const numberOfDice = ref(0);
export type DiceBox = {
  roll: (notation: string) => Promise<void>;
};
export type DiceRollerResult = {
  value: number;
};

export const DiceRoller = {
  install(app: App) {
    let diceBoxInstance = new DiceBox({
      assetPath: "/assets/",
      theme: "theme-rock",
      themeColor: $dt("stone.600").value,
      id: "dicebox",
      container: "#dicebox-container",
      scale: 6,
      linearDamping: 0.3,
      spinForce: 2,
      throwForce: 15,
      restitution: 0.3,
      lightIntensity: 0.8,
    }).init();
    app.provide("diceRoller", diceBoxInstance);
    diceBoxInstance.then((value: DiceBox) => {
      console.log("DiceBox initialized");
    });
  },
};

export const useDiceRoller = () => {
  const diceBox = inject<Promise<DiceBox>>("diceRoller");
  return {
    getNumberOfDice() {
      return numberOfDice.value;
    },
    setNumberOfDice(value: number) {
      numberOfDice.value = value;
    },
    rollDice() {
      return new Promise<DiceRollerResult[]>((resolve, reject) => {
        if (!diceBox) {
          console.error("DiceBox not initialized");
          return reject();
        }
        diceBox.then((value: DiceBox) => {
          value
            .roll(`${numberOfDice.value}d6`)
            .then((result: DiceRollerResult[]) => {
              resolve(result as DiceRollerResult[]);
            })
            .catch((error: any) => {
              console.error("Error rolling dice:", error);
              reject(error);
            });
          numberOfDice.value = 0;
        });
      });
    },
    clear() {
      if (!diceBox) {
        console.error("DiceBox not initialized");
        return;
      }
      diceBox.then((value: DiceBox) => {
        value.clear();
      });
    },
  };
};
