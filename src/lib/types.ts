export type PlantType = 'tc' | 'development';

export interface SubcultureEvent {
  id: string;
  date: string;
  explantCount: number;
  media: string;
  notes?: string;
}

export interface HardeningEvent {
  id: string;
  date: string;
  transferredCount: number;
  survivalRate: number;
  notes?: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  photoUrl: string;
  type: PlantType;
  subcultureHistory: SubcultureEvent[];
  hardeningHistory: HardeningEvent[];
}

export interface AnalysisResult {
  isContaminated: boolean;
  contaminants: string;
  confidence: number;
}
