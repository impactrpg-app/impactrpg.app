export type Skill = {
  name: string;
  description: string[];
};

export const skills: Skill[] = [
  {
    name: "Parry",
    description: [
      "If your defense roll exceeds an attacker's roll, you may spend 1 Endurance to inflict 1 wound on the attacker.",
    ],
  },
  {
    name: "Cover",
    description: ["When attacked spend 1 endurance to cancel a wound."],
  },
  {
    name: "Battle Rage",
    description: ["When wounded, gain a bonus to your next attack."],
  },
  {
    name: "Brute Strength",
    description: [
      "When you kill an enemy. You may spend 1 endurance to wound another nearby enemy.",
    ],
  },
  {
    name: "Battle Stance",
    description: [
      "Choose a battle stance or declare no stance",
      "Offensive Stance - You have bonus on attack rolls",
      "Defensive Stance - You have bonus on defense rolls",
    ],
  },
  {
    name: "Understanding",
    description: [
      "You may understand animals' intentions but you cannot speak to them.",
    ],
  },
  {
    name: "Expertise",
    description: [
      "Choose a weapon type after getting this feat. You have a bonus when attacking with that weapon.",
    ],
  },
  {
    name: "Unseen Threat",
    description: [
      "If you attack an enemy before their first turn in combat you gain a bonus to your attack.",
    ],
  },
  {
    name: "Side Step",
    description: ["Spend 1 endurance to gain 2 bonus on your defense roll"],
  },
  {
    name: "Heart Song",
    description: [
      "When resting you may sing a song instead of telling a story. If you do, then everyone's corruption is lowered by 1.",
    ],
  },
  {
    name: "Divine Light",
    description: ["Spend 2 endurance to heal 1 wound from a character"],
  },
  {
    name: "Rejuvenate",
    description: ["Once per rest you may give 3 endurance to everyone"],
  },
  {
    name: "Clear of Mind",
    description: [
      "whenever you gain corruption roll a dice for each corruption. On success you resist the corruption.",
    ],
  },
  {
    name: "Backpack",
    description: ["You get a free backpack along with your starting items"],
  },
  {
    name: "Shapeshift",
    description: [
      "You can shape shift into small animals, such as mouse, raven, cat e.t.c.",
    ],
  },
  {
    name: "Healing Touch",
    description: [
      "During a rest you can use an action to heal 2 wounds from a single character.",
    ],
  },
  {
    name: "Blood Magic",
    description: ["Transfer wounds between willing characters."],
  },
  {
    name: "Black Magic",
    description: [
      "When channeling mana gain a wound to get an additional dice.",
    ],
  },
];
