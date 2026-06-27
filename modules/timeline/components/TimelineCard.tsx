'use client';

import { Calendar, Clock, CreditCard, TrendingUp, TrendingDown, Repeat, Target, PiggyBank, Trophy, Ellipsis } from 'lucide-react';
import { format } from 'date-fns';
import type { TimelineEvent } from '../types';
import { cn } from '@/modules/shared/utils';

interface TimelineCardProps {
  event: TimelineEvent;
  isFirst?: boolean;
  isLast?: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'credit-card': CreditCard,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'repeat': Repeat,
  'target': Target,
  'piggy-bank': PiggyBank,
  'trophy': Trophy,
  'clock': Clock,
  'ellipsis': Ellipsis,
};

export function TimelineCard({ event, isFirst, isLast }: TimelineCardProps) {
  const Icon = iconMap[event.icon] || Ellipsis;

  return (
    <div className="relative flex gap-4 pb-8">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
      )}

      {/* Icon */}
      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
        <div className={cn('flex h-full w-full items-center justify-center rounded-full', event.color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {format(event.timestamp, 'h:mm a')}
          </span>
        </div>
        {event.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{event.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>{format(event.timestamp, 'MMM d, yyyy')}</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className="capitalize">{event.sourceModule}</span>
        </div>
      </div>
    </div>
  );
}
