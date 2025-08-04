import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-contamination.ts';
import '@/ai/flows/generate-lab-report.ts';
import '@/ai/flows/parse-subculture-sheet.ts';
