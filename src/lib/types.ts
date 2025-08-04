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
  code: string;
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

// A more flexible schema for the AI to target. All fields are optional strings.
export const LooseParsedSubcultureRecordSchema = z.object({
    plantName: z.string().optional(),
    subcultureDate: z.string().optional(), // AI should return date as a string
    doneBy: z.string().optional(),
    jarsUsed: z.string().optional(), // AI should return numbers as strings
    contaminatedJars: z.string().optional(),
    jarsToHardening: z.string().optional(),
    notes: z.string().optional(),
});
export type LooseParsedSubcultureRecord = z.infer<typeof LooseParsedSubcultureRecordSchema>;

// The final, validated schema for use in the application
export const ParsedSubcultureRecordSchema = z.object({
    plantName: z.string(),
    subcultureDate: z.string(), // Stored as 'YYYY-MM-DD' string after validation
    doneBy: z.string(),
    jarsUsed: z.number(),
    contaminatedJars: z.number().optional(),
    jarsToHardening: z.number().optional(),
    notes: z.string().optional(),
});
export type ParsedSubcultureRecord = z.infer<typeof ParsedSubcultureRecordSchema>;
