'use server';

import { analyzeContamination, AnalyzeContaminationOutput } from '@/ai/flows/analyze-contamination';
import { generateLabReport, GenerateLabReportInput, GenerateLabReportOutput } from '@/ai/flows/generate-lab-report';
import { parseSubcultureSheet } from '@/ai/flows/parse-subculture-sheet';
import { ParsedSubcultureRecord, ParsedSubcultureRecordSchema } from '@/lib/types';
import { z } from 'zod';
import { format, parseISO, isValid } from 'date-fns';

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

function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

function formatDate(dateString: string): string {
    if (!isValidDate(dateString)) return "Invalid Date";
    // Attempt to create a date object. This is flexible with formats.
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd');
}


export async function performSheetParsing(sheetData: string): Promise<{ records: ParsedSubcultureRecord[] }> {
    try {
        const aiResult = await parseSubcultureSheet({ sheetData });

        if (!aiResult || !aiResult.records) {
            throw new Error("AI parsing returned no records.");
        }

        const validatedRecords: ParsedSubcultureRecord[] = [];

        for (const looseRecord of aiResult.records) {
            // Skip if essential data like plantName or date is missing
            if (!looseRecord.plantName || !looseRecord.subcultureDate || !looseRecord.jarsUsed) {
                continue;
            }

            const jarsUsedNum = parseInt(looseRecord.jarsUsed, 10);
            const contaminatedJarsNum = looseRecord.contaminatedJars ? parseInt(looseRecord.contaminatedJars, 10) : undefined;
            const jarsToHardeningNum = looseRecord.jarsToHardening ? parseInt(looseRecord.jarsToHardening, 10) : undefined;
            
            const record: ParsedSubcultureRecord = {
                plantName: looseRecord.plantName,
                subcultureDate: formatDate(looseRecord.subcultureDate),
                doneBy: looseRecord.doneBy || 'N/A',
                jarsUsed: isNaN(jarsUsedNum) ? 0 : jarsUsedNum,
                ...(contaminatedJarsNum !== undefined && !isNaN(contaminatedJarsNum) && { contaminatedJars: contaminatedJarsNum }),
                ...(jarsToHardeningNum !== undefined && !isNaN(jarsToHardeningNum) && { jarsToHardening: jarsToHardeningNum }),
                ...(looseRecord.notes && { notes: looseRecord.notes }),
            };
            
            // Final validation against the strict schema
            const validationResult = ParsedSubcultureRecordSchema.safeParse(record);
            if (validationResult.success) {
                validatedRecords.push(validationResult.data);
            }
        }
        
        if(validatedRecords.length === 0) {
            throw new Error("AI could not extract any valid records. Please check the spreadsheet format.");
        }

        return { records: validatedRecords };

    } catch (error) {
        console.error('Error in sheet parsing action:', error);
        throw new Error('Failed to parse spreadsheet.');
    }
}
