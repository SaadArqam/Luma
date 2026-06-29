import { GroqProvider } from '../providers';
import type { Insight } from '../types';
import { DAILY_INSIGHTS_SYSTEM_PROMPT, buildDailyInsightsPrompt } from '../prompts';
import { buildFinanceContext } from '../utils';
import { GenerateInsightsResponseSchema } from '../schemas';
import { startOfDay, isSameDay } from 'date-fns';
import { contextEngine } from '@/modules/context';

interface CachedInsights {
  insights: Insight[];
  timestamp: Date;
}

export class InsightService {
  private provider: GroqProvider;
  private cache: Map<string, CachedInsights> = new Map();

  constructor() {
    this.provider = new GroqProvider();
  }

  // Deterministic fallback insights
  getFallbackInsights(data: {
    accounts: Array<{ id: string; name: string; balance: number }>;
    expenses: Array<{ id: string; amount: number; category: { name: string; icon: string }; date: string }>;
    budgets: Array<{ id: string; name: string; amount: number; spent: number }>;
    goals: Array<{ id: string; title: string; currentAmount: number; targetAmount: number }>;
  }): Insight[] {
    const insights: Insight[] = [];

    // Add a spending summary insight
    if (data.expenses.length > 0) {
      const totalSpent = data.expenses.reduce((sum, e) => sum + e.amount, 0);
      insights.push({
        id: 'fallback-spending-summary',
        title: 'Your Spending Overview',
        summary: `You've made ${data.expenses.length} transactions totaling ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalSpent)} recently. Track your spending to stay on top of your finances.`,
        type: 'info',
        priority: 'medium',
        category: 'spending',
        source: 'finance',
        confidence: 'high',
        suggestedActions: ['Review your recent transactions', 'Set up a budget for next month'],
        createdAt: new Date(),
      });
    }

    // Add a goal progress insight if there are active goals
    const activeGoals = data.goals.filter((g) => g.currentAmount < g.targetAmount);
    if (activeGoals.length > 0) {
      const closestGoal = activeGoals.reduce((closest, goal) => {
        const closestProgress = closest.currentAmount / closest.targetAmount;
        const goalProgress = goal.currentAmount / goal.targetAmount;
        return goalProgress > closestProgress ? goal : closest;
      });
      const progress = Math.round((closestGoal.currentAmount / closestGoal.targetAmount) * 100);
      insights.push({
        id: 'fallback-goal-progress',
        title: `Making Progress on ${closestGoal.title}`,
        summary: `You're ${progress}% of the way to your ${closestGoal.title} goal. Keep up the great work!`,
        type: 'positive',
        priority: 'medium',
        category: 'goals',
        source: 'goals',
        confidence: 'high',
        suggestedActions: [`Add a contribution to ${closestGoal.title}`, 'Review your goal target amount'],
        createdAt: new Date(),
      });
    }

    // If no other insights, add a general tip
    if (insights.length === 0) {
      insights.push({
        id: 'fallback-welcome',
        title: 'Start Tracking Your Finances',
        summary: 'Add your expenses and set up budgets to get personalized financial insights. The more data you add, the better insights we can provide!',
        type: 'info',
        priority: 'low',
        category: 'spending',
        source: 'finance',
        confidence: 'high',
        suggestedActions: ['Add your first expense', 'Set up a monthly budget'],
        createdAt: new Date(),
      });
    }

    return insights;
  }

  private isCacheValid(userId: string): boolean {
    const cached = this.cache.get(userId);
    if (!cached) return false;
    const now = new Date();
    // Cache is valid for the same day
    return isSameDay(startOfDay(cached.timestamp), startOfDay(now));
  }

  async getDailyInsights(data: {
    accounts: Array<{ id: string; name: string; balance: number }>;
    expenses: Array<{ id: string; amount: number; category: { name: string; icon: string }; date: string }>;
    budgets: Array<{ id: string; name: string; amount: number; spent: number }>;
    goals: Array<{ id: string; title: string; currentAmount: number; targetAmount: number }>;
    recurringPayments: Array<{ id: string; name: string; amount: number; nextDueDate: string }>;
  }, userId: string = 'default'): Promise<Insight[]> {
    // Check cache first
    if (this.isCacheValid(userId)) {
      return this.cache.get(userId)!.insights;
    }

    try {
      // Use Context Engine to get structured context for enhanced insights
      // This context can be used to prioritize or enhance insights
      const dailyContext = await contextEngine.getCurrentContext(userId);
      
      // Build context from original data (Context Engine provides additional context)
      const context = buildFinanceContext(data);

      // Call LLM
      const response = await this.provider.chat([
        { role: 'system', content: DAILY_INSIGHTS_SYSTEM_PROMPT },
        { role: 'user', content: buildDailyInsightsPrompt(context) },
      ], { temperature: 0.7, maxTokens: 1024 });

      // Parse JSON from response
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const validated = GenerateInsightsResponseSchema.parse(parsed);

      // Convert dates
      const insights: Insight[] = validated.insights.map((i) => ({
        ...i,
        createdAt: new Date(i.createdAt),
      }));

      // Cache the result
      this.cache.set(userId, {
        insights,
        timestamp: new Date(),
      });

      return insights;
    } catch (error) {
      console.error('Failed to generate AI insights, using fallbacks:', error);
      const fallbacks = this.getFallbackInsights(data);
      // Cache fallbacks too
      this.cache.set(userId, {
        insights: fallbacks,
        timestamp: new Date(),
      });
      return fallbacks;
    }
  }
}
