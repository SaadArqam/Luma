import { BaseAgent } from './base-agent';
import type { LLMProvider, Insight } from '../types';
import { FinanceAgent } from './finance-agent';
import { GoalsAgent } from './goals-agent';
import { TimelineAgent } from './timeline-agent';
import { GenerateInsightsResponseSchema, type GenerateInsightsResponse } from '../schemas';
import { INSIGHT_GENERATION_SYSTEM_PROMPT } from '../prompts';

export class InsightAgent extends BaseAgent {
  private financeAgent: FinanceAgent;
  private goalsAgent: GoalsAgent;
  private timelineAgent: TimelineAgent;

  constructor(provider: LLMProvider) {
    super(
      'InsightAgent',
      'Orchestrates other agents to generate comprehensive insights',
      provider
    );
    this.financeAgent = new FinanceAgent(provider);
    this.goalsAgent = new GoalsAgent(provider);
    this.timelineAgent = new TimelineAgent(provider);
  }

  async generateAllInsights(data: {
    finance: { expenses: any[]; income: any[]; budgets: any[]; balance: number };
    goals: { goals: any[]; contributions: any[] };
    timeline: { events: any[] };
  }): Promise<Insight[]> {
    // For now, let's just use a combined approach - in the future we could run agents in parallel
    const allData = { ...data.finance, ...data.goals, ...data.timeline };
    
    const combinedPrompt = `
    Analyze all the user's data and generate 3-5 key insights.
    
    Financial Data:
    - Balance: ₹${data.finance.balance.toLocaleString('en-IN')}
    - Expenses: ${data.finance.expenses.length}
    - Goals: ${data.goals.goals.length}
    - Timeline Events: ${data.timeline.events.length}
    `;

    const response = await this.generateResponse(
      INSIGHT_GENERATION_SYSTEM_PROMPT,
      combinedPrompt
    );

    try {
      // Parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const validated = GenerateInsightsResponseSchema.parse(parsed);
        return validated.insights.map((insight) => ({
          ...insight,
          createdAt: new Date(insight.createdAt),
        }));
      }
    } catch (e) {
      console.error('Failed to parse or validate insights:', e);
    }

    return [];
  }
}
