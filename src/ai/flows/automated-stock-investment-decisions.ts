'use server';
/**
 * @fileOverview This file defines a Genkit flow for making automated stock investment decisions based on user-defined rules and stock market predictions.
 *
 * - automatedStockInvestmentDecisions - A function that orchestrates the stock investment process.
 * - AutomatedStockInvestmentDecisionsInput - The input type for the automatedStockInvestmentDecisions function.
 * - AutomatedStockInvestmentDecisionsOutput - The return type for the automatedStockInvestmentDecisions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedStockInvestmentDecisionsInputSchema = z.object({
  investmentAmount: z.number().describe('The amount of funds available for investment.'),
  rules: z.string().describe('Predefined rules for investment decisions, such as risk tolerance and desired return.'),
  stockDataApiType: z
    .enum(['YahooFinance', 'AlphaVantage'])
    .describe('The type of API to use for fetching stock market data.'),
});
export type AutomatedStockInvestmentDecisionsInput = z.infer<
  typeof AutomatedStockInvestmentDecisionsInputSchema
>;

const StockPredictionSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock.'),
  predictedChange: z.number().describe('The predicted percentage change in the stock price.'),
  confidence: z.number().describe('The confidence level of the prediction (0-1).'),
});

const AutomatedStockInvestmentDecisionsOutputSchema = z.object({
  investmentDecision: z
    .string()
    .describe(
      'A description of the investment decision, including which stocks to buy/sell and the rationale.'
    ),
  transactions: z.array(
    z.object({
      ticker: z.string().describe('The ticker symbol of the stock bought or sold.'),
      action: z.enum(['buy', 'sell']).describe('The action taken (buy or sell).'),
      quantity: z.number().describe('The number of shares bought or sold.'),
      price: z.number().describe('The price per share.'),
    })
  ),
});
export type AutomatedStockInvestmentDecisionsOutput = z.infer<
  typeof AutomatedStockInvestmentDecisionsOutputSchema
>;

export async function automatedStockInvestmentDecisions(
  input: AutomatedStockInvestmentDecisionsInput
): Promise<AutomatedStockInvestmentDecisionsOutput> {
  return automatedStockInvestmentDecisionsFlow(input);
}

const shouldInvestTool = ai.defineTool({
  name: 'shouldInvest',
  description: 'Determines whether to invest in a given stock based on its predicted change and confidence.',
  inputSchema: StockPredictionSchema,
  outputSchema: z.boolean().describe('Whether or not investment in the stock is recommended.'),
},
async (input) => {
  // Implement logic to determine if investment is recommended based on predicted change and confidence.
  // Example: Only invest if predictedChange > 0.05 (5%) and confidence > 0.7.
  return input.predictedChange > 0.05 && input.confidence > 0.7;
});

const prompt = ai.definePrompt({
  name: 'automatedStockInvestmentDecisionsPrompt',
  input: {schema: z.object({
      ...AutomatedStockInvestmentDecisionsInputSchema.shape,
      mockStockData: z.array(StockPredictionSchema).describe('A list of mock stock predictions to analyze.')
  })},
  output: {schema: AutomatedStockInvestmentDecisionsOutputSchema},
  tools: [shouldInvestTool],
  prompt: `You are an AI investment advisor. You will analyze the provided stock market data and make automated investment decisions based on the user's predefined rules.

  Investment Amount: {{investmentAmount}}
  Investment Rules: {{rules}}
  Stock Data API: {{stockDataApiType}}

  Analyze the following stock data:
  {{#each mockStockData}}
  - Ticker: {{ticker}}, Predicted Change: {{predictedChange}}, Confidence: {{confidence}}
  {{/each}}

  Based on the available investment amount, rules, and the provided stock market data, provide an investment decision.
  For each stock, use the shouldInvest tool to determine if investment is recommended.
  Output a description of the investment decision, including which stocks to buy/sell and the rationale.
  Also, provide a list of transactions to execute (ticker, action, quantity, price).
  `,
});

const automatedStockInvestmentDecisionsFlow = ai.defineFlow(
  {
    name: 'automatedStockInvestmentDecisionsFlow',
    inputSchema: AutomatedStockInvestmentDecisionsInputSchema,
    outputSchema: AutomatedStockInvestmentDecisionsOutputSchema,
  },
  async input => {
     // In a real application, you would fetch this data from the specified API.
    // For demonstration, we'll use mock data.
    const mockStockData = [
        { ticker: 'AAPL', predictedChange: 0.07, confidence: 0.85 },
        { ticker: 'GOOGL', predictedChange: 0.04, confidence: 0.9 },
        { ticker: 'TSLA', predictedChange: -0.02, confidence: 0.6 },
        { ticker: 'MSFT', predictedChange: 0.06, confidence: 0.75 },
    ];

    const {output} = await prompt({...input, mockStockData});
    if (!output) {
      throw new Error('The AI failed to generate an investment decision.');
    }
    return output;
  }
);
