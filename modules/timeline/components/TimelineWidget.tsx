'use client';

import type { TimelineEvent } from '../types';
import { groupTimelineEvents } from '../utils';
import { TimelineCard } from './TimelineCard';
import { EmptyState, Section } from '@/components/ui';
import { SectionHeader } from '@/modules/shared/components/layout';
import Link from 'next/link';

interface TimelineWidgetProps {
  events: TimelineEvent[];
  limit?: number;
}

export function TimelineWidget({ events, limit = 5 }: TimelineWidgetProps) {
  const recentEvents = events.slice(0, limit);

  if (recentEvents.length === 0) {
    return (
      <Section>
        <SectionHeader title="Timeline" />
        <EmptyState
          icon="clock"
          title="No recent activity"
          description="Start tracking your goals and finances to see activity here."
          small
        />
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader
        title="Timeline"
        action={
          <Link href="/timeline" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View all
          </Link>
        }
      />
      <div className="space-y-4">
        {recentEvents.map((event, index) => (
          <TimelineCard
            key={event.id}
            event={event}
            isFirst={index === 0}
            isLast={index === recentEvents.length - 1}
          />
        ))}
      </div>
    </Section>
  );
}
