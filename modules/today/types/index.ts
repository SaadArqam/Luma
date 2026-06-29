export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export type SectionType = 
  | 'greeting'
  | 'daily-brief'
  | 'today-budget'
  | 'active-goals'
  | 'bills-due-today'
  | 'recent-activity'
  | 'recommendation'
  | 'celebration'
  | 'warning';

export interface TodaySection {
  type: SectionType;
  priority: number;
  visible: boolean;
  data?: any;
}

export interface Celebration {
  type: 'budget-met' | 'goal-completed' | 'streak-achieved' | 'first-transaction' | 'first-savings';
  title: string;
  message: string;
  icon?: string;
  priority: number;
}

export interface Recommendation {
  type: 'contribute-goal' | 'avoid-spending' | 'review-bills' | 'check-budget';
  title: string;
  message: string;
  action?: string;
  priority: number;
}

export interface TodayContext {
  timeOfDay: TimeOfDay;
  sections: TodaySection[];
  celebrations: Celebration[];
  recommendations: Recommendation[];
  hasData: boolean;
}

export interface TodayData {
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
