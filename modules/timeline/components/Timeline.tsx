import type { TimelineItem } from '../types';
import { groupTimelineItems } from '../utils';
import { TimelineGroup } from './TimelineGroup';
import { TimelineEmptyState } from './TimelineEmptyState';
import { TimelineSkeletonState } from './TimelineSkeletonState';

interface TimelineProps {
  items: TimelineItem[];
  loading?: boolean;
}

export function Timeline({ items, loading = false }: TimelineProps) {
  if (loading) {
    return <TimelineSkeletonState />;
  }

  const groups = groupTimelineItems(items);

  if (groups.length === 0) {
    return <TimelineEmptyState />;
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <TimelineGroup key={group.label} group={group} />
      ))}
    </div>
  );
}
