import { App, ref } from "vue";
import * as Tray from "./tray";

const numberOfDice = ref(0);

export const DiceRoller = {
  install(app: App) {
    Tray.init({
      container: "#canvas-container",
      id: "tray-canvas",
    });
  },
};

export const useDiceRoller = () => {
  return {
    roll() {
      Tray.clear();
      const forces = Tray.createRollForces(5);
      Tray.roll(forces);
    },
  };
};
