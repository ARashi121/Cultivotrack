import { Plant } from './types';

const mockPlants: Plant[] = [
  {
    id: '1',
    name: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    description: 'A popular and elegant fern with arching, green fronds.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'tc',
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
    type: 'tc',
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
    type: 'tc',
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
    type: 'tc',
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
    subcultureHistory: [],
    hardeningHistory: [],
    protocolExperiments: [
        {
            id: 'exp1',
            iteration: 1,
            inoculationDate: '2024-03-10',
            sterilisationProcedure: '70% Ethanol for 1 min, 1% NaOCl for 10 mins',
            inoculationMedia: 'MS + 1mg/L BAP',
            status: 'failed',
            notes: 'High contamination rate observed after 5 days.',
            observations: [
                { id: 'obs1', date: '2024-03-15', observation: 'contamination', notes: 'Fungal growth visible.'}
            ]
        },
        {
            id: 'exp2',
            iteration: 2,
            inoculationDate: '2024-04-02',
            sterilisationProcedure: '70% Ethanol for 2 min, 1.5% NaOCl for 15 mins',
            inoculationMedia: 'MS + 1mg/L BAP + Antifungal agent',
            status: 'ongoing',
            notes: 'Reduced contamination, some callus formation.',
             observations: [
                { id: 'obs2', date: '2024-04-10', observation: 'callus', imageUrl: 'https://placehold.co/300x200.png' },
                { id: 'obs3', date: '2024-04-25', observation: 'shoot', notes: 'First shoots appearing.'}
            ],
            subcultures: [
                { id: 'exp2-s1', date: '2024-05-10', explantCount: 10, media: 'MS + 0.5mg/L BAP', notes: 'First subculture for shoot elongation.'}
            ]
        }
    ]
  },
  {
    id: '6',
    name: 'Ghost Orchid',
    scientificName: 'Dendrophylax lindenii',
    description: 'A rare, leafless orchid under protocol optimization.',
    photoUrl: 'https://placehold.co/600x400.png',
    type: 'development',
    subcultureHistory: [],
    hardeningHistory: [],
    protocolExperiments: [
         {
            id: 'exp3',
            iteration: 1,
            inoculationDate: '2024-05-15',
            sterilisationProcedure: 'Proprietary Seed Sterilization Technique v1',
            inoculationMedia: 'P723 Orchid Maintenance Medium',
            status: 'ongoing',
            notes: 'Germination is slow, as expected for this species.',
            observations: [],
            subcultures: [],
        }
    ]
  },
];

export const getPlants = (): Plant[] => {
  return mockPlants;
}

export const getPlantById = (id: string): Plant | undefined => {
  return mockPlants.find((plant) => plant.id === id);
}
