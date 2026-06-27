export type RecurringTransactionType = 'income' | 'expense';
export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface RecurringTransaction {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category_id?: string | null;
  account_id?: string | null;
  type: RecurringTransactionType;
  frequency: FrequencyType;
  custom_days?: number | null;
  start_date: string;
  end_date?: string | null;
  next_due_date: string;
  is_active: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}
