import { BaseAgent } from './base-agent';
import type { LLMProvider } from '../types';
import { INSIGHT_GENERATION_SYSTEM_PROMPT, TIMELINE_INSIGHTS_PROMPT } from '../prompts';

export class TimelineAgent extends BaseAgent {
  constructor(provider: LLMProvider) {
    super(
      'TimelineAgent',
      'Analyzes user activity timeline to identify patterns and trends',
      provider
    );
  }

  async generateInsights(data: {
    events: any[];
  }): Promise<string> {
    return this.generateResponse(
      INSIGHT_GENERATION_SYSTEM_PROMPT,
      TIMELINE_INSIGHTS_PROMPT(data)
    );
  }
}
