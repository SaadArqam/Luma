import { EmptyState } from '@/components/ui/empty-state';
import { 
  TodayHeader, 
  DailyBriefCard, 
  FocusSection, 
  InsightSection, 
  UpcomingSection, 
  ContinueSection, 
  RecentTimelinePreview, 
  FloatingCaptureButton,
  TodayPageSkeleton 
} from '@/modules/today/components';
import { createClient } from '@/lib/supabase-server';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import { Suspense } from 'react';

interface TodayData {
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
  insights: any[];
}

async function fetchData(): Promise<TodayData | null> {
  const supabase = await createClient();
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
    title: expense.note || 'Expense',
    amount: Number(expense.amount),
    type: 'transaction' as const,
    timestamp: new Date(expense.date),
  }));

  const formattedGoals = (goals || []).map((goal: any) => ({
    id: goal.id,
    title: goal.title,
    subtitle: `${Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100)}% complete`,
    type: 'goal' as const,
  }));

  const formattedRecurring = (recurringExpenses || []).map((rp: any) => ({
    id: rp.id,
    title: rp.name,
    date: rp.next_due_date,
    type: 'bill' as const,
  }));

  const typedTimelineEvents = (timelineEvents || []).map((event: any) => ({
    id: event.id,
    title: event.title || 'Activity',
    timestamp: new Date(event.timestamp),
    type: event.type || 'ai' as const,
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
    accounts: formattedRecurring,
    budgets,
    recurringPayments: formattedRecurring,
    insights: [],
  };
}

async function TodayContent() {
  const data = await fetchData();

  if (!data) {
    return (
      <EmptyState
        title="No data available"
        description="Unable to load your financial data. Please try again later."
      />
    );
  }

  const hasData = data.recentExpenses.length > 0 || data.goals.length > 0 || data.recurringPayments.length > 0;
  const userName = data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || 'there';

  if (!hasData) {
    return (
      <div className="space-y-6">
        <TodayHeader userName={userName} />
        <EmptyState
          title="Welcome to Luma"
          description="Start your journey by adding your first expense or setting a goal."
        />
      </div>
    );
  }

  const focusItems = data.pendingRecurring.map((item: any) => ({
    id: item.id,
    title: item.name,
    description: `Due ${new Date(item.next_due_date).toLocaleDateString()}`,
    priority: 'high' as const,
  }));

  const upcomingItems = [...data.recurringPayments, ...data.goals].slice(0, 5);

  const timelineItems = [...data.recentExpenses, ...data.timelineEvents].slice(0, 5);

  return (
    <div className="space-y-6 pb-32">
      <TodayHeader userName={userName} />
      <DailyBriefCard isEmpty={!data.insights || data.insights.length === 0} />
      <FocusSection items={focusItems} />
      <InsightSection insights={data.insights} />
      <UpcomingSection items={upcomingItems} />
      <ContinueSection items={data.goals.slice(0, 3)} />
      <RecentTimelinePreview items={timelineItems} />
      <FloatingCaptureButton />
    </div>
  );
}

export default function TodayPage() {
  return (
    <Suspense fallback={<TodayPageSkeleton />}>
      <TodayContent />
    </Suspense>
  );
}
