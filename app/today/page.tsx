'use client';

import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { createClient } from '@/lib/supabase';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { TodaySection } from '@/modules/today/components';
import { todayContextService } from '@/modules/today/services';
import { contextEngine, todayProvider, timelineProvider, financeProvider, goalsProvider, captureProvider } from '@/modules/context';
import type { TodayData, TodayContext } from '@/modules/today/types';

interface FinanceData extends TodayData {
  insights: any[];
}

async function fetchData(): Promise<FinanceData | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  const [
    { data: credits },
    { data: debits },
    { data: todayExpenses },
    { data: monthExpenses },
    { data: recentExpenses },
    { data: recurringExpenses },
    { data: budgetStats },
    { data: goals },
    { data: timelineEvents },
    { data: accounts },
  ] = await Promise.all([
    supabase.from('balance_entries').select('amount').eq('user_id', user.id).eq('type', 'credit'),
    supabase.from('balance_entries').select('amount').eq('user_id', user.id).eq('type', 'debit'),
    supabase.from('expenses').select('amount').eq('user_id', user.id).gte('date', todayStart.toISOString()).lte('date', todayEnd.toISOString()),
    supabase.from('expenses').select('amount').eq('user_id', user.id).gte('date', monthStart.toISOString()).lte('date', monthEnd.toISOString()),
    supabase.from('expenses').select('id, amount, note, date, category:categories(name, icon)').eq('user_id', user.id).order('date', { ascending: false }).limit(30),
    supabase.from('recurring_transactions').select('id, name, amount, next_due_date').eq('user_id', user.id).eq('is_active', true).order('next_due_date', { ascending: true }).limit(5),
    supabase.from('categories').select('id, name, daily_budget').eq('user_id', user.id).not('daily_budget', 'is', null),
    supabase.from('goals').select('id, title, current_amount, target_amount').eq('user_id', user.id).eq('archived', false).order('created_at', { ascending: false }),
    supabase.from('timeline_events').select('*').eq('user_id', user.id).order('timestamp', { ascending: false }).limit(5),
    supabase.from('accounts').select('id, name').eq('user_id', user.id).eq('archived', false),
  ]);

  const budgets = (budgetStats || []).map((budget) => {
    const spent = (monthExpenses || []).reduce((sum, e) => sum + Number(e.amount), 0);
    return {
      id: budget.id,
      name: budget.name,
      amount: Number(budget.daily_budget),
      spent: spent,
    };
  });

  const totalCredits = credits?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
  const totalDebits = debits?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
  const todayExpenseTotal = todayExpenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
  const monthExpenseTotal = monthExpenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
  const totalDailyBudget = budgetStats?.reduce((sum, item) => sum + Number(item.daily_budget || 0), 0) || 0;
  const budgetRemaining = Math.max(0, totalDailyBudget - todayExpenseTotal);
  const currentBalance = totalCredits - totalDebits - monthExpenseTotal;

  const expensesWithCategories = (recentExpenses || []).map((expense: any) => ({
    id: expense.id,
    amount: Number(expense.amount),
    category: expense.category || { name: 'Other', icon: 'Wallet' },
    date: expense.date,
  }));

  const formattedGoals = (goals || []).map((goal: any) => ({
    id: goal.id,
    title: goal.title,
    currentAmount: Number(goal.current_amount),
    targetAmount: Number(goal.target_amount),
  }));

  const formattedAccounts = (accounts || []).map((account: any) => ({
    id: account.id,
    name: account.name,
    balance: 10000,
  }));

  const formattedRecurring = (recurringExpenses || []).map((rp: any) => ({
    id: rp.id,
    name: rp.name,
    amount: Number(rp.amount),
    nextDueDate: rp.next_due_date,
  }));

  const typedTimelineEvents = (timelineEvents || []).map((event: any) => ({
    ...event,
    timestamp: new Date(event.timestamp),
  }));

  return {
    user,
    todayExpenseTotal,
    budgetRemaining,
    monthExpenseTotal,
    currentBalance,
    recentExpenses: expensesWithCategories,
    pendingRecurring: recurringExpenses?.filter((r: any) => new Date(r.next_due_date) <= new Date()) || [],
    totalDailyBudget,
    todayExpenses: todayExpenses || [],
    goals: formattedGoals,
    timelineEvents: typedTimelineEvents,
    accounts: formattedAccounts,
    budgets,
    recurringPayments: formattedRecurring,
    insights: [],
  };
}

export default function TodayPage() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [context, setContext] = useState<TodayContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const financeData = await fetchData();
        setData(financeData);
        
        if (financeData) {
          // Register Context Engine providers
          contextEngine.registerProvider(todayProvider);
          contextEngine.registerProvider(timelineProvider);
          contextEngine.registerProvider(financeProvider);
          contextEngine.registerProvider(goalsProvider);
          contextEngine.registerProvider(captureProvider);
          
          // Use Context Engine for enhanced context
          const dailyContext = await contextEngine.getCurrentContext(financeData.user.id);
          
          // Fall back to existing Today context service for now
          const todayContext = todayContextService.buildContext(financeData);
          setContext(todayContext);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-card border border-border/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || !context) {
    return (
      <EmptyState
        title="No data available"
        description="Unable to load your financial data. Please try again later."
      />
    );
  }

  // Empty state for new users
  if (!context.hasData) {
    return (
      <div className="space-y-6">
        <TodaySection 
          section={{ type: 'greeting', priority: 100, visible: true, data: { timeOfDay: context.timeOfDay } }} 
          data={data} 
        />
        <EmptyState
          title="Welcome to PaisaTrack"
          description="Start your financial journey by adding your first expense or setting up a budget."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {context.sections.map((section) => (
        section.visible && (
          <TodaySection 
            key={section.type} 
            section={section} 
            data={data}
            onRecommendationAction={(action) => console.log('Action:', action)}
          />
        )
      ))}
    </div>
  );
}
