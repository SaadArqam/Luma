import { createClient } from '@/lib/supabase-server';
import { DailyBrief, BriefData, BriefSection } from '../types';
import { format, startOfYesterday, endOfYesterday, isToday, startOfDay, endOfDay } from 'date-fns';

export class DailyBriefService {
  private static instance: DailyBriefService;

  public static getInstance(): DailyBriefService {
    if (!DailyBriefService.instance) {
      DailyBriefService.instance = new DailyBriefService();
    }
    return DailyBriefService.instance;
  }

  private async getUserData(userId: string): Promise<BriefData> {
    const supabase = await createClient();

    // Get accounts with balances
    const { data: accounts } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('archived', false);

    // Get yesterday's transactions
    const { data: transactions } = await supabase
      .from('expenses')
      .select(`*, category:categories(*)`)
      .eq('user_id', userId)
      .gte('date', startOfYesterday().toISOString())
      .lte('date', endOfYesterday().toISOString());

    // Get budgets with today's stats
    const { data: budgets } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .not('daily_budget', 'is', null);

    // Get active goals
    const { data: goals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .eq('archived', false);

    // Get recent timeline events
    const { data: timelineEvents } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(20);

    // Get upcoming recurring payments
    const { data: recurringPayments } = await supabase
      .from('recurring_expenses')
      .select(`*, category:categories(*)`)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('next_due_date', { ascending: true });

    // Get insights
    const insights: any[] = [];

    return {
      accounts: accounts || [],
      transactions: transactions || [],
      budgets: budgets || [],
      goals: goals || [],
      timelineEvents: timelineEvents || [],
      insights,
      recurringPayments: recurringPayments || []
    };
  }

  private generateGreeting(): BriefSection {
    const now = new Date();
    const hour = now.getHours();
    let greeting = '';

    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 17) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    const dateString = format(now, 'EEEE, MMMM d');

    return {
      type: 'greeting',
      content: `${greeting}! Today is ${dateString}.`,
      priority: 100
    };
  }

