'use client';

import { CheckCircle2, AlertCircle, Info, Lightbulb, Sparkles } from 'lucide-react';
import type { Insight } from '../types';
import { cn } from '@/modules/shared/utils';
import { format } from 'date-fns';

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

const confidenceColors = {
  low: 'text-gray-500 dark:text-gray-400',
  medium: 'text-blue-500 dark:text-blue-400',
  high: 'text-green-500 dark:text-green-400',
};

export function InsightCard({ insight }: InsightCardProps) {
  const Icon = iconMap[insight.type];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-start gap-4">
        <div className={cn('p-3 rounded-xl', colorMap[insight.type])}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-text text-lg">{insight.title}</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5" />
              <span className={cn(confidenceColors[insight.confidence])}>
                {insight.confidence} confidence
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {insight.summary}
          </p>
        </div>
      </div>

      {insight.suggestedActions && insight.suggestedActions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Suggested Actions
          </p>
          <ul className="space-y-1">
            {insight.suggestedActions.map((action, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border/50 mt-2">
        <span className="capitalize px-2 py-0.5 bg-muted rounded-full">{insight.category}</span>
        <span>•</span>
        <span className="capitalize">{insight.priority} priority</span>
        <span>•</span>
        <span>{format(new Date(insight.createdAt), 'MMM d, h:mm a')}</span>
      </div>
    </div>
  );
}
