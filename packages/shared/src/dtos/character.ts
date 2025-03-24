import {
  ApiProperty,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from "../nestjs-imports";

export class CharacterInfoDto {
  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  age: string;

  @ApiProperty()
  @IsString()
  personality: string;
}

export class CharacterAbilitiesDto {
  @ApiProperty()
  @IsNumber()
  strength: number;

  @ApiProperty()
  @IsNumber()
  agility: number;

  @ApiProperty()
  @IsNumber()
  intelligence: number;
}

export class CharacterResourcesDto {
  @ApiProperty()
  @IsNumber()
  endurance: number;

  @ApiProperty()
  @IsNumber()
  mana: number;

  @ApiProperty()
  @IsNumber()
  corruption: number;

  @ApiProperty()
  @IsNumber()
  wounds: number;

  @ApiProperty()
  @IsString()
  injury: string;

  @ApiProperty()
  @IsNumber()
  gold: number;
}

export enum GoodsType {
  Small = "small",
  Large = "large",
}

export class CharacterGearItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEnum(GoodsType)
  type: GoodsType;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  attack?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  armor?: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isAutomaton?: boolean;

  @ApiProperty()
  @IsString()
  description: string;
}

export class CharacterSkillDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
}


export class CreateCharacterDto {
  @ApiProperty()
  @ValidateNested()
  info: CharacterInfoDto;

  @ApiProperty()
  @ValidateNested()
  abilities: CharacterAbilitiesDto;

  @ApiProperty()
  @ValidateNested()
  resources: CharacterResourcesDto;

  @ApiProperty()
  @ValidateNested()
  @IsArray()
  skills: CharacterSkillDto[];

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  gear: CharacterGearItemDto[];

  @ApiProperty()
  @IsString()
  notes: string;

  @ApiProperty()
  @IsNumber()
  progression: number;

  @ApiProperty()
  @IsNumber()
  armor: number;

  @ApiProperty()
  @IsNumber()
  attack: number;

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
      gold: 0,
    };
    this.skills = [];
    this.gear = [];
    this.notes = "";
    this.progression = 0;
    this.armor = 0;
    this.attack = 0;
  }
}

export class CharacterDto extends CreateCharacterDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  owner: string;
}

export class CharacterListDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  image: string;
}
