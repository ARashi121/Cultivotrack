import { z } from 'zod';

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

export const ParsedSubcultureRecordSchema = z.object({
    plantName: z.string().describe("The name of the plant."),
    subcultureDate: z.string().describe("The date of the subculture in YYYY-MM-DD format."),
    doneBy: z.string().describe("The name of the technician who performed the subculture."),
    jarsUsed: z.number().describe("The total number of jars used."),
    contaminatedJars: z.number().optional().describe("The number of contaminated jars, if any."),
    jarsToHardening: z.number().optional().describe("The number of jars transferred to hardening, if any."),
    notes: z.string().optional().describe("Any notes associated with the event."),
});
export type ParsedSubcultureRecord = z.infer<typeof ParsedSubcultureRecordSchema>;
