'use client';

import { Badge } from '@/components/ui/badge';
import { relevanceScorer } from '../services';
import type { ContextEntity } from '../types';

interface ContextBadgeProps {
  entity: ContextEntity;
  showScore?: boolean;
}

export function ContextBadge({ entity, showScore = false }: ContextBadgeProps) {
  const relevanceLevel = relevanceScorer.getRelevanceLevel(entity.relevanceScore);
  
  const levelColors = {
    high: 'bg-accent/10 text-accent border-accent/20',
    medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    low: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };

  return (
    <Badge variant="outline" className={levelColors[relevanceLevel]}>
      {entity.type}
      {showScore && (
        <span className="ml-1 text-xs opacity-70">
          ({Math.round(entity.relevanceScore * 100)}%)
        </span>
      )}
    </Badge>
  );
}
