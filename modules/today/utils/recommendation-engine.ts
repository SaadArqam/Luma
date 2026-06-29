import { TodayData, Recommendation, TimeOfDay } from '../types';

export function getRecommendations(data: TodayData, timeOfDay: TimeOfDay): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Contribute to goal recommendation
  const activeGoals = data.goals.filter(g => g.currentAmount < g.targetAmount);
  if (activeGoals.length > 0 && data.currentBalance > 0) {
    const closestGoal = activeGoals.reduce((closest, goal) => {
      const closestProgress = closest.currentAmount / closest.targetAmount;
      const goalProgress = goal.currentAmount / goal.targetAmount;
      return goalProgress > closestProgress ? goal : closest;
    });
    
    recommendations.push({
      type: 'contribute-goal',
      title: 'Boost Your Progress',
      message: `Consider adding to your "${closestGoal.title}" goal. You're ${Math.round((closestGoal.currentAmount / closestGoal.targetAmount) * 100)}% of the way there!`,
      action: 'Add contribution',
      priority: 70
    });
  }

  // Avoid dining out recommendation (if high spending on food)
  const foodExpenses = data.todayExpenses.filter(e => 
    e.category?.name?.toLowerCase().includes('food') || 
    e.category?.name?.toLowerCase().includes('dining') ||
    e.category?.name?.toLowerCase().includes('restaurant')
  );
  if (foodExpenses.length > 0 && timeOfDay === 'afternoon') {
    recommendations.push({
      type: 'avoid-spending',
      title: 'Lunch Tip',
      message: 'Consider packing lunch or choosing a budget-friendly option today.',
      action: 'View budget',
      priority: 60
    });
  }

  // Review upcoming bills recommendation
  if (data.recurringPayments.length > 0 && timeOfDay === 'morning') {
    const upcomingThisWeek = data.recurringPayments.filter(r => {
      const dueDate = new Date(r.nextDueDate);
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(today.getDate() + 7);
      return dueDate >= today && dueDate <= weekFromNow;
    });

    if (upcomingThisWeek.length > 0) {
      recommendations.push({
        type: 'review-bills',
        title: 'Upcoming Bills',
        message: `You have ${upcomingThisWeek.length} bill${upcomingThisWeek.length !== 1 ? 's' : ''} due this week. Review your calendar.`,
        action: 'View bills',
        priority: 65
      });
    }
  }

  // Check budget recommendation
  if (data.totalDailyBudget > 0) {
    const percentageUsed = (data.todayExpenseTotal / data.totalDailyBudget) * 100;
    if (percentageUsed > 80 && percentageUsed < 100) {
      recommendations.push({
        type: 'check-budget',
        title: 'Budget Alert',
        message: `You've used ${Math.round(percentageUsed)}% of your daily budget. Consider limiting additional spending.`,
        action: 'View budget',
        priority: 75
      });
    }
  }

  // General recommendation for new users
  if (data.todayExpenses.length === 0 && timeOfDay === 'morning') {
    recommendations.push({
      type: 'check-budget',
      title: 'Start Tracking',
      message: 'Log your first expense today to start building your financial picture.',
      action: 'Add expense',
      priority: 50
    });
  }

  return recommendations.sort((a, b) => b.priority - a.priority);
}
