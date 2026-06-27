import { Goal, GoalProgress } from '../types';
import { differenceInDays, addMonths, format } from 'date-fns';

export function calculateGoalProgress(goal: Goal): GoalProgress {
  const saved = goal.current_amount;
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);
  const percentage = goal.target_amount > 0 ? Math.min(100, (saved / goal.target_amount) * 100) : 0;

  let status: GoalProgress['status'] = 'on_track';
  let daysRemaining: number | undefined;
  let estimatedCompletionDate: string | undefined;
  let monthlyRequired: number | undefined;

  if (percentage >= 100) {
    status = 'completed';
  } else if (goal.target_date) {
    const today = new Date();
    const targetDate = new Date(goal.target_date);
    daysRemaining = Math.max(0, differenceInDays(targetDate, today));

    if (daysRemaining > 0 && saved > 0) {
      const daysSinceStart = Math.max(1, differenceInDays(today, new Date(goal.created_at)));
      const savedPerDay = saved / daysSinceStart;
      const daysNeeded = remaining / savedPerDay;
      estimatedCompletionDate = format(addMonths(today, Math.ceil(daysNeeded / 30)), 'yyyy-MM-dd');

      monthlyRequired = remaining / (daysRemaining / 30);

      if (savedPerDay * daysRemaining >= remaining) {
        status = 'on_track';
      } else if (savedPerDay * daysRemaining * 1.2 >= remaining) {
        status = 'ahead';
      } else {
        status = 'behind';
      }
    }
  }

  return {
    goal,
    saved,
    remaining,
    percentage,
    daysRemaining,
    estimatedCompletionDate,
    monthlyRequired,
    status,
  };
}
