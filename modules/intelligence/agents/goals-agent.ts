import { BaseAgent } from './base-agent';
import type { LLMProvider } from '../types';
import { INSIGHT_GENERATION_SYSTEM_PROMPT, GOALS_INSIGHTS_PROMPT } from '../prompts';

export class GoalsAgent extends BaseAgent {
  constructor(provider: LLMProvider) {
    super(
      'GoalsAgent',
      'Analyzes goal data to track progress and suggest optimizations',
      provider
    );
  }

  async generateInsights(data: {
    goals: any[];
    contributions: any[];
  }): Promise<string> {
    return this.generateResponse(
      INSIGHT_GENERATION_SYSTEM_PROMPT,
      GOALS_INSIGHTS_PROMPT(data)
    );
  }
}
