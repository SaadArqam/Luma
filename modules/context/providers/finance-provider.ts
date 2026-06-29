import type { ContextProvider, BaseContext, RelevanceSignal, ContextEntity } from '../types';
import { createClient } from '@/lib/supabase';
import { startOfMonth, endOfMonth } from 'date-fns';

export class FinanceProvider implements ContextProvider {
  source = 'finance' as const;

  async getContext(userId: string, scope?: string): Promise<Partial<BaseContext>> {
    const supabase = createClient();
    
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());

    const [
      { data: credits },
      { data: debits },
      { data: monthExpenses },
      { data: accounts },
    ] = await Promise.all([
      supabase.from('balance_entries').select('*').eq('user_id', userId).eq('type', 'credit'),
      supabase.from('balance_entries').select('*').eq('user_id', userId).eq('type', 'debit'),
      supabase.from('expenses').select('*').eq('user_id', userId).gte('date', monthStart.toISOString()).lte('date', monthEnd.toISOString()),
      supabase.from('accounts').select('*').eq('user_id', userId).eq('archived', false),
    ]);

    const currentBalance = (credits || []).reduce((sum: number, e: any) => sum + Number(e.amount), 0) -
                          (debits || []).reduce((sum: number, e: any) => sum + Number(e.amount), 0) -
                          (monthExpenses || []).reduce((sum: number, e: any) => sum + Number(e.amount), 0);

    const monthlySpending = (monthExpenses || []).reduce((sum: number, e: any) => sum + Number(e.amount), 0);

    const accountsEntities: ContextEntity[] = (accounts || []).map((account: any) => ({
      id: account.id,
      type: 'account',
      sourceModule: 'finance',
      relevanceScore: 0,
      signals: [
        {
          type: 'frequent_interaction',
          score: 0.6,
          timestamp: new Date(account.updated_at),
        },
      ],
      data: account,
    }));

    const recentTransactions: ContextEntity[] = (monthExpenses || []).slice(0, 20).map((expense: any) => ({
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

    return {
      userId,
      timestamp: new Date(),
      relevantEntities: [...accountsEntities, ...recentTransactions],
      recentActivity: recentTransactions,
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

export const financeProvider = new FinanceProvider();
