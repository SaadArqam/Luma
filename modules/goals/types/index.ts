export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  currency: string;
  icon: string;
  color: string;
  status: 'active' | 'completed' | 'paused';
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface GoalContribution {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  note: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface GoalProgress {
  goal: Goal;
  saved: number;
  remaining: number;
  percentage: number;
  daysRemaining?: number;
  estimatedCompletionDate?: string;
  monthlyRequired?: number;
  status: 'on_track' | 'ahead' | 'behind' | 'completed';
}

export interface GoalTemplate {
  title: string;
  description: string;
  icon: string;
  color: string;
  defaultTargetAmount?: number;
  defaultTargetDateMonths?: number;
}
