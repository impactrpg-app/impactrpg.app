export type Ability = {
  name: string;
  description: string;
};

export const abilities: Ability[] = [
  {
    name: "Strength",
    description:
      "Represents your character's physical power and endurance. It determines their ability to lift heavy objects and influences the effectiveness of physical attacks in combat.",
  },
  {
    name: "Agility",
    description:
      "Reflects your character's speed, reflexes, and coordination. It determines how quickly they can react to events and navigate their surroundings.",
  },
  {
    name: "Intelligence",
    description:
      "Measures your character's knowledge, problem-solving skills, and aptitude for magic",
  },
];
