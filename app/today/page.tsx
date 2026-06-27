'use client';

import { useEffect, useState } from 'react';
import { WidgetContainer } from '@/components/ui/widget-container';
import { MetricCard } from '@/components/ui/metric-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Wallet, CheckSquare, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { formatCurrency } from '@/modules/shared/utils';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, format } from 'date-fns';
import { TodayGoalWidget } from '@/modules/goals/components/TodayGoalWidget';
import { TimelineWidget } from '@/modules/timeline/components';
import { InsightCard, LoadingInsight } from '@/modules/intelligence/components';
import { InsightService } from '@/modules/intelligence/services';
import { DailyBriefCard } from '@/modules/daily-brief/components';
import { UpcomingBillsWidget } from '@/modules/recurring-transactions/components/UpcomingBillsWidget';
import type { Insight } from '@/modules/intelligence/types';

interface FinanceData {
  user: any;
  todayExpenseTotal: number;
  budgetRemaining: number;
  monthExpenseTotal: number;
  currentBalance: number;
  recentExpenses: any[];
  pendingRecurring: any[];
  totalDailyBudget: number;
  todayExpenses: any[];
  goals: any[];
  timelineEvents: any[];
  accounts: any[];
  budgets: any[];
  recurringPayments: any[];
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
  };
}

export default function TodayPage() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    async function loadData() {
      try {
        const financeData = await fetchData();
        setData(financeData);
        
        if (financeData) {
          const insightService = new InsightService();
          const userInsights = await insightService.getDailyInsights({
            accounts: financeData.accounts,
            expenses: financeData.recentExpenses,
            budgets: financeData.budgets,
            goals: financeData.goals,
            recurringPayments: financeData.recurringPayments,
          });
          setInsights(userInsights);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
        setInsightsLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-card border border-border rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DailyBriefCard />

      <WidgetContainer title="Upcoming Bills">
        <UpcomingBillsWidget />
      </WidgetContainer>

      <WidgetContainer title="Daily Summary">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Today's Spending"
            value={formatCurrency(data?.todayExpenseTotal || 0)}
            icon={<Wallet className="w-5 h-5 text-accent" />}
          />
          <MetricCard
            title="Budget Remaining"
            value={formatCurrency(data?.budgetRemaining || 0)}
            icon={<TrendingUp className="w-5 h-5 text-accent" />}
          />
          <MetricCard
            title="Pending Bills"
            value={data?.pendingRecurring?.length || 0}
            icon={<Clock className="w-5 h-5 text-accent" />}
          />
          <MetricCard
            title="Transactions Today"
            value={data?.todayExpenses?.length || 0}
            icon={<Wallet className="w-5 h-5 text-accent" />}
          />
        </div>
      </WidgetContainer>

      <WidgetContainer title="Money Snapshot">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Current Balance"
            value={formatCurrency(data?.currentBalance || 0)}
            icon={<Wallet className="w-5 h-5 text-accent" />}
          />
          <MetricCard
            title="This Month"
            value={formatCurrency(data?.monthExpenseTotal || 0)}
            icon={<TrendingUp className="w-5 h-5 text-accent" />}
          />
          <MetricCard
            title="Daily Budget"
            value={formatCurrency(data?.totalDailyBudget || 0)}
            icon={<Wallet className="w-5 h-5 text-accent" />}
          />
        </div>
      </WidgetContainer>

      <WidgetContainer title="AI Insights">
        {insightsLoading ? (
          <LoadingInsight />
        ) : insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Sparkles className="h-8 w-8" />}
            title="No insights yet"
            description="Add more transactions and goals to get personalized AI insights"
          />
        )}
      </WidgetContainer>

      <TodayGoalWidget goals={data?.goals || []} />

      <WidgetContainer title="Tasks">
        <EmptyState
          icon={<CheckSquare className="h-8 w-8" />}
          title="No tasks today"
          description="Add tasks to track your daily progress"
        />
      </WidgetContainer>

      <TimelineWidget events={data?.timelineEvents || []} limit={5} />
    </div>
  );
}
