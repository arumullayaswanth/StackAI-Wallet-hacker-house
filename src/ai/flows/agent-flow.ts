'use server';
/**
 * @fileOverview A set of AI agents that can be invoked to perform tasks.
 *
 * - agentFlow - A function that handles the agent invocation process.
 * - AgentFlowInput - The input type for the agentFlow function.
 * - AgentFlowOutput - The return type for the agentFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AgentFlowInputSchema = z.object({
  agentId: z.string().describe('The ID of the agent to invoke.'),
  agentInput: z.any().describe('The input to pass to the agent.'),
});
export type AgentFlowInput = z.infer<typeof AgentFlowInputSchema>;

const AgentFlowOutputSchema = z.object({
  agentId: z.string().describe('The ID of the invoked agent.'),
  agentOutput: z.any().describe('The output from the agent.'),
  error: z.string().optional().describe('Any error that occurred.'),
});
export type AgentFlowOutput = z.infer<typeof AgentFlowOutputSchema>;

export async function agentFlow(
  input: AgentFlowInput
): Promise<AgentFlowOutput> {
  return agentFlow(input);
}

const agentFlowFlow = ai.defineFlow(
  {
    name: 'agentFlow',
    inputSchema: AgentFlowInputSchema,
    outputSchema: AgentFlowOutputSchema,
  },
  async (input) => {
    try {
      // In a real implementation, you would have a registry of agents
      // and invoke the correct one based on agentId.
      const agentOutput = {
        message: 'Agent invoked successfully.',
        input: input.agentInput,
      };

      return {
        agentId: input.agentId,
        agentOutput,
      };
    } catch (error: any) {
      return {
        agentId: input.agentId,
        agentOutput: null,
        error: error.message,
      };
    }
  }
);
