export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: string;
  icon: string | null;
  color: string | null;
  currency: string;
  opening_balance: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string | null;
  type: 'income' | 'expense';
  daily_budget: number | null;
  parent_id: string | null;
  archived: boolean;
  ordering: number;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  account_id: string | null;
  amount: number;
  note: string | null;
  merchant: string | null;
  location: string | null;
  tags: string[] | null;
  recurring_expense_id: string | null;
  date: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseWithCategory extends Expense {
  category: Category;
}

export interface ExpenseWithCategoryAndAccount extends ExpenseWithCategory {
  account: Account | null;
}

export interface BalanceEntry {
  id: string;
  user_id: string;
  account_id: string | null;
  amount: number;
  note: string | null;
  merchant: string | null;
  location: string | null;
  tags: string[] | null;
  type: 'credit' | 'debit';
  category_id: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'custom';
  custom_start_date: string | null;
  custom_end_date: string | null;
  custom_days: number | null;
  rollover: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface BudgetWithCategories extends Budget {
  budget_categories: { category_id: string; category: Category }[];
}

export interface BudgetProgress {
  budget: Budget | BudgetWithCategories;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'healthy' | 'warning' | 'exceeded';
}

export interface BudgetCategory {
  id: string;
  budget_id: string;
  category_id: string;
  created_at: string;
}

export interface Merchant {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Summary {
  totalBalance: number;
  totalCreditedAllTime: number;
  totalSpentThisMonth: number;
  transactionCount: number;
  spendingByCategory: {
    name: string;
    icon: string;
    total: number;
  }[];
}

export interface StipendConfig {
  id: string;
  user_id: string;
  amount: number;
  credit_day: number;
  created_at: string;
  updated_at: string;
}

export interface StipendStats {
  stipendAmount: number;
  creditDay: number;
  daysUntilNextStipend: number;
  daysElapsed: number;
  totalDaysInCycle: number;
  amountSpentThisCycle: number;
  balanceLeft: number;
  safeSpendPerDay: number;
  actualSpendPerDay: number;
  projectedBalanceOnPayday: number;
  isOverspending: boolean;
  willRunOut: boolean;
}

export interface RecurringExpense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category_id: string | null;
  account_id: string | null;
  frequency: 'weekly' | 'monthly' | 'custom';
  custom_days: number | null;
  next_due_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: { name: string; icon: string };
}

export interface RecurringWithStatus extends RecurringExpense {
  days_until_due: number;
  status: 'overdue' | 'urgent' | 'upcoming' | 'normal';
}
