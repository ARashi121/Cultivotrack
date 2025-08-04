
import { Plant, HardeningEvent } from './types';

const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Alternanthera reineckii \'mini\'',
    scientificName: 'Alternanthera reineckii \'mini\'',
    description: 'A popular, colorful foreground plant that provides a vibrant red contrast to green aquatic plants.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [
      { id: 's1', date: '2024-07-15', explantCount: 30, media: 'MS Media' },
      { id: 's2', date: '2024-06-15', explantCount: 25, media: 'MS Media' },
    ],
  },
  {
    id: '2',
    name: 'Alternanthera reineckii Rosanervig',
    scientificName: 'Alternanthera reineckii Rosanervig',
    description: 'Known for its striking pink leaves with light-colored nerves, making it a standout in any aquascape.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [
        { id: 's3', date: '2024-07-20', explantCount: 40, media: 'MS Media' },
    ],
  },
  {
    id: '3',
    name: 'Cryptocoryne axelrodi',
    scientificName: 'Cryptocoryne axelrodi',
    description: 'A hardy and adaptable plant with narrow, ruffled leaves, suitable for a variety of water conditions.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [],
  },
  {
    id: '4',
    name: 'Cryptocoryne beckettii',
    scientificName: 'Cryptocoryne beckettii',
    description: 'A classic aquarium plant with beautiful, dark bronze-colored leaves that is easy to care for.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [
        { id: 's4', date: '2024-07-18', explantCount: 50, media: 'B5 Media' },
    ],
  },
  {
    id: '5',
    name: 'Drosera adele',
    scientificName: 'Drosera adele',
    description: 'A carnivorous plant from Australia, also known as the lance-leaved sundew, with long, elegant leaves.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [
         { id: 's5', date: '2024-07-22', explantCount: 20, media: 'Peat-based Media' },
    ],
  },
   {
    id: '6',
    name: 'Drosera spatulata',
    scientificName: 'Drosera spatulata',
    description: 'A variable, rosette-forming sundew with spoon-shaped leaves, commonly found in Southeast Asia and Australia.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [],
  },
  {
    id: '7',
    name: 'Cryptocoryne lucens',
    scientificName: 'Cryptocoryne lucens',
    description: 'A small, slender-leaved Cryptocoryne that is great for foreground or midground placement in an aquarium.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [],
  },
  {
    id: '8',
    name: 'Cryptocoryne nurii',
    scientificName: 'Cryptocoryne nurii',
    description: 'A beautiful and sought-after Cryptocoryne known for its patterned leaves with reddish-brown tones.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [],
  },
  {
    id: '9',
    name: 'Cryptocoryne spiralis \'Jwala\'',
    scientificName: 'Cryptocoryne spiralis \'Jwala\'',
    description: 'A unique variety of Cryptocoryne spiralis with long, twisted leaves, creating a dynamic visual effect.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [],
  },
  {
    id: '10',
    name: 'Cryptocoryne wendtii \'Pink\'',
    scientificName: 'Cryptocoryne wendtii \'Pink\'',
    description: 'A colorful variant of the popular Cryptocoryne wendtii, showcasing vibrant pink and bronze hues under good lighting.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [],
  },
  {
    id: '11',
    name: 'Cryptocoryne wendtii \'Sindoor\'',
    scientificName: 'Cryptocoryne wendtii \'Sindoor\'',
    description: 'A newer variant with intense reddish-brown coloration, named after the traditional vermilion color.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [],
  },
  {
    id: '12',
    name: 'Cryptocoryne wendtii Green',
    scientificName: 'Cryptocoryne wendtii Green',
    description: 'The classic green variant of Cryptocoryne wendtii, a hardy and versatile plant suitable for beginners.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
    subcultureHistory: [],
  },
];


const mockHardeningData: HardeningEvent[] = [
    {
        id: 'h1',
        plantId: '1',
        plantName: 'Alternanthera reineckii \'mini\'',
        dateTransferred: '2024-05-15',
        transferredCount: 50,
        stage: 'growing',
        acclimatizationSuccessRate: 0.9,
        dateMovedToGrowth: '2024-06-01',
        growthSuccessRate: 0.95,
        notes: 'Vigorous growth in the greenhouse.'
    },
    {
        id: 'h2',
        plantId: '3',
        plantName: 'Cryptocoryne axelrodi',
        dateTransferred: '2024-06-01',
        transferredCount: 30,
        stage: 'acclimatizing',
        notes: 'Initial transfer to a controlled environment chamber.'
    },
    {
        id: 'h3',
        plantId: '1',
        plantName: 'Alternanthera reineckii \'mini\'',
        dateTransferred: '2024-04-20',
        transferredCount: 25,
        stage: 'exported',
        acclimatizationSuccessRate: 0.88,
        dateMovedToGrowth: '2024-05-10',
        growthSuccessRate: 0.92,
        dateExported: '2024-06-05',
        exportedTo: 'GreenLeaf Nursery',
        notes: 'Batch sold to a commercial partner.'
    },
    {
        id: 'h4',
        plantId: '2',
        plantName: 'Alternanthera reineckii Rosanervig',
        dateTransferred: '2024-06-10',
        transferredCount: 100,
        stage: 'acclimatizing',
        notes: 'Large batch, monitoring closely for mold.'
    }
];


export const getPlants = (): Plant[] => {
  return mockPlants;
}

export const getPlantById = (id: string): Plant | undefined => {
  return mockPlants.find((plant) => plant.id === id);
}

export const getHardeningData = (): HardeningEvent[] => {
    return mockHardeningData;
}
