'use server';

import { parseUserIntent, ParseUserIntentOutput } from '@/ai/flows/parse-user-intent';

// Mock balance
const availableBalance = 1200; // Let's use STX balance as default

export async function handleUserPrompt(prompt: string): Promise<string> {
  if (!prompt) {
    return "Please enter a command.";
  }

  try {
    const intent: ParseUserIntentOutput = await parseUserIntent({
      prompt,
      availableBalance,
    });

    let response = `Intent: ${intent.actionType}. ${intent.rationale}`;
    
    switch (intent.actionType) {
      case 'TRANSFER':
        if (intent.amount && intent.assetType && intent.targetAddress) {
          response = `I'm preparing to transfer ${intent.amount} ${intent.assetType} to ${intent.targetAddress}. Please confirm the transaction.`;
        } else {
          response = "I see you want to make a transfer. To proceed, please provide the amount, asset (BTC or STX), and the recipient's address.";
        }
        break;
      case 'INVEST':
         if (intent.stockTicker) {
            response = `Based on my analysis, a good investment could be ${intent.stockTicker}. The prediction is a price rise with a confidence level of ${intent.confidenceLevel ? (intent.confidenceLevel*100).toFixed(0) : 'N/A'}%. Shall I proceed with a simulated investment?`;
        } else if (intent.investmentStrategy) {
          response = `Okay, I will execute the investment strategy: "${intent.investmentStrategy}". I will use a portion of your ${availableBalance} STX balance for a simulated trade.`;
        } else {
           response = "I understand you want to invest. You can ask me for a stock recommendation or specify an investment strategy.";
        }
        break;
      case 'GET_BALANCE':
        response = `Your current available balance is approximately ${availableBalance} STX.`;
        break;
      case 'WITHDRAW':
        if(intent.amount && intent.assetType) {
            response = `I am preparing to withdraw ${intent.amount} ${intent.assetType}. Please confirm.`;
        } else {
            response = "I understand you want to withdraw. Please specify the amount and asset type (e.g. BTC or STX).";
        }
        break;
      case 'SWAP':
        response = `Swap functionality is not yet implemented, but I understand you want to perform a swap. ${intent.rationale}`;
        break;
      case 'UNKNOWN':
      default:
        response = `I'm not quite sure how to handle that. I can help with transfers, simulated investments, and checking your balance. Could you please rephrase your request?`;
        break;
    }

    return response;

  } catch (error) {
    console.error("Error parsing user intent:", error);
    return "Sorry, I had trouble understanding that. Please try again.";
  }
}
