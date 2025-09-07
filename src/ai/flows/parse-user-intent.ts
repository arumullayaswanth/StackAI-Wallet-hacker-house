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
  availableBalance: z.number().describe('The available balance of the user in STX.'),
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
  assetType: z.string().optional().describe('The type of asset to be transacted, if applicable (e.g., BTC, STX, USDT).'),
  investmentStrategy: z.string().optional().describe('The investment strategy to be used, if applicable.'),
  stockTicker: z.string().optional().describe('The stock ticker to invest in, if applicable.'),
  rationale: z.string().describe('The rationale behind the parsed intent.'),
  confidenceLevel: z.number().optional().describe('The confidence level of the stock prediction (0-1).'),
});
export type ParseUserIntentOutput = z.infer<typeof ParseUserIntentOutputSchema>;

const StockRecommendationInputSchema = z.object({
  availableBalance: z.number().describe('The available balance of the user in STX.'),
  investmentStrategy: z.string().optional().describe('User-provided investment strategy, if any.'),
});

const StockRecommendationOutputSchema = z.object({
  stockTicker: z.string().describe('The recommended stock ticker symbol (e.g., AAPL, GOOGL).'),
  predictedMovement: z.enum(['rise', 'fall']).describe('Whether the stock is predicted to rise or fall.'),
  confidenceLevel: z.number().min(0).max(1).describe('The confidence level of the prediction (0-1).'),
  rationale: z.string().describe('A brief rationale for the recommendation.'),
});

const getStockRecommendation = ai.defineTool(
  {
    name: 'getStockRecommendation',
    description: 'Recommends a stock to invest in based on market data, prediction logic, and user balance.',
    inputSchema: StockRecommendationInputSchema,
    outputSchema: StockRecommendationOutputSchema,
  },
  async (input) => {
    // In a real implementation, this would fetch real stock data and use a prediction model.
    console.log('Calling getStockRecommendation tool with input:', input);
    // This is mock data for demonstration purposes.
    const mockStocks = [
        { stockTicker: 'AAPL', predictedMovement: 'rise', confidenceLevel: 0.85, rationale: 'Strong quarterly earnings and new product announcements.' },
        { stockTicker: 'GOOGL', predictedMovement: 'rise', confidenceLevel: 0.78, rationale: 'Growth in cloud services and AI development.' },
        { stockTicker: 'TSLA', predictedMovement: 'fall', confidenceLevel: 0.65, rationale: 'Increased competition and production delays.' },
    ];
    const recommendedStock = mockStocks[Math.floor(Math.random() * mockStocks.length)];
    return recommendedStock;
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
  prompt: `You are an AI assistant for a Bitcoin wallet on the Stacks L2 blockchain. Your job is to parse user intent from natural language prompts and determine the appropriate action.

  You can perform the following actions:
  - TRANSFER: Send BTC, STX, or USDT to another address.
  - INVEST: Execute a simulated investment in stocks.
  - WITHDRAW: Withdraw funds (simulated).
  - SWAP: Swap between assets (simulated).
  - GET_BALANCE: Check the user's wallet balance.
  - UNKNOWN: If the intent is unclear.
  
  Your available STX balance is: {{{availableBalance}}}.

  Here are some examples:
  - Prompt: "Send 0.01 BTC to wallet ST28WZKE2AHRYV48TGJ6SPQ66E99553Z673X7B20V"
    - Parsed: { actionType: 'TRANSFER', targetAddress: 'ST28WZKE2AHRYV48TGJ6SPQ66E99553Z673X7B20V', amount: 0.01, assetType: 'BTC', rationale: "User wants to send 0.01 BTC." }
  - Prompt: "Transfer 25 STX to ST28WZKE2AHRYV48TGJ6SPQ66E99553Z673X7B20V"
    - Parsed: { actionType: 'TRANSFER', targetAddress: 'ST28WZKE2AHRYV48TGJ6SPQ66E99553Z673X7B20V', amount: 25, assetType: 'STX', rationale: "User wants to send 25 STX." }
  - Prompt: "Confirm and send 100 USDT from my balance to ST28WZKE2AHRYV48TGJ6SPQ66E99553Z673X7B20V"
    - Parsed: { actionType: 'TRANSFER', targetAddress: 'ST28WZKE2AHRYV48TGJ6SPQ66E99553Z673X7B20V', amount: 100, assetType: 'USDT', rationale: "User wants to send 100 USDT." }
  - Prompt: "Invest 50% of my balance in the top rising stock"
    - Parsed: { actionType: 'INVEST', investmentStrategy: "Top rising stock", amount: 50, rationale: "User wants to invest half their balance." }
    - Note: This would likely require using the getStockRecommendation tool.
  - Prompt: "What's my balance?"
    - Parsed: { actionType: 'GET_BALANCE', rationale: "User is asking for their balance." }

  If the user asks for an investment idea or to invest based on a strategy (e.g., "top rising stock"), use the 'getStockRecommendation' tool. The tool will provide a stock ticker, predicted movement, confidence, and rationale. Use this information to populate the 'stockTicker', and 'confidenceLevel' fields in your output.

  Now, parse the following prompt:
  "{{{prompt}}}"
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
