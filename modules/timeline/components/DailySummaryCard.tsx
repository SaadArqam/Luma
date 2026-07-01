import type { DailySummary } from '../types';
import { CheckCircle, Mic, TrendingUp } from 'lucide-react';

interface DailySummaryCardProps {
  summary: DailySummary;
}

export function DailySummaryCard({ summary }: DailySummaryCardProps) {
  return (
    <div className="mb-6 p-5 bg-card rounded-2xl border border-border/50 elevation-subtle">
      <p className="text-body text-text-secondary leading-relaxed">
        {summary.summaryText || generateDefaultSummary(summary)}
      </p>
    </div>
  );
}

function generateDefaultSummary(summary: DailySummary): string {
  const parts: string[] = [];

  if (summary.habitsCompleted && summary.habitsCompleted > 0) {
    parts.push(`completed ${summary.habitsCompleted} habit${summary.habitsCompleted > 1 ? 's' : ''}`);
  }

  if (summary.capturesCount && summary.capturesCount > 0) {
    parts.push(`captured ${summary.capturesCount} idea${summary.capturesCount > 1 ? 's' : ''}`);
  }

  if (summary.budgetStatus === 'within') {
    parts.push('stayed within your budget');
  } else if (summary.budgetStatus === 'under') {
    parts.push('spent less than your budget');
  } else if (summary.budgetStatus === 'over') {
    parts.push('exceeded your budget');
  }

  if (parts.length === 0) {
    return 'A quiet day. Every moment matters.';
  }

  return `You ${parts.join(', ')}.`;
}
