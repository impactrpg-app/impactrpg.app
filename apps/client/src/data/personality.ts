export type Personality = {
  name: string;
  description: string;
};

export const personalities: Personality[] = [
  {
    name: "Agreeable",
    description:
      "You are trusting and quick to believe others, often taking their words at face value.",
  },
  {
    name: "Fearful",
    description:
      "You are wary of physical confrontation and will go out of your way to avoid it.",
  },
  {
    name: "Honest",
    description:
      "You value truthfulness and refuse to lie, no matter the circumstances.",
  },
  {
    name: "Helpful",
    description:
      "You are always eager to lend a hand, offering assistance to anyone in need.",
  },
  {
    name: "Lawful",
    description:
      "You adhere strictly to the law and seek to bring wrongdoers to justice.",
  },
  {
    name: "Selfish",
    description:
      "Your focus is on your own well-being, often acting without considering the needs of others.",
  },
];
