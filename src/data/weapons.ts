import { GoodsType } from "./goods";

export type Weapon = {
  name: string;
  description: string;
  attack?: number;
  armor?: number;
  size: GoodsType;
  keywords?: [string, string][];
};

export const weapons: Weapon[] = [
  {
    name: "Light Weapons",
    description:
      "Light weapons include shivs, knives, and daggers. They are small, easily concealed, and quick to use.",
    attack: 1,
    size: GoodsType.Small,
    keywords: [
      [
        "Dual Wield",
        "When holding two light weapons, you gain a bonus to your attack rolls.",
      ],
    ],
  },
  {
    name: "Medium Weapons",
    description:
      "Medium weapons include short swords, maces, and axes. These are versatile and effective in a variety of situations.",
    attack: 1,
    size: GoodsType.Small,
    keywords: [
      [
        "versatile",
        "When wielding this weapon with both hands, you gain a free success on every attack roll.",
      ],
    ],
  },
  {
    name: "Heavy Weapons",
    description:
      "Heavy weapons include battle axes, warhammers, and longswords. They are larger, slower, but powerful tools of combat.",
    attack: 2,
    size: GoodsType.Large,
  },
  {
    name: "Long Distance Weapons",
    description:
      "Long distance weapons offer a tactical advantage by allowing you to strike from afar. These include spears, staffs, and whips.",
    attack: 1,
    size: GoodsType.Small,
    keywords: [
      [
        "Distance",
        "While holding in both hands, you gain a bonus to defense rolls.",
      ],
    ],
  },
  {
    name: "Ranged Weapons",
    description:
      "Ranged weapons include bows and slingshots, providing the ability to attack from a distance. These weapons require two hands to use.",
    attack: 1,
    size: GoodsType.Large,
    keywords: [["Range", "These weapons can target enemies at a distance."]],
  },
  {
    name: "Small Magical Weapon",
    description:
      "Wands are small, magical implements designed to assist spellcasters in channeling mana. They are lightweight and ideal for quick use.",
    attack: 0,
    size: GoodsType.Small,
    keywords: [["Effect", "Allows you to re-roll 1 die when channeling mana."]],
  },
  {
    name: "Large Magical Weapon",
    description:
      "Staffs are larger magical tools, often used by more experienced casters to focus their power. They require two hands to wield effectively.",
    attack: 0,
    size: GoodsType.Large,
    keywords: [["Effect", "Grants 1 free success whenever you channel mana."]],
  },
  {
    name: "Automaton Weapons",
    description:
      "Automaton weapons are advanced, expertly crafted weapons that can be used by anyone. Crossbows and rifles are common examples of these weapons.",
    attack: 2,
    size: GoodsType.Large,
    keywords: [
      [
        "Power",
        "Enemies have -1 Armor when rolling for defense against this weapon.",
      ],
      ["Range", "These weapons can target enemies at a distance."],
      ["Mechanical", "Do not add your strength when doing an attack roll."],
    ],
  },
  {
    name: "Shields",
    description:
      "A shield can be used in place of a weapon for added protection, and can also serve as a weapon in close combat.",
    armor: 1,
    size: GoodsType.Small,
  },
];
