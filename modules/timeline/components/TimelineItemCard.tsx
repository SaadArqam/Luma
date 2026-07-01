'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import type { TimelineItem } from '../types';
import { getTimelineIcon, getTimelineColor } from '../utils';
import { ArrowRight, MoreVertical } from 'lucide-react';

interface TimelineItemCardProps {
  item: TimelineItem;
  isFirst?: boolean;
  isLast?: boolean;
}

export function TimelineItemCard({ item, isFirst, isLast }: TimelineItemCardProps) {
  const Icon = getTimelineIcon(item.type);
  const color = getTimelineColor(item.type);
  const hasDeepLink = item.deepLink && item.entityId;
  const hasActions = item.actions && item.actions.length > 0;

  const content = (
    <div className="relative flex gap-4 pb-3">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-0.5 h-full bg-border/30" />
      )}

      {/* Icon */}
      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-background shadow-sm elevation-subtle">
        <div className={`flex h-full w-full items-center justify-center rounded-full ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        {/* Title and timestamp */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-title font-medium text-text-primary">{item.title}</h3>
          <span className="text-caption text-text-muted">
            {format(item.timestamp, 'h:mm a')}
          </span>
        </div>

        {/* Context */}
        {item.context && (
          <p className="text-body text-text-secondary mb-1">{item.context}</p>
        )}

        {/* Description */}
        {item.description && (
          <p className="text-body text-text-secondary mb-2">{item.description}</p>
        )}

        {/* Preview */}
        {item.preview && (
          <div className="mb-2 p-3 bg-muted-surface rounded-lg">
            <p className="text-caption text-text-muted line-clamp-2">{item.preview}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Date and source */}
          <div className="flex items-center gap-2 text-caption text-text-muted">
            <span>{format(item.timestamp, 'MMM d, yyyy')}</span>
            <span className="text-border/50">•</span>
            <span className="capitalize">{item.sourceModule}</span>
          </div>

          {/* Actions or deep link */}
          <div className="flex items-center gap-2">
            {hasDeepLink && (
              <div className="flex items-center gap-1 text-caption text-accent">
                <span>View</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            )}
            {hasActions && (
              <button
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted-surface transition-colors motion-fast"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4 text-text-muted" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (hasDeepLink) {
    return (
      <Link 
        href={item.deepLink!} 
        className="block hover:bg-muted-surface/50 rounded-2xl p-3 -mx-3 transition-colors motion-fast"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="hover:bg-muted-surface/50 rounded-2xl p-3 -mx-3 transition-colors motion-fast">
      {content}
    </div>
  );
}
