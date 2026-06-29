'use client';

import { Card } from '@/components/ui/card';
import { ContextBadge } from './ContextBadge';
import type { ContextEntity } from '../types';

interface RelatedEntityListProps {
  entities: ContextEntity[];
  title?: string;
  maxItems?: number;
  onEntityClick?: (entity: ContextEntity) => void;
}

export function RelatedEntityList({ 
  entities, 
  title = 'Related Items',
  maxItems = 5,
  onEntityClick 
}: RelatedEntityListProps) {
  const displayEntities = entities.slice(0, maxItems);

  if (displayEntities.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold text-text">{title}</h3>
      <div className="space-y-2">
        {displayEntities.map((entity) => (
          <div
            key={entity.id}
            onClick={() => onEntityClick?.(entity)}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-surface/50 cursor-pointer transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">
                {(entity.data as any).title || (entity.data as any).name || entity.type}
              </p>
              <p className="text-xs text-muted-foreground">
                {entity.sourceModule}
              </p>
            </div>
            <ContextBadge entity={entity} />
          </div>
        ))}
      </div>
      {entities.length > maxItems && (
        <p className="text-xs text-muted-foreground text-center">
          +{entities.length - maxItems} more
        </p>
      )}
    </Card>
  );
}
