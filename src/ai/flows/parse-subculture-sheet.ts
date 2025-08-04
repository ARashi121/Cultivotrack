
'use server';
/**
 * @fileOverview Parses a spreadsheet of subculture data using AI.
 *
 * - parseSubcultureSheet - A function that handles parsing subculture data from a string.
 * - ParseSubcultureSheetInput - The input type for the parseSubcultureSheet function.
 * - ParseSubcultureSheetOutput - The return type for the parseSubcultureSheet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ParsedSubcultureRecordSchema } from '@/lib/types';


const ParseSubcultureSheetInputSchema = z.object({
  sheetData: z.string().describe("The string content of a spreadsheet (e.g., CSV) containing subculture records."),
});
export type ParseSubcultureSheetInput = z.infer<typeof ParseSubcultureSheetInputSchema>;

const ParseSubcultureSheetOutputSchema = z.object({
  records: z.array(ParsedSubcultureRecordSchema),
});
export type ParseSubcultureSheetOutput = z.infer<typeof ParseSubcultureSheetOutputSchema>;

export async function parseSubcultureSheet(
  input: ParseSubcultureSheetInput
): Promise<ParseSubcultureSheetOutput> {
  return parseSubcultureSheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseSubcultureSheetPrompt',
  input: {schema: ParseSubcultureSheetInputSchema},
  output: {schema: ParseSubcultureSheetOutputSchema},
  prompt: `You are an expert data entry assistant for a plant tissue culture lab. Your task is to parse the provided spreadsheet data and convert it into a structured JSON format.

The data represents subculture events. The columns might be in any order, but will have headers like 'Plant', 'Date', 'Technician', 'Media', 'Jars', 'Contaminated', 'To Hardening', 'Notes'.

- Interpret various date formats (e.g., "mm/dd/yyyy", "dd-mon-yy") and convert them to "YYYY-MM-DD".
- If a value is missing for an optional field (contaminatedJars, jarsToHardening, notes), omit it from the final JSON object for that record.
- The output must be a JSON object with a single key "records" which is an array of subculture objects.

Analyze the following spreadsheet data:
\`\`\`
{{{sheetData}}}
\`\`\`
`,
});

const parseSubcultureSheetFlow = ai.defineFlow(
  {
    name: 'parseSubcultureSheetFlow',
    inputSchema: ParseSubcultureSheetInputSchema,
    outputSchema: ParseSubcultureSheetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
