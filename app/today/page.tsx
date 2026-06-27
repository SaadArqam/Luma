import { PageHeader, PageTitle, PageDescription } from '@/components/ui/page-header'
import { WidgetContainer } from '@/components/ui/widget-container'
import { MetricCard } from '@/components/ui/metric-card'
import { ProgressCard } from '@/components/ui/progress-card'
import { EmptyState } from '@/components/ui/empty-state'
import { Sun, Wallet, Target, CheckSquare, Sparkles, Clock, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { formatCurrency } from '@/modules/shared/utils'
import { startOfDay, endOfDay, startOfMonth, endOfMonth, format } from 'date-fns'
import { TodayGoalWidget } from '@/modules/goals/components/TodayGoalWidget'
import { TimelineWidget } from '@/modules/timeline/components'

async function fetchData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const todayStart = startOfDay(new Date())
  const todayEnd = endOfDay(new Date())
  const monthStart = startOfMonth(new Date())
  const monthEnd = endOfMonth(new Date())

  const [
    { data: credits },
    { data: debits },
    { data: todayExpenses },
    { data: monthExpenses },
    { data: recentExpenses },
    { data: recurringExpenses },
    { data: budgetStats },
    { data: goals },
    { data: timelineEvents }
  ] = await Promise.all([
    supabase.from('balance_entries').select('amount').eq('user_id', user.id).eq('type', 'credit'),
    supabase.from('balance_entries').select('amount').eq('user_id', user.id).eq('type', 'debit'),
    supabase.from('expenses').select('amount').eq('user_id', user.id).gte('date', todayStart.toISOString()).lte('date', todayEnd.toISOString()),
    supabase.from('expenses').select('amount').eq('user_id', user.id).gte('date', monthStart.toISOString()).lte('date', monthEnd.toISOString()),
    supabase.from('expenses').select('amount, note, date, category:categories(name, icon)').eq('user_id', user.id).order('date', { ascending: false }).limit(10),
    supabase.from('recurring_expenses').select('id, name, amount, next_due_date').eq('user_id', user.id).eq('is_active', true).order('next_due_date', { ascending: true }).limit(5),
    supabase.from('categories').select('daily_budget').eq('user_id', user.id).not('daily_budget', 'is', null),
    supabase.from('goals').select('*').eq('user_id', user.id).eq('archived', false).order('created_at', { ascending: false }),
    supabase.from('timeline_events').select('*').eq('user_id', user.id).order('timestamp', { ascending: false }).limit(5)
  ])

  const totalCredits = credits?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const totalDebits = debits?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const todayExpenseTotal = todayExpenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const monthExpenseTotal = monthExpenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
  const totalDailyBudget = budgetStats?.reduce((sum, item) => sum + Number(item.daily_budget || 0), 0) || 0
  const budgetRemaining = Math.max(0, totalDailyBudget - todayExpenseTotal)
  const currentBalance = totalCredits - totalDebits - monthExpenseTotal

  const typedTimelineEvents = (timelineEvents || []).map(event => ({
    ...event,
    timestamp: new Date(event.timestamp)
  }));

  return {
    user,
    todayExpenseTotal,
    budgetRemaining,
    monthExpenseTotal,
    currentBalance,
    recentExpenses: recentExpenses || [],
    pendingRecurring: recurringExpenses?.filter(r => new Date(r.next_due_date) <= new Date()) || [],
    totalDailyBudget,
    todayExpenses: todayExpenses || [],
    goals: goals || [],
    timelineEvents: typedTimelineEvents
  }
}

export default async function TodayPage() {
  const data = await fetchData()
  const now = new Date()
  const hour = now.getHours()
  
  let greeting = 'Good evening'
  if (hour < 12) greeting = 'Good morning'
  else if (hour < 18) greeting = 'Good afternoon'

  const userName = data?.user?.email?.split('@')[0] || 'Guest'

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-text">{greeting}, {userName} 👋</h1>
        <p className="text-muted-foreground">{format(now, 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Daily Summary */}
      <WidgetContainer title="Daily Summary">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Today's Spending"
            value={formatCurrency(data?.todayExpenseTotal || 0)}
            icon={<Wallet className="h-5 w-5 text-accent" />}
          />
          <MetricCard
            title="Budget Remaining"
            value={formatCurrency(data?.budgetRemaining || 0)}
            icon={<TrendingUp className="h-5 w-5 text-accent" />}
          />
          <MetricCard
            title="Pending Bills"
            value={data?.pendingRecurring?.length || 0}
            icon={<Clock className="h-5 w-5 text-accent" />}
          />
          <MetricCard
            title="Transactions Today"
            value={data?.todayExpenses?.length || 0}
            icon={<Wallet className="h-5 w-5 text-accent" />}
          />
        </div>
      </WidgetContainer>

      {/* Money Snapshot */}
      <WidgetContainer title="Money Snapshot">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Current Balance"
            value={formatCurrency(data?.currentBalance || 0)}
            icon={<Wallet className="h-5 w-5 text-accent" />}
          />
          <MetricCard
            title="This Month"
            value={formatCurrency(data?.monthExpenseTotal || 0)}
            icon={<TrendingUp className="h-5 w-5 text-accent" />}
          />
          <MetricCard
            title="Daily Budget"
            value={formatCurrency(data?.totalDailyBudget || 0)}
            icon={<Wallet className="h-5 w-5 text-accent" />}
          />
        </div>
      </WidgetContainer>

      {/* Goals */}
      <TodayGoalWidget goals={data?.goals || []} />

      {/* Tasks */}
      <WidgetContainer title="Tasks">
        <EmptyState
          icon={<CheckSquare className="h-8 w-8" />}
          title="No tasks today"
          description="Add tasks to track your daily progress"
        />
      </WidgetContainer>

      {/* AI Insight */}
      <WidgetContainer title="AI Insight">
        <EmptyState
          icon={<Sparkles className="h-8 w-8" />}
          title="AI Insights coming soon"
          description="Get personalized insights and recommendations powered by AI"
        />
      </WidgetContainer>

      {/* Timeline Widget */}
      <TimelineWidget events={data?.timelineEvents || []} limit={5} />
    </div>
  )
}
