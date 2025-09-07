'use server';
/**
 * @fileOverview This file defines a Genkit flow for fetching a daily stock market report, including top gainers and losers.
 *
 * - getDailyStockReport - A function that fetches the daily stock market report.
 * - DailyStockReportOutput - The return type for the getDailyStockReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StockMoverSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock.'),
  name: z.string().describe('The name of the company.'),
  price: z.string().describe('The current price of the stock.'),
  change: z.string().describe('The dollar change in the stock price.'),
  percentChange: z.string().describe('The percentage change in the stock price.'),
});

const DailyStockReportOutputSchema = z.object({
  topGainers: z.array(StockMoverSchema).describe('A list of the top-gaining stocks for the day.'),
  topLosers: z.array(StockMoverSchema).describe('A list of the top-losing stocks for the day.'),
});
export type DailyStockReportOutput = z.infer<typeof DailyStockReportOutputSchema>;

export async function getDailyStockReport(): Promise<DailyStockReportOutput> {
  return getDailyStockReportFlow();
}

const getDailyStockReportFlow = ai.defineFlow(
  {
    name: 'getDailyStockReportFlow',
    outputSchema: DailyStockReportOutputSchema,
  },
  async () => {
    // In a real application, you would fetch this data from a live stock market API.
    // For demonstration purposes, we are using mock data.
    const mockReport: DailyStockReportOutput = {
      topGainers: [
        { ticker: 'NVDA', name: 'NVIDIA Corp', price: '$125.50', change: '+$10.20', percentChange: '+8.85%' },
        { ticker: 'AAPL', name: 'Apple Inc.', price: '$215.10', change: '+$5.60', percentChange: '+2.67%' },
        { ticker: 'AMZN', name: 'Amazon.com, Inc.', price: '$189.30', change: '+$4.50', percentChange: '+2.43%' },
      ],
      topLosers: [
        { ticker: 'TSLA', name: 'Tesla, Inc.', price: '$180.45', change: '-$5.60', percentChange: '-3.01%' },
        { ticker: 'PFE', name: 'Pfizer Inc.', price: '$27.80', change: '-$1.15', percentChange: '-3.97%' },
        { ticker: 'BA', name: 'The Boeing Company', price: '$175.20', change: '-$3.90', percentChange: '-2.18%' },
      ],
    };
    return mockReport;
  }
);
