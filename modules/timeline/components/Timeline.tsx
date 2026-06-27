import type { TimelineEvent } from '../types';
import { groupTimelineEvents } from '../utils';
import { TimelineGroup } from './TimelineGroup';
import { EmptyState } from '@/components/ui';

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const groups = groupTimelineEvents(events);

  if (groups.length === 0) {
    return (
      <EmptyState
        icon="clock"
        title="No events yet"
        description="Your timeline will show all your activity from Finance and Goals."
      />
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <TimelineGroup key={group.label} group={group} />
      ))}
    </div>
  );
}
