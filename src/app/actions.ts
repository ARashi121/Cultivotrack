'use server';

import { analyzeContamination, AnalyzeContaminationOutput } from '@/ai/flows/analyze-contamination';
import { generateLabReport, GenerateLabReportInput, GenerateLabReportOutput } from '@/ai/flows/generate-lab-report';
import { parseSubcultureSheet, ParseSubcultureSheetOutput } from '@/ai/flows/parse-subculture-sheet';

export async function performContaminationAnalysis(photoDataUri: string): Promise<AnalyzeContaminationOutput['contaminationAnalysis']> {
  try {
    const result = await analyzeContamination({ photoDataUri });
    return result.contaminationAnalysis;
  } catch (error) {
    console.error('Error in Genkit flow:', error);
    throw new Error('Failed to analyze image.');
  }
}

export async function generateReport(input: GenerateLabReportInput): Promise<GenerateLabReportOutput> {
  try {
    const result = await generateLabReport(input);
    return result;
  } catch (error) {
    console.error('Error in Genkit flow:', error);
    throw new Error('Failed to generate report.');
  }
}

export async function performSheetParsing(sheetData: string): Promise<ParseSubcultureSheetOutput> {
    try {
        const result = await parseSubcultureSheet({ sheetData });
        return result;
    } catch (error) {
        console.error('Error in Genkit flow:', error);
        throw new Error('Failed to parse spreadsheet.');
    }
}
