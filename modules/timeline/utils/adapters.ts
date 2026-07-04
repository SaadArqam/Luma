import type { TimelineItem } from '../types';
import type { ExpenseWithCategoryAndAccount, BalanceEntry, RecurringExpense } from '../../finance/types';
import type { Goal, GoalContribution } from '../../goals/types';
import { formatCurrency } from '@/modules/shared/utils';

// Finance Adapters
export function expenseToTimelineItem(expense: ExpenseWithCategoryAndAccount): TimelineItem {
  return {
    id: expense.id,
    timestamp: new Date(expense.date),
    type: 'expense',
    title: expense.note || expense.category.name,
    description: `${formatCurrency(expense.amount)}${expense.account ? ` • ${expense.account.name}` : ''}`,
    sourceModule: 'finance',
    icon: expense.category.icon || 'credit-card',
    color: expense.category.color || 'bg-blue-500',
    metadata: {
      expenseId: expense.id,
      categoryId: expense.category_id,
      accountId: expense.account_id,
      amount: expense.amount,
    },
  };
}

export function balanceEntryToTimelineItem(entry: BalanceEntry): TimelineItem {
  const isCredit = entry.type === 'credit';
  return {
    id: entry.id,
    timestamp: new Date(entry.date),
    type: isCredit ? 'credit' : 'debit',
    title: entry.note || (isCredit ? 'Credit' : 'Debit'),
    description: `${isCredit ? '+' : '-'}${formatCurrency(entry.amount)}`,
    sourceModule: 'finance',
    icon: isCredit ? 'trending-up' : 'trending-down',
    color: isCredit ? 'bg-green-500' : 'bg-red-500',
    metadata: {
      entryId: entry.id,
      amount: entry.amount,
      type: entry.type,
    },
  };
}

export function recurringExpenseToTimelineItem(recurring: RecurringExpense): TimelineItem {
  return {
    id: recurring.id,
    timestamp: new Date(recurring.next_due_date),
    type: 'recurring',
    title: recurring.name,
    description: `${formatCurrency(recurring.amount)} • ${recurring.frequency}`,
    sourceModule: 'finance',
    icon: 'repeat',
    color: 'bg-purple-500',
    metadata: {
      recurringId: recurring.id,
      amount: recurring.amount,
      frequency: recurring.frequency,
    },
  };
}

// Goals Adapters
export function goalToTimelineItem(goal: Goal): TimelineItem {
  return {
    id: goal.id,
    timestamp: new Date(goal.created_at),
    type: 'goal-created',
    title: `Created goal: ${goal.title}`,
    description: goal.description || undefined,
    sourceModule: 'goals',
    icon: goal.icon,
    color: goal.color,
    metadata: {
      goalId: goal.id,
      targetAmount: goal.target_amount,
      targetDate: goal.target_date,
    },
  };
}

export function contributionToTimelineItem(contribution: GoalContribution, goal: Goal): TimelineItem {
  return {
    id: contribution.id,
    timestamp: new Date(contribution.date),
    type: 'goal-contribution',
    title: `Contributed to ${goal.title}`,
    description: `${formatCurrency(contribution.amount)}${contribution.note ? ` • ${contribution.note}` : ''}`,
    sourceModule: 'goals',
    icon: 'piggy-bank',
    color: goal.color,
    metadata: {
      contributionId: contribution.id,
      goalId: contribution.goal_id,
      amount: contribution.amount,
    },
  };
}

export function goalCompletedToTimelineItem(goal: Goal): TimelineItem {
  return {
    id: `${goal.id}-completed`,
    timestamp: new Date(),
    type: 'goal-completed',
    title: `🎉 Goal completed: ${goal.title}`,
    description: `Reached ${formatCurrency(goal.target_amount)}`,
    sourceModule: 'goals',
    icon: 'trophy',
    color: 'bg-yellow-500',
    metadata: {
      goalId: goal.id,
      targetAmount: goal.target_amount,
    },
  };
}
