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
          response = `Okay, I'm preparing to transfer ${intent.amount} ${intent.assetType} to ${intent.targetAddress}. Please confirm the transaction in your wallet.`;
        } else {
          response = "I understand you want to make a transfer, but I need more details like the amount, asset, and recipient.";
        }
        break;
      case 'INVEST':
         if (intent.stockTicker) {
            response = `Based on my analysis, I recommend investing in ${intent.stockTicker}. The prediction is a price rise with a confidence level of ${intent.confidenceLevel ? (intent.confidenceLevel*100).toFixed(0) : 'N/A'}%. Shall I proceed with the investment?`;
        } else if (intent.investmentStrategy) {
          response = `Okay, I will execute the investment strategy: "${intent.investmentStrategy}". I will use a portion of your ${availableBalance} STX balance.`;
        } else {
           response = "I understand you want to invest, but could you specify a strategy or ask for a stock recommendation?";
        }
        break;
      case 'GET_BALANCE':
        response = `Your current available balance is ${availableBalance} STX.`;
        break;
      case 'WITHDRAW':
        if(intent.amount && intent.assetType) {
            response = `I am preparing to withdraw ${intent.amount} ${intent.assetType}. Please confirm.`;
        } else {
            response = "I understand you want to withdraw, but please specify the amount and asset type.";
        }
        break;
      case 'SWAP':
        response = `Swap functionality is not fully implemented yet, but I understand you want to perform a swap. ${intent.rationale}`;
        break;
      case 'UNKNOWN':
      default:
        response = `I'm not sure how to handle that request. Can you please rephrase? My capabilities include transferring tokens, making simulated investments, and checking your balance.`;
        break;
    }

    return response;

  } catch (error) {
    console.error("Error parsing user intent:", error);
    return "Sorry, I encountered an error while processing your request. Please try again.";
  }
}
