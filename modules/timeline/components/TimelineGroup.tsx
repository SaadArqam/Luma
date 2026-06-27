import type { TimelineGroup as TimelineGroupType } from '../types';
import { TimelineCard } from './TimelineCard';

interface TimelineGroupProps {
  group: TimelineGroupType;
}

export function TimelineGroup({ group }: TimelineGroupProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 sticky top-0 bg-gray-50 dark:bg-gray-900 py-2 z-10">
        {group.label}
      </h2>
      <div className="space-y-1">
        {group.events.map((event, index) => (
          <TimelineCard
            key={event.id}
            event={event}
            isFirst={index === 0}
            isLast={index === group.events.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
