import { TodayData, Celebration } from '../types';

export function getCelebrations(data: TodayData): Celebration[] {
  const celebrations: Celebration[] = [];

  // Check for budget met (stayed under budget)
  if (data.totalDailyBudget > 0 && data.budgetRemaining >= 0 && data.todayExpenseTotal > 0) {
    const percentageUsed = (data.todayExpenseTotal / data.totalDailyBudget) * 100;
    if (percentageUsed <= 80) {
      celebrations.push({
        type: 'budget-met',
        title: 'Great Job!',
        message: `You stayed under budget today! Only ${Math.round(percentageUsed)}% of your daily budget used.`,
        icon: 'trending-up',
        priority: 90
      });
    }
  }

  // Check for goal completed
  const completedGoals = data.goals.filter(g => g.currentAmount >= g.targetAmount);
  if (completedGoals.length > 0) {
    completedGoals.forEach(goal => {
      celebrations.push({
        type: 'goal-completed',
        title: 'Goal Achieved! 🎉',
        message: `Congratulations! You've reached your "${goal.title}" goal.`,
        icon: 'trophy',
        priority: 95
      });
    });
  }

  // Check for first transaction
  if (data.todayExpenses.length === 1 && data.recentExpenses.length === 1) {
    celebrations.push({
      type: 'first-transaction',
      title: 'First Step!',
      message: "You've logged your first transaction. Keep tracking to build better habits.",
      icon: 'star',
      priority: 85
    });
  }

  // Check for first savings contribution
  const firstSavings = data.recentExpenses.find(e => e.amount < 0);
  if (firstSavings && data.recentExpenses.filter(e => e.amount < 0).length === 1) {
    celebrations.push({
      type: 'first-savings',
      title: 'Savings Started!',
      message: "You've made your first savings contribution. Every bit counts!",
      icon: 'piggy-bank',
      priority: 85
    });
  }

  // Check for streak (simple version: 3+ transactions today)
  if (data.todayExpenses.length >= 3) {
    celebrations.push({
      type: 'streak-achieved',
      title: 'Active Day!',
      message: `You've logged ${data.todayExpenses.length} transactions today. Great tracking!`,
      icon: 'flame',
      priority: 80
    });
  }

  return celebrations.sort((a, b) => b.priority - a.priority);
}
