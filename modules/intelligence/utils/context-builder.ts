import { formatCurrency } from '@/modules/shared/utils';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from 'date-fns';

interface ContextData {
  accounts: Array<{ id: string; name: string; balance: number }>;
  expenses: Array<{ id: string; amount: number; category: { name: string; icon: string }; date: string }>;
  budgets: Array<{ id: string; name: string; amount: number; spent: number }>;
  goals: Array<{ id: string; title: string; currentAmount: number; targetAmount: number }>;
  recurringPayments: Array<{ id: string; name: string; amount: number; nextDueDate: string }>;
}

export function buildFinanceContext(data: ContextData): string {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // Calculate monthly spending
  const monthlyExpenses = data.expenses.filter(
    (e) => new Date(e.date) >= monthStart && new Date(e.date) <= monthEnd
  );
  const totalMonthlySpending = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate weekly spending
  const weeklyExpenses = data.expenses.filter(
    (e) => new Date(e.date) >= weekStart && new Date(e.date) <= weekEnd
  );
  const totalWeeklySpending = weeklyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate spending by category
  const spendingByCategory: Record<string, number> = {};
  monthlyExpenses.forEach((expense) => {
    const categoryName = expense.category.name;
    spendingByCategory[categoryName] = (spendingByCategory[categoryName] || 0) + expense.amount;
  });

  // Build context string
  let context = `
## Financial Context (${format(now, 'MMMM d, yyyy')})

### Account Balances
`;
  data.accounts.forEach((account) => {
    context += `- ${account.name}: ${formatCurrency(account.balance)}\n`;
  });

  context += `
### Monthly Summary (${format(monthStart, 'MMM')} ${monthStart.getFullYear()})
- Total Spending: ${formatCurrency(totalMonthlySpending)}
- Number of Transactions: ${monthlyExpenses.length}
`;

  if (Object.keys(spendingByCategory).length > 0) {
    context += `
### Spending by Category (Monthly)
`;
    Object.entries(spendingByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .forEach(([category, amount]) => {
        context += `- ${category}: ${formatCurrency(amount)}\n`;
      });
  }

  context += `
### Budgets
`;
  if (data.budgets.length === 0) {
    context += `- No budgets set up yet\n`;
  } else {
    data.budgets.forEach((budget) => {
      const percentage = budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0;
      context += `- ${budget.name}: ${formatCurrency(budget.spent)} / ${formatCurrency(budget.amount)} (${percentage}%)\n`;
    });
  }

  context += `
### Active Goals
`;
  if (data.goals.length === 0) {
    context += `- No active goals\n`;
  } else {
    data.goals.forEach((goal) => {
      const percentage = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
      context += `- ${goal.title}: ${formatCurrency(goal.currentAmount)} / ${formatCurrency(goal.targetAmount)} (${percentage}%)\n`;
    });
  }

  context += `
### Upcoming Recurring Payments
`;
  if (data.recurringPayments.length === 0) {
    context += `- No upcoming recurring payments\n`;
  } else {
    data.recurringPayments
      .slice(0, 3)
      .forEach((payment) => {
        context += `- ${payment.name}: ${formatCurrency(payment.amount)} (due ${format(new Date(payment.nextDueDate), 'MMM d')})\n`;
      });
  }

  return context.trim();
}