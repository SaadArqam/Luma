import type { ContextProvider, BaseContext, RelevanceSignal, ContextEntity } from '../types';
import { createClient } from '@/lib/supabase';

export class CaptureProvider implements ContextProvider {
  source = 'capture' as const;

  async getContext(userId: string, scope?: string): Promise<Partial<BaseContext>> {
    const supabase = createClient();
    
    const { data: sessions } = await supabase
      .from('capture_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    const recentCaptures: ContextEntity[] = (sessions || []).map((session: any) => ({
      id: session.id,
      type: 'capture_session',
      sourceModule: 'capture',
      relevanceScore: 0,
      signals: [
        {
          type: 'recent_capture',
          score: 0.75,
          timestamp: new Date(session.created_at),
        },
      ],
      data: session,
    }));

    // Get suggested categories from recent expenses
    const { data: recentExpenses } = await supabase
      .from('expenses')
      .select('category:categories(name)')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(20);

    const categoryCounts = new Map<string, number>();
    for (const expense of recentExpenses || []) {
      const categoryName = (expense as any).category?.name || 'Other';
      categoryCounts.set(categoryName, (categoryCounts.get(categoryName) || 0) + 1);
    }

    const suggestedCategories = Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    return {
      userId,
      timestamp: new Date(),
      recentActivity: recentCaptures,
      relevantEntities: recentCaptures,
    } as any;
  }

  async getRelevanceSignals(userId: string): Promise<RelevanceSignal[]> {
    const context = await this.getContext(userId);
    const signals: RelevanceSignal[] = [];

    for (const entity of context.recentActivity || []) {
      signals.push(...entity.signals);
    }

    return signals;
  }
}

export const captureProvider = new CaptureProvider();
