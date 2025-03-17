import mongoose, { HydratedDocument } from "mongoose";
export type CharacterDocument = HydratedDocument<Character>;
export declare class CharacterInfo {
    image: string;
    name: string;
    age: string;
    personality: string;
}
export declare class CharacterAbilities {
    strength: number;
    agility: number;
    intelligence: number;
}
export declare class CharacterResources {
    endurance: number;
    mana: number;
    corruption: number;
    wounds: number;
    injury: string;
}
export declare enum GoodsType {
    Small = "small",
    Large = "large"
}
export declare class CharacterGearItem {
    name: string;
    type: GoodsType;
    attack?: number;
    armor?: number;
    description: string;
    isAutomaton?: boolean;
}
export declare class CharacterSkill {
    name: string;
    description: string;
}
export declare class Character {
    owner: mongoose.Schema.Types.ObjectId;
    info: CharacterInfo;
    abilities: CharacterAbilities;
    resources: CharacterResources;
    skills: CharacterSkill[];
    gear: CharacterGearItem[];
    notes: string;
    progression: number;
}
export declare const CharacterSchema: mongoose.Schema<Character, mongoose.Model<Character, any, any, any, mongoose.Document<unknown, any, Character> & Character & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Character, mongoose.Document<unknown, {}, mongoose.FlatRecord<Character>> & mongoose.FlatRecord<Character> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
