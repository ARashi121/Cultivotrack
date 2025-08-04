
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
import { LooseParsedSubcultureRecordSchema } from '@/lib/types';


const ParseSubcultureSheetInputSchema = z.object({
  sheetData: z.string().describe("The string content of a spreadsheet (e.g., CSV) containing subculture records."),
});
export type ParseSubcultureSheetInput = z.infer<typeof ParseSubcultureSheetInputSchema>;

const ParseSubcultureSheetOutputSchema = z.object({
  records: z.array(LooseParsedSubcultureRecordSchema),
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
  prompt: `You are an expert data extraction assistant. Your task is to extract subculture data from the provided spreadsheet content and convert it into a structured JSON array.

The data represents subculture events. The column headers might have slightly different names, but map them to the following keys:
- 'plantName': The name of the plant.
- 'subcultureDate': The date of the event.
- 'doneBy': The name of the technician.
- 'jarsUsed': The number of jars used.
- 'contaminatedJars': Number of jars that were contaminated.
- 'jarsToHardening': Number of jars moved to hardening.
- 'notes': Any additional notes.

**CRITICAL RULES:**
1.  **Extract data from EVERY row**, even if it looks incomplete. The user will validate it later.
2.  Return ALL extracted values as **strings**. Do NOT convert data types.
3.  Extract the date text **exactly as it appears**. Do NOT reformat it.
4.  If a cell for a given column is empty, simply omit the key for that record in the JSON output.
5.  The final output MUST be a JSON object with a single key "records", which contains an array of the extracted data objects.

Spreadsheet Data:
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
