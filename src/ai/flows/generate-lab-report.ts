
'use server';
/**
 * @fileOverview Generates a comprehensive lab performance report.
 *
 * - generateLabReport - A function that analyzes plant and hardening data to generate insights.
 * - GenerateLabReportInput - The input type for the generateLabReport function.
 * - GenerateLabReportOutput - The return type for the generateLabReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Plant, HardeningEvent } from '@/lib/types';

const GenerateLabReportInputSchema = z.object({
  plants: z.any().describe("An array of all plant data objects."),
  hardeningData: z.any().describe("An array of all hardening event data objects."),
});
export type GenerateLabReportInput = z.infer<typeof GenerateLabReportInputSchema>;

const GenerateLabReportOutputSchema = z.object({
  report: z.string().describe("A markdown-formatted report summarizing the lab's performance."),
});
export type GenerateLabReportOutput = z.infer<typeof GenerateLabReportOutputSchema>;

export async function generateLabReport(
  input: GenerateLabReportInput
): Promise<GenerateLabReportOutput> {
  return generateLabReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLabReportPrompt',
  input: {schema: GenerateLabReportInputSchema},
  output: {schema: GenerateLabReportOutputSchema},
  prompt: `You are an expert plant tissue culture lab analyst. Your task is to analyze the provided data and generate a concise, insightful report on the lab's performance. The report should be in markdown format.

Analyze the following data:
- All plant data, including TC plants, protocol development experiments, and subculture histories.
- All hardening and acclimatization data.

Based on the data, your report should cover these key areas:

1.  **Media Performance Analysis:**
    *   Identify the most and least successful media types for TC plants. Consider factors like subculture frequency and implied success (e.g., jars transferred to hardening vs. contaminated jars).
    *   Suggest the best-performing media combinations based on the available data.

2.  **Contamination Trends:**
    *   Analyze contamination rates across different plants and media types.
    *   If technician data were available, you would analyze performance per technician. For now, focus on plants and media.
    *   Highlight any significant contamination trends or hotspots.

3.  **Protocol Success/Failure:**
    *   Review the protocol development experiments.
    *   Flag protocols that are consistently marked as 'failed'.
    *   Highlight protocols that are marked as 'success' or are 'ongoing' with positive observations (e.g., shoot/root formation, successful subcultures).

4.  **Hardening & Transfer Success:**
    *   Analyze the success rate of plants being transferred to hardening.
    *   Calculate the overall success rates for the acclimatization and growth stages.

Structure your response clearly with headings for each section. Be data-driven and provide specific examples from the provided data to support your analysis.

**Plant Data:**
\`\`\`json
{{{json plants}}}
\`\`\`

**Hardening Data:**
\`\`\`json
{{{json hardeningData}}}
\`\`\`
`,
});

const generateLabReportFlow = ai.defineFlow(
  {
    name: 'generateLabReportFlow',
    inputSchema: GenerateLabReportInputSchema,
    outputSchema: GenerateLabReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
