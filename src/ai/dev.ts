import { config } from 'dotenv';
config();

import '@/ai/flows/automated-stock-investment-decisions.ts';
import '@/ai/flows/parse-user-intent.ts';
import '@/ai/flows/agent-flow.ts';
import '@/ai/flows/get-daily-stock-report.ts';