  private generateYesterdaySummary(data: BriefData): BriefSection | null {
    if (data.transactions.length === 0) {
      return null;
    }

    const totalSpent = data.transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const transactionCount = data.transactions.length;

    let content = `Yesterday you made ${transactionCount} transaction${transactionCount !== 1 ? 's' : ''} totaling ₹${totalSpent.toLocaleString('en-IN')}.`;

    if (data.transactions.length > 0) {
      const topCategory = data.transactions.reduce((acc, t) => {
        const catName = t.category?.name || 'Other';
        acc[catName] = (acc[catName] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);

      const sortedCategories = Object.entries(topCategory).sort(([, a], [, b]) => b - a);
      if (sortedCategories.length > 0) {
        content += ` Most of your spending was on ${sortedCategories[0][0]}.`;
      }
    }

    return {
      type: 'yesterday-summary',
      title: 'Yesterday',
      content,
      priority: 90
    };
  }

  private generateTodayStatus(data: BriefData): BriefSection | null {
    if (data.accounts.length === 0) {
      return null;
    }

    const totalBalance = data.accounts.reduce((sum, a) => sum + Number(a.opening_balance), 0);

    return {
      type: 'today-status',
      title: 'Your Current Balance',
      content: `Your total balance across all accounts is ₹${totalBalance.toLocaleString('en-IN')}.`,
      priority: 80
    };
  }

  private generateBudgetHealth(data: BriefData): BriefSection | null {
    if (data.budgets.length === 0) {
      return null;
    }

    const budgetsWithStatus = data.budgets.map(budget => {
      // TODO: Calculate today's spending for each budget
      return { ...budget, todaySpent: 0 };
    });

    const safeBudgets = budgetsWithStatus.filter(b => b.todaySpent <= (b.daily_budget || 0) * 0.5);
    const warningBudgets = budgetsWithStatus.filter(b => b.todaySpent > (b.daily_budget || 0) * 0.5 && b.todaySpent <= b.daily_budget);
    const dangerBudgets = budgetsWithStatus.filter(b => b.todaySpent > (b.daily_budget || 0));

    let content = '';
    if (dangerBudgets.length > 0) {
      content = `${dangerBudgets.length} of your budgets are over their daily limit today.`;
    } else if (warningBudgets.length > 0) {
      content = `${warningBudgets.length} of your budgets are at 50% or more of their daily limit.`;
    } else if (safeBudgets.length > 0) {
      content = `All of your budgets are looking good today!`;
    }

    if (!content) {
      return null;
    }

    return {
      type: 'budget-health',
      title: 'Budget Update',
      content,
      priority: 70
    };
  }

  private generateActiveGoals(data: BriefData): BriefSection | null {
    if (data.goals.length === 0) {
      return null;
    }

    const goalCount = data.goals.length;
    const goalsWithProgress = data.goals.map(goal => ({
      ...goal,
      progress: (goal.current_amount / goal.target_amount) * 100
    }));

    const nearlyCompleteGoals = goalsWithProgress.filter(g => g.progress >= 75 && g.progress < 100);

    let content = `You have ${goalCount} active goal${goalCount !== 1 ? 's' : ''}.`;

    if (nearlyCompleteGoals.length > 0) {
      content += ` ${nearlyCompleteGoals[0].title} is at ${Math.round(nearlyCompleteGoals[0].progress)}% complete!`;
    }

    return {
      type: 'active-goals',
      title: 'Your Goals',
      content,
      priority: 60
    };
  }

  private generateUpcomingPayments(data: BriefData): BriefSection | null {
    if (data.recurringPayments.length === 0) {
      return null;
    }

    const upcoming = data.recurringPayments.slice(0, 3);
    const content = `You have ${upcoming.length} upcoming recurring payment${upcoming.length !== 1 ? 's' : ''} soon.`;

    return {
      type: 'upcoming-payments',
      title: 'Upcoming Payments',
      content,
      priority: 50
    };
  }

  private generateRecommendation(data: BriefData): BriefSection | null {
    // TODO: Implement recommendation logic
    return null;
  }

  private generateEncouragement(): BriefSection {
    const encouragements = [
      "You're doing great with your finances!",
      "Keep up the good work tracking your expenses!",
      "Every small step counts towards your goals.",
      "You're in control of your money.",
      "Stay consistent and you'll reach your goals!"
    ];
    const randomIndex = Math.floor(Math.random() * encouragements.length);

    return {
      type: 'encouragement',
      content: encouragements[randomIndex],
      priority: 10
    };
  }

  private generateDeterministicBrief(data: BriefData): BriefSection[] {
    const sections: BriefSection[] = [];

    sections.push(this.generateGreeting());

    const yesterdaySummary = this.generateYesterdaySummary(data);
    if (yesterdaySummary) sections.push(yesterdaySummary);

    const todayStatus = this.generateTodayStatus(data);
    if (todayStatus) sections.push(todayStatus);

    const budgetHealth = this.generateBudgetHealth(data);
    if (budgetHealth) sections.push(budgetHealth);

    const activeGoals = this.generateActiveGoals(data);
    if (activeGoals) sections.push(activeGoals);

    const upcomingPayments = this.generateUpcomingPayments(data);
    if (upcomingPayments) sections.push(upcomingPayments);

    const recommendation = this.generateRecommendation(data);
    if (recommendation) sections.push(recommendation);

    sections.push(this.generateEncouragement());

    return sections.sort((a, b) => b.priority - a.priority);
  }

  public async generateBrief(userId: string): Promise<DailyBrief> {
    const data = await this.getUserData(userId);
    const sections = this.generateDeterministicBrief(data);

    const today = format(new Date(), 'yyyy-MM-dd');

    return {
      userId,
      date: today,
      sections,
      generatedAt: new Date(),
      isCached: false
    };
  }
}

export const dailyBriefService = DailyBriefService.getInstance();
