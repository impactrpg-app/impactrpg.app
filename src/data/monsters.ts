export enum MonsterType {
  Animal = "Animals",
  Normal = "Normal Monsters",
  Magic = "Magic Monsters",
  Rare = "Rare Monsters",
}

export type MonsterAction = {
  rolls: number[];
  name: string;
  description: string;
};

export type MonsterSpecial = {
  name: string;
  description: string;
};

export type Monster = {
  name: string;
  description: string;
  type: MonsterType;
  abilities: {
    strength: number;
    agility: number;
    intelligence: number;
  };
  armor: number;
  wounds: number;
  actionsPerTurn: number;
  actions: MonsterAction[];
  specials?: MonsterSpecial[];
};

export const monsters: Monster[] = [
  {
    name: "Shadow Fox",
    description:
      "A sleek, black fox with glowing amber eyes. Its fur seems to shimmer in low light.",
    type: MonsterType.Animal,
    abilities: {
      strength: 3,
      agility: 4,
      intelligence: 2,
    },
    armor: 0,
    wounds: 1,
    actionsPerTurn: 1,
    actions: [
      {
        name: "Bite",
        description: "Attack a target using strength",
        rolls: [1, 2, 3],
      },
      {
        name: "Dash Away",
        description: "Moves away from combat, cannot be attacked next turn",
        rolls: [4, 5],
      },
      {
        name: "Howl",
        description: "Calls another fox to join the battle",
        rolls: [6],
      },
    ],
  },
  {
    name: "Fire Beetle",
    description: "A fist-sized beetle with a glowing red shell.",
    type: MonsterType.Animal,
    abilities: {
      strength: 1,
      agility: 3,
      intelligence: 1,
    },
    armor: 1,
    wounds: 1,
    actionsPerTurn: 1,
    actions: [
      {
        name: "Bite",
        description: "Attack a target using strength",
        rolls: [1, 2, 3, 4],
      },
      {
        name: "Scuttle",
        description: "Increase agility by 1 for 1 turn",
        rolls: [5, 6],
      },
    ],
  },
  {
    name: "Cave Troll",
    description:
      "A massive, hulking creature with stone-like skin and jagged teeth.",
    type: MonsterType.Normal,
    abilities: {
      strength: 6,
      agility: 2,
      intelligence: 1,
    },
    armor: 2,
    wounds: 8,
    actionsPerTurn: 1,
    actions: [
      {
        name: "Club Smash",
        description: "Attack a target using strength",
        rolls: [1, 2],
      },
      {
        name: "Throw Boulder",
        description: "Ranged attacks against the target using strength",
        rolls: [3, 4],
      },
      {
        name: "Roar",
        description:
          "All targets in range roll an easy intelligence check, if a target fails they lose 1 agility for a turn.",
        rolls: [5, 6],
      },
    ],
    specials: [
      {
        name: "Regeneration",
        description:
          "At the start of each turn roll 1d6. If successful, the cave troll recovers 1 wound.",
      },
    ],
  },
  {
    name: "Venomfang Serpent",
    description: "A long, green snake with bioluminescent spots.",
    type: MonsterType.Normal,
    abilities: {
      strength: 3,
      agility: 5,
      intelligence: 2,
    },
    armor: 1,
    wounds: 5,
    actionsPerTurn: 2,
    actions: [
      {
        name: "Bite",
        description: "Attack a target using strength",
        rolls: [1, 2, 3],
      },
      {
        name: "Constrict",
        description:
          "The target makes a hard strength check. On failure the target misses their next turn.",
        rolls: [4, 5],
      },
      {
        name: "Venom Spit",
        description:
          "The target makes a normal agility check. On failure the target has -1 armor for the rest of the combat.",
        rolls: [6],
      },
    ],
    specials: [
      {
        name: "Poison Bite",
        description:
          "If the bite lands, roll a normal strength check. On failure the target is poisoned.",
      },
    ],
  },
  {
    name: "Arcane Wraith",
    description:
      "A ghostly figure cloaked in shadows and crackling with purple energy.",
    type: MonsterType.Magic,
    abilities: {
      strength: 2,
      agility: 4,
      intelligence: 6,
    },
    armor: 0,
    wounds: 6,
    actionsPerTurn: 2,
    actions: [
      {
        name: "Mana Burst",
        description:
          "Everyone in combat (including arcane wraith) takes 1 wound.",
        rolls: [1],
      },
      {
        name: "Shadow Grasp",
        description:
          "A target makes hard strength check. On failure they take a wound and have -1 strength for 1 turn.",
        rolls: [2],
      },
      {
        name: "Arcane Bolt",
        description: "Attack a target using intelligence",
        rolls: [3, 4, 5],
      },
      {
        name: "Mana Drain",
        description:
          "Target a character with high inelligence. Both the target and the wraith roll intelligence. If the wraith has more successes then the target; The wraith steals 1 intelligence from the target for 2 turns.",
        rolls: [6],
      },
    ],
    specials: [
      {
        name: "Phase Shift",
        description:
          "Whenever attacked, roll 1D6 on success the target's attack passes through the wraith doing no wounds.",
      },
    ],
  },
  {
    name: "Emberwing Drake",
    description:
      "A small, crimson-scaled drake with burning wings and smoke trailing from its nostrils.",
    type: MonsterType.Magic,
    abilities: {
      strength: 5,
      agility: 6,
      intelligence: 4,
    },
    armor: 3,
    wounds: 7,
    actionsPerTurn: 3,
    actions: [
      {
        name: "Claw Slash",
        description: "Attack a target using strength",
        rolls: [1, 2, 3],
      },
      {
        name: "Fire Breath",
        description:
          "Attack a target using intelligence. If the target is wounded, they get another wound at the end of their turn.",
        rolls: [4, 5, 6],
      },
    ],
    specials: [
      {
        name: "Flame Cloak",
        description:
          "If attacked in melee. Roll normal agility check for the attacker, On Failure they take 1 wound.",
      },
    ],
  },
  {
    name: "Dread Hydra",
    description:
      "A towering hydra with five heads, each glowing with a different element.",
    type: MonsterType.Rare,
    abilities: {
      strength: 8,
      agility: 4,
      intelligence: 5,
    },
    armor: 2,
    wounds: 12,
    actionsPerTurn: 2,
    actions: [
      {
        name: "Bite",
        description: "Attack targets using strength",
        rolls: [1, 2],
      },
      {
        name: "Elemental Breath",
        description:
          "Attack targets using intelligence. If the target is wounded they gain an ailment from the element.",
        rolls: [3, 4],
      },
      {
        name: "Tail Sweep",
        description:
          "Attack everyone using strength. If hit the targets agility is lowered by 1 for 1 turn.",
        rolls: [5, 6],
      },
    ],
    specials: [
      {
        name: "Head Regrowth",
        description:
          "After receiving 5 wounds, regenerate 2 wounds at the start of each turn.",
      },
      {
        name: "Multi-Attack",
        description:
          "The hydra always chooses 2 different targets with one action. It makes the same attack to both targets.",
      },
      {
        name: "Elemental Breath",
        description:
          "Each of the hydra can have different element associated with it. They will always do that type of damage and inflict ailments of the same type.",
      },
    ],
  },
  {
    name: "Ashen Colossus",
    description:
      "A massive stone figure with cracks glowing with molten energy.",
    type: MonsterType.Rare,
    abilities: {
      strength: 8,
      agility: 2,
      intelligence: 2,
    },
    armor: 5,
    wounds: 18,
    actionsPerTurn: 1,
    actions: [
      {
        name: "Fist Smash",
        description: "Attack target using strength",
        rolls: [1, 2, 3],
      },
      {
        name: "Molten Spit",
        description: "Do a ranged attack using strength",
        rolls: [4, 5],
      },
      {
        name: "Seismic Slam",
        description:
          "All characters makes a defense roll. If the target does not have 3 successes then, they take 2 wounds",
        rolls: [6],
      },
    ],
    specials: [
      {
        name: "Lava Armor",
        description:
          "When attacked a random character rolls easy agility check. On Failure, they take 1 wound.",
      },
      {
        name: "Molten Core",
        description:
          "When reduced to 7 wounds or fewer, strength increases by 3",
      },
    ],
  },
  {
    name: "Crystal Moth",
    description:
      "A shimmering moth with crystal-like wings that reflect light.",
    type: MonsterType.Animal,
    abilities: {
      strength: 1,
      agility: 4,
      intelligence: 2,
    },
    armor: 1,
    wounds: 1,
    actionsPerTurn: 1,
    actions: [
      {
        name: "Wing Slash",
        description: "Attack a target using strength",
        rolls: [1, 2, 3, 4],
      },
      {
        name: "Crystal Dust",
        description:
          "All targets in combat have a penalty to their attack rolls for 2 turns.",
        rolls: [5, 6],
      },
    ],
  },
  {
    name: "Stoneback Tortoise",
    description: "A large tortoise with a stone-covered shell.",
    type: MonsterType.Animal,
    abilities: {
      strength: 2,
      agility: 1,
      intelligence: 1,
    },
    armor: 4,
    wounds: 3,
    actionsPerTurn: 1,
    actions: [
      {
        name: "Bite",
        description: "Attack a target using strength",
        rolls: [1, 2, 3, 4],
      },
      {
        name: "Shell Defense",
        description: "Increase armor by 2 for 1 turn.",
        rolls: [5, 6],
      },
    ],
  },
  {
    name: "Galehawk",
    description: "A large bird with silver feathers and sharp talons.",
    type: MonsterType.Animal,
    abilities: {
      strength: 2,
      agility: 5,
      intelligence: 1,
    },
    armor: 0,
    wounds: 2,
    actionsPerTurn: 1,
    actions: [
      {
        name: "Talon Slash",
        description: "Attack a target using strength",
        rolls: [1, 2, 3, 4],
      },
      {
        name: "Wind Gust",
        description:
          "Pushes enemies back preventing them from doing a melee attack for 1 turn.",
        rolls: [5, 6],
      },
    ],
  },
  {
    name: "Thunder-fang Squirrel",
    description: "A small squirrel crackling with static electricity.",
    type: MonsterType.Animal,
    abilities: {
      strength: 1,
      agility: 5,
      intelligence: 2,
    },
    armor: 0,
    wounds: 1,
    actionsPerTurn: 2,
    actions: [
      {
        name: "Bite",
        description: "Attack a target using strength",
        rolls: [1, 2],
      },
      {
        name: "Scratch",
        description: "Attack a target using strength + 1",
        rolls: [3, 4],
      },
      {
        name: "Shock",
        description: "Apply shock ailment to a target",
        rolls: [5, 6],
      },
    ],
  },
  {
    name: "Embertail Lynx",
    description: "A lynx with glowing red fur and fiery paws.",
    type: MonsterType.Animal,
    abilities: {
      strength: 2,
      agility: 4,
      intelligence: 2,
    },
    armor: 1,
    wounds: 2,
    actionsPerTurn: 2,
    actions: [
      {
        name: "Claw Swipe",
        description: "Attack a target using strength",
        rolls: [1, 2, 3],
      },
      {
        name: "Flame Leap",
        description:
          "Jumps to attack a ranged enemy using strength + 2. The attack cannot be blocked by another character.",
        rolls: [4, 5, 6],
      },
    ],
  },
  {
    name: "Boulder Toad",
    description: "A large, camouflaged toad with rocky skin.",
    type: MonsterType.Animal,
    abilities: {
      strength: 3,
      agility: 2,
      intelligence: 1,
    },
    armor: 2,
    wounds: 4,
    actionsPerTurn: 1,
    actions: [
      {
        name: "Tongue Lash",
        description: "Attack a target using strength",
        rolls: [1, 2, 3, 4, 5, 6],
      },
    ],
    specials: [
      {
        name: "Stone Skin",
        description: "When wounded the toad takes -1 wound.",
      },
    ],
  },
  {
    name: "Glowtail Gecko",
    description: "A small, glowing lizard with a shimmering tail.",
    type: MonsterType.Animal,
    abilities: {
      strength: 1,
      agility: 4,
      intelligence: 1,
    },
    armor: 0,
    wounds: 1,
    actionsPerTurn: 2,
    actions: [
      {
        name: "Tail Whip",
        description: "Attack a target using strength",
        rolls: [1, 2],
      },
      {
        name: "Glow",
        description:
          "Everyone in combat has a penalty to their attack rolls for 1 turn.",
        rolls: [3, 4],
      },
      {
        name: "Dash",
        description: "Gain +1 agility for 1 turn",
        rolls: [5, 6],
      },
    ],
  },
  {
    name: "Ashclaw Raccoon",
    description: "A raccoon with blackened fur and glowing red eyes.",
    type: MonsterType.Animal,
    abilities: {
      strength: 2,
      agility: 5,
      intelligence: 3,
    },
    armor: 1,
    wounds: 2,
    actionsPerTurn: 2,
    actions: [
      {
        name: "Claw Swipe",
        description: "Attack a target using strength",
        rolls: [1, 2, 3],
      },
      {
        name: "Snatch",
        description: "Steal a small item from a target",
        rolls: [4, 5, 6],
      },
    ],
  },
  {
    name: "Brambleback Boar",
    description: "A large boar covered in thorny brambles.",
    type: MonsterType.Animal,
    abilities: {
      strength: 4,
      agility: 3,
      intelligence: 1,
    },
    armor: 1,
    wounds: 3,
    actionsPerTurn: 1,
    actions: [
      {
        name: "Tusk Charge",
        description: "Attack a target using strength",
        rolls: [1, 2, 3],
      },
      {
        name: "Bramble Swipe",
        description:
          "Characters roll easy strength check. On failure they take 1 wound.",
        rolls: [4, 5, 6],
      },
    ],
  },
  {
    name: "Riverfin Otter",
    description: "A sleek otter with scales on its back.",
    type: MonsterType.Animal,
    abilities: {
      strength: 2,
      agility: 4,
      intelligence: 2,
    },
    armor: 2,
    wounds: 1,
    actionsPerTurn: 2,
    actions: [
      {
        name: "Claw",
        description: "Attack using strength",
        rolls: [1, 2],
      },
      {
        name: "Bite",
        description: "Attack using strength + 2",
        rolls: [3, 4],
      },
      {
        name: "Dive",
        description:
          "Dive underwater, cannot be attacked next turn. If on land, re-roll the action",
        rolls: [5, 6],
      },
    ],
  },
];
