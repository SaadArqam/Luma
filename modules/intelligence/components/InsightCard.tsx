'use client';

import { CheckCircle2, AlertCircle, Info, Lightbulb, Loader2 } from 'lucide-react';
import type { Insight } from '../types';
import { cn } from '@/modules/shared/utils';

interface InsightCardProps {
  insight: Insight;
}

const iconMap = {
  positive: CheckCircle2,
  warning: AlertCircle,
  info: Info,
  suggestion: Lightbulb,
};

const colorMap = {
  positive: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
  warning: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20',
  info: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
  suggestion: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20',
};

export function InsightCard({ insight }: InsightCardProps) {
  const Icon = iconMap[insight.type];

  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-xl', colorMap[insight.type]}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text">{insight.title}</h3>
          <p className="text-muted-foreground text-sm mt-1">
            {insight.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
        <span className="capitalize">{insight.source}</span>
        <span>•</span>
        <span className="capitalize">{insight.priority} priority</span>
      </div>
    </div>
  );
}
