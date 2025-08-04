
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

The data represents subculture events. The columns might be in any order, but will have headers like 'Plant Name', 'Date', 'Technician', 'Jars Used', 'Contaminated Jars', 'Jars to Hardening', 'Notes'.

- Your primary goal is to extract the text as-is from each relevant column for each row.
- Do NOT perform any data type conversions. All extracted values should be strings.
- Do NOT try to interpret or convert date formats. Extract the date text exactly as it appears in the source data.
- If a value is missing or a column is not present for a record, omit the corresponding key from the JSON object for that record. Do not include keys with null or empty string values.
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
