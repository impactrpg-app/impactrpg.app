export type Material = {
  name: string;
  description: string;
};

export const materials: Material[] = [
  {
    name: "Iron Bar",
    description: "2 Light Weapons, 1 Medium Weapon, or 1 Heavy Weapon.",
  },
  {
    name: "Animal Skin",
    description: "Light Armor",
  },
  {
    name: "Sheet of Metal",
    description: "Heavy Armor or a Shield",
  },
  {
    name: "Block of Wood",
    description: "Automaton Weapon or a Shield",
  },
  {
    name: "Runestone",
    description: "Magical Weapon",
  },
];

export type MaterialProperty = {
  name: string;
  description: string;
};

export const materialProperties: MaterialProperty[] = [
  {
    name: "Sharp",
    description: "After rolling, set 1 die to a value of 4.",
  },
  {
    name: "Tough",
    description: "After rolling, Increase the value of 1 die by 1.",
  },
  {
    name: "Balanced",
    description: "After rolling, re-roll 1 die.",
  },
  {
    name: "Shinny",
    description:
      "When using the equipment you get 1 extra success to any roll you make.",
  }, 
];

export type CraftingTarget = {
  name: string;
  value: number;
};

export const craftingTargets: CraftingTarget[] = [
  { name: "Simple Items", value: 6 },
  { name: "Standard gear", value: 10 },
  { name: "Advanced gear", value: 14 },
  { name: "Exceptional gear", value: 16 },
];
