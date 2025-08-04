
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
  prompt: `You are an expert data extraction assistant for a plant tissue culture lab. Your task is to extract subculture data from the provided spreadsheet content and convert it into a structured JSON format.

The data represents subculture events. The columns might be in any order, but will likely have headers such as:
- 'Plant Name' (or 'Plant')
- 'Date' (or 'Subculture Date')
- 'Technician' (or 'Done By')
- 'Jars Used' (or 'Number of Jars')
- 'Contaminated Jars'
- 'Jars to Hardening'
- 'Notes'

Your task is to extract the text from each relevant column for each row.

**IMPORTANT RULES:**
1.  **ONLY extract rows that have a value for 'Plant Name', 'Date', and 'Jars Used'. If any of these three are missing for a row, SKIP THAT ROW ENTIRELY.**
2.  Do NOT perform any data type conversions. All extracted values must be strings.
3.  Extract the date text exactly as it appears in the source data. Do NOT reformat it.
4.  If a value for an OPTIONAL column (like 'Notes' or 'Contaminated Jars') is missing, simply omit the key for that record.
5.  The output must be a JSON object with a single key "records" which is an array of subculture objects.

Analyze the following spreadsheet data and extract the valid records:
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
