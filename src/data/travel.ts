export type TravelEventOption = {
  description: string;
  outcome: string;
};

export type TravelEvent = {
  name: string;
  description: string;
  options: TravelEventOption[];
};

export const travelEvents: TravelEvent [] = [
  {
    name: 'Bandit Trap',
    description: 'You stumble into a trap set by bandits. They demand valuables in exchange for your safety.',
    options: [
      {
        description: 'Refuse to Negotiate and fight',
        outcome: 'Each player takes 2 wounds'
      },
      {
        description: 'Surrender valuables',
        outcome: 'Each player loses 1 good of their choice'
      }
    ]
  },
  {
    name: 'Monster Attack',
    description: 'You hear screams and see a [monster] attacking villagers.',
    options: [
      {
        description: 'Help the villagers',
        outcome: 'Lose 3 endurance, gain camp supplies'
      },
      {
        description: 'Leave the villagers',
        outcome: 'Gain 1 corruption'
      }
    ]
  },
  {
    name: 'Broken Wagon',
    description: "An old man's wagon wheel has broken.",
    options: [
      {
        description: 'Help fix the wagon',
        outcome: 'Lose 2 endurance, gain 1 healing balm.'
      },
      {
        description: 'Rob the old man',
        outcome: 'Gain 2 corruption, gain 2 healing balms'
      },
      {
        description: 'Ignore him',
        outcome: 'Nothing happens'
      }
    ]
  },
  {
    name: 'Storm',
    description: 'Clouds gather, and a storm is approaching',
    options: [
      {
        description: 'Find a shelter in a shed and wait out the storm',
        outcome: 'Lose 2 endurance'
      },
      {
        description: 'Brave the storm',
        outcome: 'Gain 1 wound'
      }
    ]
  },
  {
    name: 'Unfamiliar Path',
    description: 'You enter a dark, uncharted area. You have no memory of this place.',
    options: [
      {
        description: 'Retrace your steps and find a safer route',
        outcome: 'Lose 2 endurance'
      },
      {
        description: 'Proceed with the unfamiliar path',
        outcome: 'Gain 2 corruption'
      }
    ]
  },
  {
    name: 'Sickly Women',
    description: 'A coughing women begs for help.',
    options: [
      {
        description: 'Cook a meal for the women',
        outcome: 'Lose 2 endurance, gain a torch'
      },
      {
        description: 'Ignore her',
        outcome: 'Gain 1 corruption'
      },
      {
        description: 'Rob her belongings',
        outcome: 'Gain 2 corruption, gain a torch'
      },
      {
        description: 'Attack her',
        outcome: 'Gain 3 corruption, gain a random item.'
      }
    ]
  }
];