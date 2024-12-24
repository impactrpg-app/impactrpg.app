import { GoodsType } from "./goods";

export type CharacterInfo = {
  image: string;
  name: string;
  age: string;
  personality: string;
};

export type CharacterAbilities = {
  strength: number;
  agility: number;
  intelligence: number;
};

export type CharacterResources = {
  endurance: number;
  mana: number;
  corruption: number;
  wounds: number;
  injury: string;
};

export type CharacterGearItem = {
  name: string;
  type: GoodsType;
  attack?: number;
  armor?: number;
  description: string;
  isAutomaton?: boolean;
};

export const NewGearItem: CharacterGearItem = {
  name: "",
  type: GoodsType.Small,
  description: "",
};

export type CharacterSkill = {
  name: string;
  description: string;
};

export const NewSkill: CharacterSkill = {
  name: "",
  description: "",
};

export type Character = {
  info: CharacterInfo;
  abilities: CharacterAbilities;
  resources: CharacterResources;
  skills: CharacterSkill[];
  gear: CharacterGearItem[];
  notes: string;
};

export const NewCharacter: Character = {
  info: {
    image: "",
    name: "",
    age: "",
    personality: "",
  },
  abilities: {
    strength: 3,
    agility: 2,
    intelligence: 1,
  },
  resources: {
    corruption: 0,
    wounds: 0,
    endurance: 12,
    mana: 0,
    injury: "",
  },
  skills: [],
  gear: [],
  notes: "",
};
