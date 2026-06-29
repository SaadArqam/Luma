import type { ContextProvider, BaseContext, RelevanceSignal, ContextEntity } from '../types';
import { createClient } from '@/lib/supabase';

export class TodayProvider implements ContextProvider {
  source = 'today' as const;

  async getContext(userId: string, scope?: string): Promise<Partial<BaseContext>> {
    const supabase = createClient();
    
    // Fetch today's data
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      { data: todayExpenses },
      { data: goals },
      { data: recurring },
    ] = await Promise.all([
      supabase.from('expenses').select('*').eq('user_id', userId).gte('date', todayStart.toISOString()).lte('date', todayEnd.toISOString()),
      supabase.from('goals').select('*').eq('user_id', userId).eq('archived', false),
      supabase.from('recurring_transactions').select('*').eq('user_id', userId).eq('is_active', true),
    ]);

    const activeGoals: ContextEntity[] = (goals || []).map((goal: any) => ({
      id: goal.id,
      type: 'goal',
      sourceModule: 'goals',
      relevanceScore: 0,
      signals: [
        {
          type: 'active_goal',
          score: 0.85,
          timestamp: new Date(goal.updated_at),
        },
      ],
      data: goal,
    }));

    const recentActivity: ContextEntity[] = (todayExpenses || []).map((expense: any) => ({
      id: expense.id,
      type: 'expense',
      sourceModule: 'finance',
      relevanceScore: 0,
      signals: [
        {
          type: 'recently_updated',
          score: 0.8,
          timestamp: new Date(expense.date),
        },
      ],
      data: expense,
    }));

    const pendingBills: ContextEntity[] = (recurring || [])
      .filter((r: any) => new Date(r.next_due_date) <= new Date())
      .map((bill: any) => ({
        id: bill.id,
        type: 'transaction',
        sourceModule: 'finance',
        relevanceScore: 0,
        signals: [
          {
            type: 'upcoming_deadline',
            score: 0.9,
            timestamp: new Date(bill.next_due_date),
          },
        ],
        data: bill,
      }));

    return {
      userId,
      timestamp: new Date(),
      activeGoals,
      recentActivity,
      importantDeadlines: pendingBills,
      relevantEntities: [...activeGoals, ...recentActivity, ...pendingBills],
    };
  }

  async getRelevanceSignals(userId: string): Promise<RelevanceSignal[]> {
    const context = await this.getContext(userId);
    const signals: RelevanceSignal[] = [];

    for (const entity of context.activeGoals || []) {
      signals.push(...entity.signals);
    }
    for (const entity of context.recentActivity || []) {
      signals.push(...entity.signals);
    }
    for (const entity of context.importantDeadlines || []) {
      signals.push(...entity.signals);
    }

    return signals;
  }
}

export const todayProvider = new TodayProvider();
