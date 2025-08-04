
'use server';

import { analyzeContamination, AnalyzeContaminationOutput } from '@/ai/flows/analyze-contamination';
import { generateLabReport, GenerateLabReportInput, GenerateLabReportOutput } from '@/ai/flows/generate-lab-report';
import { parseSubcultureSheet, ParseSubcultureSheetOutput } from '@/ai/flows/parse-subculture-sheet';
import { ParsedSubcultureRecord, ParsedSubcultureRecordSchema } from '@/lib/types';
import { z } from 'zod';
import { format, parse, isValid } from 'date-fns';

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

function tryParseDate(dateString: string): Date | null {
    if (!dateString) return null;

    // List of common date formats to try
    const formats = [
        'yyyy-MM-dd',
        'MM/dd/yyyy',
        'dd/MM/yyyy',
        'MM-dd-yyyy',
        'dd-MM-yyyy',
        'M/d/yy',
        'M/d/yyyy',
        'LLL dd, yyyy', // e.g., Jun 01, 2024
    ];

    for (const fmt of formats) {
        try {
            const parsedDate = parse(dateString, fmt, new Date());
            if (isValid(parsedDate)) {
                return parsedDate;
            }
        } catch (e) {
            // Ignore parsing errors and try the next format
        }
    }
    
    // As a last resort, try the native Date constructor
    const nativeParsed = new Date(dateString);
    if(isValid(nativeParsed)) {
        return nativeParsed;
    }

    return null;
}

export async function performSheetParsing(sheetData: string): Promise<{ records: ParsedSubcultureRecord[] }> {
    try {
        const aiResult: ParseSubcultureSheetOutput = await parseSubcultureSheet({ sheetData });

        if (!aiResult || !aiResult.records || aiResult.records.length === 0) {
            throw new Error("AI parsing returned no valid records. Please ensure your sheet has 'plantName', 'subcultureDate', and 'jarsUsed' columns.");
        }

        const validatedRecords: ParsedSubcultureRecord[] = aiResult.records.map(looseRecord => {
             const parsedDate = tryParseDate(looseRecord.subcultureDate || '');
             const jarsUsedNum = parseInt(looseRecord.jarsUsed || '0', 10);

             return {
                plantName: looseRecord.plantName || 'N/A',
                subcultureDate: parsedDate ? format(parsedDate, 'yyyy-MM-dd') : 'Invalid Date',
                doneBy: looseRecord.doneBy || 'N/A',
                jarsUsed: isNaN(jarsUsedNum) ? 0 : jarsUsedNum,
                contaminatedJars: looseRecord.contaminatedJars ? parseInt(looseRecord.contaminatedJars, 10) : undefined,
                jarsToHardening: looseRecord.jarsToHardening ? parseInt(looseRecord.jarsToHardening, 10) : undefined,
                notes: looseRecord.notes,
             };
        }).filter(record => record.plantName !== 'N/A' && record.subcultureDate !== 'Invalid Date' && record.jarsUsed > 0);
        

        if(validatedRecords.length === 0) {
            throw new Error("AI could not extract any valid records. Please check the spreadsheet format and column headers.");
        }

        // Final validation against the strict schema to be safe
        const finalValidatedRecords = z.array(ParsedSubcultureRecordSchema).safeParse(validatedRecords);

        if (!finalValidatedRecords.success) {
            console.error("Final validation failed:", finalValidatedRecords.error);
            throw new Error("Some records had an invalid format after parsing.");
        }


        return { records: finalValidatedRecords.data };

    } catch (error) {
        console.error('Error in sheet parsing action:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to parse spreadsheet.');
    }
}
