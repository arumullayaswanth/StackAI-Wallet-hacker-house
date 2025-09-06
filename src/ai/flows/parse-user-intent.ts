'use server';

/**
 * @fileOverview Parses user intent from natural language prompts to determine the desired blockchain transaction.
 *
 * - parseUserIntent - A function that parses user intent and returns the action to be taken.
 * - ParseUserIntentInput - The input type for the parseUserIntent function.
 * - ParseUserIntentOutput - The return type for the parseUserIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseUserIntentInputSchema = z.object({
  prompt: z.string().describe('The user prompt to parse.'),
  availableBalance: z.number().describe('The available balance of the user.'),
});
export type ParseUserIntentInput = z.infer<typeof ParseUserIntentInputSchema>;

const ActionTypeSchema = z.enum([
  'TRANSFER',
  'INVEST',
  'WITHDRAW',
  'SWAP',
  'GET_BALANCE',
  'UNKNOWN',
]);

const ParseUserIntentOutputSchema = z.object({
  actionType: ActionTypeSchema.describe('The action type to be taken.'),
  targetAddress: z.string().optional().describe('The target address for the transaction, if applicable.'),
  amount: z.number().optional().describe('The amount to be transacted, if applicable.'),
  assetType: z.string().optional().describe('The type of asset to be transacted, if applicable (e.g., BTC, STX).'),
  investmentStrategy: z.string().optional().describe('The investment strategy to be used, if applicable.'),
  stockTicker: z.string().optional().describe('The stock ticker to invest in, if applicable.'),
  rationale: z.string().describe('The rationale behind the parsed intent.'),
});
export type ParseUserIntentOutput = z.infer<typeof ParseUserIntentOutputSchema>;

const StockRecommendationInputSchema = z.object({
  availableBalance: z.number().describe('The available balance of the user.'),
});

const StockRecommendationOutputSchema = z.object({
  stockTicker: z.string().describe('The stock ticker symbol.'),
  predictedMovement: z.string().describe('Whether the stock is predicted to rise or fall.'),
  confidenceLevel: z.number().describe('The confidence level of the prediction (0-1).'),
});

const getStockRecommendation = ai.defineTool(
  {
    name: 'getStockRecommendation',
    description: 'Recommends a stock based on market data and prediction logic.',
    inputSchema: StockRecommendationInputSchema,
    outputSchema: StockRecommendationOutputSchema,
  },
  async (input) => {
    // Placeholder implementation for stock recommendation
    //In a real implementation, this would fetch stock data and make predictions.
    console.log('Calling getStockRecommendation tool', input);
    return {
      stockTicker: 'PLACEHOLDER',
      predictedMovement: 'rise',
      confidenceLevel: 0.75,
    };
  }
);

export async function parseUserIntent(input: ParseUserIntentInput): Promise<ParseUserIntentOutput> {
  return parseUserIntentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseUserIntentPrompt',
  input: {
    schema: ParseUserIntentInputSchema,
  },
  output: {
    schema: ParseUserIntentOutputSchema,
  },
  tools: [getStockRecommendation],
  prompt: `You are an AI assistant designed to parse user intent from natural language prompts and determine the appropriate action to take regarding their Bitcoin wallet on the Stacks blockchain.

  Here are some example prompts and their corresponding parsed intents:

  - Prompt: \"Transfer 0.01 BTC to Alice's wallet\"
    - actionType: TRANSFER
    - targetAddress: Alice's wallet address (parse from prompt if present, otherwise leave blank)
    - amount: 0.01
    - assetType: BTC

  - Prompt: \"Invest in the top 3 rising stocks with 50% of my balance\"
    - actionType: INVEST
    - investmentStrategy: Top 3 rising stocks
    - amount: 50% of available balance

  - Prompt: \"What is my current balance?\"
    - actionType: GET_BALANCE

  - Prompt: \"Withdraw 100 STX\"
   - actionType: WITHDRAW
   - amount: 100
   - assetType: STX

  Your available balance is: {{{availableBalance}}}.

  Now, parse the following prompt:

  Prompt: {{{prompt}}}

  The current tool for making stock recommendations is:
  {{tool_description tool=getStockRecommendation}}
  Should you use the tool, make sure to set stockTicker, and predictedMovement based on the recommendation.

  Output (JSON):
  `, 
});

const parseUserIntentFlow = ai.defineFlow(
  {
    name: 'parseUserIntentFlow',
    inputSchema: ParseUserIntentInputSchema,
    outputSchema: ParseUserIntentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
