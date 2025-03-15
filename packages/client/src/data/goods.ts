export enum GoodsType {
  Small = "small",
  Large = "large",
}

export type Good = {
  name: string;
  size: GoodsType;
  description: string[];
};

export const goods: Good[] = [
  {
    name: "Torch",
    size: GoodsType.Small,
    description: [
      "Torches must be held in hand to function as a light source. If not held, they remain unlit.",
      "You can attack or throw a torch. If you wound someone with a torch they gain an additional wound.",
    ],
  },
  {
    name: "Lantern",
    size: GoodsType.Small,
    description: [
      "Lanterns cannot be used to attack but can be attached to your body to illuminate the area around you.",
    ],
  },
  {
    name: "Healing Balm",
    size: GoodsType.Small,
    description: ["Heal 1 wound without requiring a check."],
  },
  {
    name: "Camp Supplies",
    size: GoodsType.Large,
    description: [
      "Consumed to cook in situations where these actions would normally be impossible.",
    ],
  },
  {
    name: "Skinning Knife",
    size: GoodsType.Small,
    description: ["Grant's a bonus to cooking"],
  },
  {
    name: "Poison Bottle",
    size: GoodsType.Small,
    description: ["Applies Poison to the target"],
  },
  {
    name: "Antidote",
    size: GoodsType.Small,
    description: ["Grants immunity to poison until you rest."],
  },
  {
    name: "Cloak",
    size: GoodsType.Small,
    description: ["Grant's a bonus to stealth checks"],
  },
  {
    name: "Pouch of Coins",
    size: GoodsType.Small,
    description: [],
  },
  {
    name: "Backpack",
    size: GoodsType.Large,
    description: [
      "Does not take space in your gear",
      "Allows you to carry 2 additional large goods",
    ],
  },
];
