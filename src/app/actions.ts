
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

/**
 * Tries to parse a date string from a variety of common formats.
 * @param dateString The date string to parse.
 * @returns A Date object or null if parsing fails.
 */
function tryParseDate(dateString: string | undefined | null): Date | null {
    if (!dateString) return null;

    // List of common date formats to try, from most specific to most general
    const formats = [
        'MM/dd/yyyy',
        'yyyy-MM-dd',
        'dd/MM/yyyy',
        'MM-dd-yyyy',
        'dd-MM-yyyy',
        'M/d/yy',
        'M/d/yyyy',
        'MM/d/yyyy',
        'M/dd/yyyy',
        'yyyy/MM/dd',
        'dd.MM.yyyy',
        'MM.dd.yyyy',
        'd MMM yyyy', // 5 Jun 2024
        'dd MMM yyyy',// 05 Jun 2024
        'LLL dd, yyyy', // e.g., Jun 01, 2024
        'PP', // date-fns format for medium date
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
    
    // As a last resort, try the native Date constructor which is very flexible
    const nativeParsed = new Date(dateString);
    if(isValid(nativeParsed)) {
        return nativeParsed;
    }

    return null;
}

export async function performSheetParsing(sheetData: string): Promise<{ records: ParsedSubcultureRecord[] }> {
    try {
        const aiResult: ParseSubcultureSheetOutput = await parseSubcultureSheet({ sheetData });

        if (!aiResult || !aiResult.records) {
            throw new Error("AI parsing returned no data. Please ensure your sheet has content.");
        }
        
        const validatedRecords: ParsedSubcultureRecord[] = [];

        for (const looseRecord of aiResult.records) {
            const parsedDate = tryParseDate(looseRecord.subcultureDate);
            
            // Core validation: plantName, date, and jarsUsed are required.
            if (!looseRecord.plantName || !parsedDate || !looseRecord.jarsUsed) {
                continue; // Skip rows missing essential data
            }

            const jarsUsedNum = parseInt(looseRecord.jarsUsed, 10);
            if (isNaN(jarsUsedNum) || jarsUsedNum <= 0) {
                continue; // Skip if jarsUsed is not a positive number
            }

            const record: ParsedSubcultureRecord = {
                plantName: looseRecord.plantName,
                subcultureDate: format(parsedDate, 'yyyy-MM-dd'),
                doneBy: looseRecord.doneBy || 'N/A',
                jarsUsed: jarsUsedNum,
            };

            if (looseRecord.contaminatedJars) {
                const contaminatedNum = parseInt(looseRecord.contaminatedJars, 10);
                if (!isNaN(contaminatedNum)) {
                    record.contaminatedJars = contaminatedNum;
                }
            }

            if (looseRecord.jarsToHardening) {
                const toHardeningNum = parseInt(looseRecord.jarsToHardening, 10);
                if (!isNaN(toHardeningNum)) {
                    record.jarsToHardening = toHardeningNum;
                }
            }

            if(looseRecord.notes) {
                record.notes = looseRecord.notes;
            }

            // Final check against the strict schema
            const finalCheck = ParsedSubcultureRecordSchema.safeParse(record);
            if (finalCheck.success) {
                validatedRecords.push(finalCheck.data);
            }
        }
        
        if (validatedRecords.length === 0) {
            throw new Error("AI could not extract any valid records. Please check the spreadsheet format and ensure it contains columns for 'plantName', 'subcultureDate', and 'jarsUsed' with valid data.");
        }

        return { records: validatedRecords };

    } catch (error) {
        console.error('Error in sheet parsing action:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to parse spreadsheet.');
    }
}
