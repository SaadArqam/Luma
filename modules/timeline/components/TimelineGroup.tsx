import type { TimelineGroup as TimelineGroupType } from '../types';
import { TimelineItemCard } from './TimelineItemCard';
import { DailySummaryCard } from './DailySummaryCard';
import { ReflectionCard } from './ReflectionCard';

interface TimelineGroupProps {
  group: TimelineGroupType;
}

export function TimelineGroup({ group }: TimelineGroupProps) {
  return (
    <div className="mb-8">
      <h2 className="text-heading font-semibold text-text-primary mb-4 sticky top-0 bg-background/95 backdrop-blur-sm py-3 z-10">
        {group.label}
      </h2>
      
      {/* Daily Summary */}
      {group.dailySummary && (
        <DailySummaryCard summary={group.dailySummary} />
      )}
      
      {/* Reflections */}
      {group.reflections && group.reflections.length > 0 && (
        <div className="mb-4">
          {group.reflections.map((reflection) => (
            <ReflectionCard key={reflection.id} reflection={reflection} />
          ))}
        </div>
      )}
      
      {/* Timeline Items */}
      <div className="space-y-3">
        {group.items.map((item, index) => (
          <TimelineItemCard
            key={item.id}
            item={item}
            isFirst={index === 0}
            isLast={index === group.items.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
