import type { ContextProvider, BaseContext, RelevanceSignal, ContextEntity } from '../types';
import { createClient } from '@/lib/supabase';

export class GoalsProvider implements ContextProvider {
  source = 'goals' as const;

  async getContext(userId: string, scope?: string): Promise<Partial<BaseContext>> {
    const supabase = createClient();
    
    const { data: goals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false)
      .order('created_at', { ascending: false });

    const activeGoals: ContextEntity[] = (goals || []).map((goal: any) => {
      const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
      return {
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
          ...(progress >= 100 ? [{
            type: 'recently_updated' as const,
            score: 0.95,
            timestamp: new Date(goal.updated_at),
          }] : []),
        ],
        data: goal,
      };
    });

    return {
      userId,
      timestamp: new Date(),
      activeGoals,
      relevantEntities: activeGoals,
    };
  }

  async getRelevanceSignals(userId: string): Promise<RelevanceSignal[]> {
    const context = await this.getContext(userId);
    const signals: RelevanceSignal[] = [];

    for (const entity of context.activeGoals || []) {
      signals.push(...entity.signals);
    }

    return signals;
  }
}

export const goalsProvider = new GoalsProvider();
