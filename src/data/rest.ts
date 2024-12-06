export type RestAction = {
  name: string;
  description: string[];
};

export const restActions: RestAction[] = [
  {
    name: "Sleeping",
    description: [
      "Restore your energy by sleeping. Gain all of your endurance and heal 1 wound.",
    ],
  },
  {
    name: "Treat an Injury",
    description: ["Spend time tending to injuries. Remove 1 injury you have."],
  },
  {
    name: "Cook a Meal",
    description: [
      "Prepare a meal for the group. Everyone gains +3 endurance, even if they are already at maximum endurance.",
    ],
  },
  {
    name: "Tell a Story",
    description: [
      "Remove all corruption from yourself.",
      "Choose one party member to gain 1 corruption; If you are insane they gain 2 corruption instead.",
    ],
  },
  {
    name: "Craft an Item",
    description: [
      "Spend time creating a useful tool or item. See the Crafting section for more details.",
    ],
  },
  {
    name: "Train",
    description: [
      "Roll a single dice. For each success, gain a progression point.",
    ],
  },
];

export type RestEvent = {
  name: string;
  description: string[];
};

export const restEvents: RestEvent[] = [
  {
    name: "Interrupted",
    description: [
      "All resting actions are canceled. You gain no benefits from this rest.",
    ],
  },
  {
    name: "Nightmares",
    description: ["No one can sleep and gain no benifts from sleeping."],
  },
  {
    name: "Infection",
    description: ["No injuries can be healed."],
  },
  {
    name: "Rotten",
    description: ["Cooking food gains no benift."],
  },
  {
    name: "Dispair",
    description: ["No one can share their story."],
  },
  {
    name: "Forgotten",
    description: ["You cannot use skills during rest or craft items."],
  },
];
