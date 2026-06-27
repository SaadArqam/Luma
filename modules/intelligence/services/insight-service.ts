import { GroqProvider } from '../providers';
import { InsightAgent } from '../agents';
import type { Insight } from '../types';

export class InsightService {
  private insightAgent: InsightAgent;

  constructor() {
    const provider = new GroqProvider();
    this.insightAgent = new InsightAgent(provider);
  }

  async generateInsights(data: {
    finance: { expenses: any[]; income: any[]; budgets: any[]; balance: number };
    goals: { goals: any[]; contributions: any[] };
    timeline: { events: any[] };
  }): Promise<Insight[]> {
    try {
      return await this.insightAgent.generateAllInsights(data);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      return [];
    }
  }

  // Mock insights for development
  getMockInsights(): Insight[] {
    return [
      {
        id: 'mock-1',
        title: 'Great job on saving!',
        description: 'You spent 15% less this week compared to last week.',
        type: 'positive',
        priority: 'medium',
        source: 'finance',
        createdAt: new Date(),
      },
      {
        id: 'mock-2',
        title: 'Goal Progress Alert',
        description: 'Your emergency fund is 75% complete! Keep going!',
        type: 'info',
        priority: 'high',
        source: 'goals',
        createdAt: new Date(),
      },
      {
        id: 'mock-3',
        title: 'Budget Reminder',
        description: 'You are approaching your dining out budget limit.',
        type: 'warning',
        priority: 'medium',
        source: 'finance',
        createdAt: new Date(),
      },
    ];
  }
}
