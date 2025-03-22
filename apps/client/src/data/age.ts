export type Age = {
  name: string;
  description: string;
  benefit: string;
};

export const ages: Age[] = [
  {
    name: "Young",
    description: "Youth grants boundless energy and resilience.",
    benefit: "Increase your maximum Endurance by +3.",
  },
  {
    name: "Adult",
    description:
      "In the prime of life, you possess both strength and fortitude, forged through experience.",
    benefit: "You can endure one additional wound before succumbing to death. ",
  },
  {
    name: "Elderly",
    description:
      "A lifetime of experience has endowed you with a wealth of knowledge and wisdom.",
    benefit: "Gain one extra skill.",
  },
];
