export class RoomDto {
  id: string;
  name: string;
}

export class RoomUpdateDto {
  name: string;
}


export class CharacterInfoDto {
  image: string;
  name: string;
  age: string;
  personality: string;
}

export class CharacterAbilitiesDto {
  strength: number;
  agility: number;
  intelligence: number;
}

export class CharacterResourcesDto {
  endurance: number;
  mana: number;
  corruption: number;
  wounds: number;
  injury: string;
}

export enum GoodsType {
  Small = "small",
  Large = "large",
}

export class CharacterGearItemDto {
  name: string;
  type: GoodsType;
  attack?: number;
  armor?: number;
  isAutomaton?: boolean;
  description: string;
}

export class CharacterSkillDto {
  name: string;
  description: string;
}

export class CharacterDto {
  info: CharacterInfoDto;
  abilities: CharacterAbilitiesDto;
  resources: CharacterResourcesDto;
  skills: CharacterSkillDto[];
  gear: CharacterGearItemDto[];
  notes: string;
  progression: number;

  constructor() {
    this.info = {
      image: "",
      name: "",
      age: "",
      personality: "",
    };
    this.abilities = {
      strength: 3,
      agility: 2,
      intelligence: 1,
    };
    this.resources = {
      corruption: 0,
      wounds: 0,
      endurance: 12,
      mana: 0,
      injury: "",
    };
    this.skills = [];
    this.gear = [];
    this.notes = "";
    this.progression = 0;
  }
}

export class CharacterListDto {
  id: string;
  name: string;
  image: string;
}