export type Injury = {
  name: string;
  description: string;
};

export const injuryEffects: Injury[] = [
  {
    name: "Critical",
    description: "Roll twice on the injury table. Reroll 1s.",
  },
  { name: "InjuredEye", description: "Penalty to attacks and defense rolls." },
  { name: "Concussion", description: "Cannot use skills; gain 1 corruption." },
  { name: "InjuredArm", description: "One arm becomes unusable." },
  { name: "InjuredLeg", description: "Limit to carrying 1 large good." },
  { name: "HighImpact", description: "-5 maximum endurance." },
];
