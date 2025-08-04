// Implemented Genkit flow for analyzing contamination in plant culture images.

'use server';

/**
 * @fileOverview Analyzes images of plant cultures for contamination.
 *
 * - analyzeContamination - A function that handles the contamination analysis process.
 * - AnalyzeContaminationInput - The input type for the analyzeContamination function.
 * - AnalyzeContaminationOutput - The return type for the analyzeContamination function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeContaminationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the plant culture, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeContaminationInput = z.infer<typeof AnalyzeContaminationInputSchema>;

const AnalyzeContaminationOutputSchema = z.object({
  contaminationAnalysis: z.object({
    isContaminated: z.boolean().describe('Whether or not the plant culture is contaminated.'),
    contaminants: z.string().describe('The likely contaminants found in the plant culture.'),
    confidence: z
      .number()
      .describe(
        'The confidence level of the contamination analysis, represented as a decimal between 0 and 1.'
      ),
  }),
});
export type AnalyzeContaminationOutput = z.infer<typeof AnalyzeContaminationOutputSchema>;

export async function analyzeContamination(
  input: AnalyzeContaminationInput
): Promise<AnalyzeContaminationOutput> {
  return analyzeContaminationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeContaminationPrompt',
  input: {schema: AnalyzeContaminationInputSchema},
  output: {schema: AnalyzeContaminationOutputSchema},
  prompt: `You are an expert plant pathologist specializing in identifying contamination in plant tissue cultures.

You will analyze the provided image to assess potential contamination. You will determine whether the plant culture is contaminated or not, identify the likely contaminants, and provide a confidence level for your analysis.

Analyze the following image for contamination:

{{media url=photoDataUri}}`,
});

const analyzeContaminationFlow = ai.defineFlow(
  {
    name: 'analyzeContaminationFlow',
    inputSchema: AnalyzeContaminationInputSchema,
    outputSchema: AnalyzeContaminationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
