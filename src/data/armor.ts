import { GoodsType } from "./goods";

export type Armor = {
  name: string;
  size: GoodsType;
  description: string;
  armor: number;
};

export const armors: Armor[] = [
  {
    name: "Lightly Armored",
    size: GoodsType.Large,
    description:
      "Wearing a moderate amount of protection, such as full leather armor, classifies you as lightly armored.",
    armor: 1,
  },
  {
    name: "Heavily Armored",
    size: GoodsType.Large,
    description:
      "Wearing high-level protection, such as chainmail or plate armor, classifies you as heavily armored.",
    armor: 2,
  },
];
