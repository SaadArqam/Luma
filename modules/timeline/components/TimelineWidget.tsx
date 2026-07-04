'use client';

import type { TimelineItem } from '../types';
import { groupTimelineItems } from '../utils';
import { TimelineCard } from './TimelineCard';
import { EmptyState, Section } from '@/components/ui';
import { SectionHeader } from '@/modules/shared/components/layout';
import Link from 'next/link';

interface TimelineWidgetProps {
  events: TimelineItem[];
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
        />
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader
        title="Timeline"
        cta="View all"
        href="/timeline"
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
