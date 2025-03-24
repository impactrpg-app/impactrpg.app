import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { HydratedDocument } from "mongoose";
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from "class-validator";

export type CharacterDocument = HydratedDocument<Character>;

export class CharacterInfo {
    @ApiProperty({
        description: 'A base 64 image that can be used as src for html image tag',
    })
    @Prop({ required: true })
    @IsString()
    image: string;

    @ApiProperty({
        description: 'The name of the character',
        example: 'John Doe'
    })
    @Prop({ required: true })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The age of the character',
        example: 'Old'
    })
    @Prop({ required: true })
    @IsString()
    age: string;

    @ApiProperty({
        description: 'The personality of the character',
        example: 'John Doe'
    })
    @Prop({ required: true })
    @IsString()
    personality: string;
}

export class CharacterAbilities {
    @ApiProperty({
        description: 'The strength of the character',
        example: 10
    })
    @Prop({ required: true })
    @IsNumber()
    strength: number;

    @ApiProperty({
        description: 'The agility of the character',
        example: 10
    })
    @Prop({ required: true })
    @IsNumber()
    agility: number;

    @ApiProperty({
        description: 'The intelligence of the character',
        example: 10
    })
    @Prop({ required: true })
    @IsNumber()
    intelligence: number;
}

export class CharacterResources {
    @ApiProperty({
        description: 'The endurance of the character',
        example: 10
    })
    @Prop({ required: true })
    @IsNumber()
    endurance: number;

    @ApiProperty({
        description: 'The mana of the character',
        example: 10
    })
    @Prop({ required: true })
    @IsNumber()
    mana: number;

    @ApiProperty({
        description: 'The corruption of the character',
        example: 10
    })
    @Prop({ required: true })
    @IsNumber()
    corruption: number;

    @ApiProperty({
        description: 'The wounds of the character',
        example: 10
    })
    @Prop({ required: true })
    @IsNumber()
    wounds: number;

    @ApiProperty({
        description: 'The injury of the character',
        example: 'none'
    })
    @Prop({ required: true })
    @IsString()
    injury: string;

    @ApiProperty({
        description: 'The gold of the character',
        example: 10
    })
    @Prop({ required: true, default: 0 })
    @IsNumber()
    gold: number;
}

export enum GoodsType {
    Small = "small",
    Large = "large",
}

export class CharacterGearItem {
    @ApiProperty({
        description: 'The name of the gear item',
        example: 'Sword'
    })
    @Prop({ required: true })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The type of the gear item',
        example: 'small'
    })
    @Prop({ required: true, enum: GoodsType })
    @IsEnum(GoodsType)
    type: GoodsType;

    @ApiProperty({
        description: 'The attack of the gear item',
        example: 10
    })
    @Prop({ required: false })
    @IsNumber()
    @IsOptional()
    attack?: number;

    @ApiProperty({
        description: 'The armor of the gear item',
        example: 10
    })
    @Prop({ required: false })
    @IsNumber()
    @IsOptional()
    armor?: number;

    @ApiProperty({
        description: 'The description of the gear item',
        example: 'A sword'
    })
    @Prop({ required: true })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Whether the gear item is an automaton',
        example: false
    })
    @Prop({ required: false })
    @IsBoolean()
    @IsOptional()
    isAutomaton?: boolean;
}

export class CharacterSkill {
    @ApiProperty({
        description: 'The name of the skill',
        example: 'Sword'
    })
    @Prop({ required: true })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The description of the skill',
        example: 'A sword'
    })
    @Prop({ required: true })
    @IsString()
    description: string;
}

@Schema()
export class Character {
    @ApiProperty({
        description: 'The owner of the character',
        example: '123'
    })
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    owner: mongoose.Schema.Types.ObjectId;

    @ApiProperty()
    @Prop({ required: true, type: CharacterInfo })
    info: CharacterInfo;

    @ApiProperty()
    @Prop({ required: true, type: CharacterAbilities })
    abilities: CharacterAbilities;

    @ApiProperty()
    @Prop({ required: true, type: CharacterResources })
    resources: CharacterResources;

    @ApiProperty()
    @Prop({ required: true, type: [CharacterSkill] })
    skills: CharacterSkill[];

    @ApiProperty()
    @Prop({ required: true, type: [CharacterGearItem] })
    gear: CharacterGearItem[];

    @ApiProperty({
        description: 'The notes of the character',
        example: 'A note'
    })
    @Prop({ required: false, default: '' })
    @IsString()
    notes: string;

    @ApiProperty({
        description: 'The progression of the character',
        example: 10
    })
    @Prop({ required: true })
    @IsNumber()
    progression: number;

    @ApiProperty({
        description: 'The armor of the character',
        example: 10
    })
    @Prop({ required: true, default: 0 })
    @IsNumber()
    armor: number;

    @ApiProperty({
        description: 'The attack of the character',
        example: 10
    })
    @Prop({ required: true, default: 0 })
    @IsNumber()
    attack: number;
};

export const CharacterSchema = SchemaFactory.createForClass(Character);