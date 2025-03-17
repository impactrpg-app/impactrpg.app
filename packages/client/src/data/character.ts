import { Character as SharedCharacter } from '@impact/shared'

export type Character = Omit<SharedCharacter, 'owner'>

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
  progression: 0,
};
