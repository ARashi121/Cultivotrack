import { Plant } from './types';

const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    description: 'A popular and elegant fern with arching, green fronds.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'standard',
    subcultureHistory: [
      { id: 's1', date: '2024-06-01', explantCount: 50, media: 'MS Media', notes: 'Vigorous growth observed.' },
      { id: 's2', date: '2024-05-01', explantCount: 45, media: 'MS Media', notes: 'Routine subculture.' },
    ],
    hardeningHistory: [
      { id: 'h1', date: '2024-04-15', transferredCount: 20, survivalRate: 0.9, notes: 'Transferred to greenhouse.' },
    ],
  },
  {
    id: '2',
    name: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    description: 'A resilient plant known for its air-purifying qualities.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'standard',
    subcultureHistory: [
      { id: 's3', date: '2024-06-10', explantCount: 60, media: 'B5 Media', notes: 'Healthy proliferation.' },
    ],
    hardeningHistory: [],
  },
  {
    id: '3',
    name: 'Orchid',
    scientificName: 'Phalaenopsis amabilis',
    description: 'Exotic and beautiful, requiring specific care.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'standard',
    subcultureHistory: [],
    hardeningHistory: [
        { id: 'h2', date: '2024-05-20', transferredCount: 15, survivalRate: 0.85, notes: 'Acclimatizing well.' },
    ],
  },
  {
    id: '4',
    name: 'Venus Flytrap',
    scientificName: 'Dionaea muscipula',
    description: 'A carnivorous plant famous for its trapping mechanism.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'standard',
    subcultureHistory: [
        { id: 's4', date: '2024-06-12', explantCount: 30, media: 'Peat-based Media', notes: 'Slower growth rate.' },
    ],
    hardeningHistory: [],
  },
  {
    id: '5',
    name: 'Blue Agave',
    scientificName: 'Agave tequilana',
    description: 'A succulent used in tequila production.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'development',
    subcultureHistory: [
      { id: 's5', date: '2024-06-05', explantCount: 20, media: 'Experiment X1', notes: 'Testing new hormone levels.' },
    ],
    hardeningHistory: [],
  },
  {
    id: '6',
    name: 'Ghost Orchid',
    scientificName: 'Dendrophylax lindenii',
    description: 'A rare, leafless orchid under protocol optimization.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'development',
    subcultureHistory: [
      { id: 's6', date: '2024-05-25', explantCount: 5, media: 'Experiment P2', notes: 'Low germination rate.' },
    ],
    hardeningHistory: [],
  },
];

export const getPlants = (): Plant[] => {
  return mockPlants;
}

export const getPlantById = (id: string): Plant | undefined => {
  return mockPlants.find((plant) => plant.id === id);
}
