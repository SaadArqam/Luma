import { Budget, BudgetProgress, Category, Expense } from '../types';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function calculateBudgetProgress(
  budget: Budget,
  expenses: Expense[],
  referenceDate: Date = new Date()
): BudgetProgress {
  let periodStart: Date;
  let periodEnd: Date;

  switch (budget.period) {
    case 'weekly':
      periodStart = startOfWeek(referenceDate);
      periodEnd = endOfWeek(referenceDate);
      break;
    case 'monthly':
      periodStart = startOfMonth(referenceDate);
      periodEnd = endOfMonth(referenceDate);
      break;
    case 'custom':
      periodStart = budget.custom_start_date ? new Date(budget.custom_start_date) : startOfMonth(referenceDate);
      periodEnd = budget.custom_end_date ? new Date(budget.custom_end_date) : endOfMonth(referenceDate);
      break;
  }

  const periodExpenses = expenses.filter(expense => 
    isWithinInterval(new Date(expense.date), { start: periodStart, end: periodEnd })
  );

  const spent = periodExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const remaining = budget.amount - spent;
  const percentage = budget.amount > 0 ? Math.min(Math.round((spent / budget.amount) * 100), 100) : 0;

  let status: 'healthy' | 'warning' | 'exceeded' = 'healthy';
  if (percentage >= 100) {
    status = 'exceeded';
  } else if (percentage >= 80) {
    status = 'warning';
  }

  return { budget, spent, remaining, percentage, status };
}
