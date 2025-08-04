export type PlantType = 'tc' | 'development';

export interface SubcultureEvent {
  id: string;
  date: string;
  explantCount: number;
  media: string;
  notes?: string;
  // Fields from form that are not in the base type yet
  jarsUsed?: number;
  contaminatedJars?: number;
  jarsToHardening?: number;
}

export interface HardeningEvent {
  id: string;
  plantId: string;
  plantName: string;
  dateTransferred: string;
  transferredCount: number;
  stage: 'acclimatizing' | 'growing' | 'exported';
  acclimatizationSuccessRate?: number;
  dateMovedToGrowth?: string;
  growthSuccessRate?: number;
  dateExported?: string;
  exportedTo?: string;
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
  protocolExperiments?: ProtocolDevelopmentExperiment[];
}

export interface AnalysisResult {
  isContaminated: boolean;
  contaminants: string;
  confidence: number;
}
