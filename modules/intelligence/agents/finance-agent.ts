import { BaseAgent } from './base-agent';
import type { LLMProvider } from '../types';
import { INSIGHT_GENERATION_SYSTEM_PROMPT, FINANCE_INSIGHTS_PROMPT } from '../prompts';

export class FinanceAgent extends BaseAgent {
  constructor(provider: LLMProvider) {
    super(
      'FinanceAgent',
      'Analyzes financial data to generate insights about spending, budgets, and balance',
      provider
    );
  }

  async generateInsights(data: {
    expenses: any[];
    income: any[];
    budgets: any[];
    balance: number;
  }): Promise<string> {
    return this.generateResponse(
      INSIGHT_GENERATION_SYSTEM_PROMPT,
      FINANCE_INSIGHTS_PROMPT(data)
    );
  }
}
