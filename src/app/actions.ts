'use server';

import { parseUserIntent, ParseUserIntentOutput } from '@/ai/flows/parse-user-intent';

export type ActionResponse = {
  text: string;
  transaction?: {
    action: 'transfer';
    asset: 'STX' | 'BTC' | 'USDT';
    amount: number;
    recipient: string;
  };
};

export async function handleUserPrompt(prompt: string, availableBalance: number): Promise<ActionResponse> {
  if (!prompt) {
    return { text: "Please enter a command." };
  }

  try {
    const intent: ParseUserIntentOutput = await parseUserIntent({
      prompt,
      availableBalance,
    });

    let response: ActionResponse = { text: `Intent: ${intent.actionType}. ${intent.rationale}` };
    
    switch (intent.actionType) {
      case 'TRANSFER':
        if (intent.amount && intent.assetType && intent.targetAddress) {
          response = {
            text: `I'm preparing to transfer ${intent.amount} ${intent.assetType} to ${intent.targetAddress}. Please confirm the transaction.`,
            transaction: {
              action: 'transfer',
              asset: intent.assetType as 'STX' | 'BTC' | 'USDT',
              amount: intent.amount,
              recipient: intent.targetAddress,
            }
          };
        } else {
          response = { text: "I see you want to make a transfer. To proceed, please provide the amount, asset (BTC, STX, or USDT), and the recipient's address."};
        }
        break;
      case 'INVEST':
         if (intent.stockTicker) {
            response = { text: `Based on my analysis, a good investment could be ${intent.stockTicker}. The prediction is a price rise with a confidence level of ${intent.confidenceLevel ? (intent.confidenceLevel*100).toFixed(0) : 'N/A'}%. Shall I proceed with a simulated investment?` };
        } else if (intent.investmentStrategy) {
          response = { text: `Okay, I will execute the investment strategy: "${intent.investmentStrategy}". I will use a portion of your ${availableBalance} STX balance for a simulated trade.` };
        } else {
           response = { text: "I understand you want to invest. You can ask me for a stock recommendation or specify an investment strategy." };
        }
        break;
      case 'GET_BALANCE':
        response = { text: `Your current available balance is approximately ${availableBalance} STX.` };
        break;
      case 'WITHDRAW':
        if(intent.amount && intent.assetType) {
            response = { text: `I am preparing to withdraw ${intent.amount} ${intent.assetType}. Please confirm.` };
        } else {
            response = { text: "I understand you want to withdraw. Please specify the amount and asset type (e.g. BTC or STX)."};
        }
        break;
      case 'SWAP':
        response = { text: `Swap functionality is not yet implemented, but I understand you want to perform a swap. ${intent.rationale}` };
        break;
      case 'UNKNOWN':
      default:
        response = { text: `I'm not quite sure how to handle that. I can help with transfers, simulated investments, and checking your balance. Could you please rephrase your request?` };
        break;
    }

    return response;

  } catch (error) {
    console.error("Error parsing user intent:", error);
    return { text: "Sorry, I had trouble understanding that. Please try again." };
  }
}
