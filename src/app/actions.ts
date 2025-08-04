'use server';

import { analyzeContamination, AnalyzeContaminationOutput } from '@/ai/flows/analyze-contamination';

export async function performContaminationAnalysis(photoDataUri: string): Promise<AnalyzeContaminationOutput['contaminationAnalysis']> {
  try {
    const result = await analyzeContamination({ photoDataUri });
    return result.contaminationAnalysis;
  } catch (error) {
    console.error('Error in Genkit flow:', error);
    throw new Error('Failed to analyze image.');
  }
}
