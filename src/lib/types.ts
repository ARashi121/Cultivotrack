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

export interface ExperimentObservation {
    id: string;
    date: string;
    observation: 'callus' | 'shoot' | 'root' | 'necrosis' | 'contamination' | 'other';
    notes?: string;
    imageUrl?: string;
}

export interface ProtocolDevelopmentExperiment {
    id: string;
    iteration: number;
    inoculationDate: string;
    sterilisationProcedure: string;
    inoculationMedia: string;
    observations: ExperimentObservation[];
    status: 'ongoing' | 'success' | 'failed';
    notes?: string;
    subcultures?: SubcultureEvent[];
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
  protocolExperiments?: ProtocolDevelopmentExperiment[];
}

export interface AnalysisResult {
  isContaminated: boolean;
  contaminants: string;
  confidence: number;
}
