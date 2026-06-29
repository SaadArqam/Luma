'use client';

import { Card } from '@/components/ui/card';
import type { BaseContext } from '../types';

interface ContextSummaryProps {
  context: BaseContext;
  showDetails?: boolean;
}

export function ContextSummary({ context, showDetails = false }: ContextSummaryProps) {
  const entityCount = context.activeGoals.length + 
                      context.recentActivity.length + 
                      context.importantDeadlines.length + 
                      context.relevantEntities.length;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text">Context Summary</h3>
        <span className="text-sm text-muted-foreground">
          {entityCount} entities
        </span>
      </div>

      {showDetails && (
        <div className="space-y-2 text-sm">
          {context.activeGoals.length > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Goals</span>
              <span className="font-medium">{context.activeGoals.length}</span>
            </div>
          )}
          {context.recentActivity.length > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recent Activity</span>
              <span className="font-medium">{context.recentActivity.length}</span>
            </div>
          )}
          {context.importantDeadlines.length > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deadlines</span>
              <span className="font-medium">{context.importantDeadlines.length}</span>
            </div>
          )}
          {context.contextualRecommendations.length > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recommendations</span>
              <span className="font-medium">{context.contextualRecommendations.length}</span>
            </div>
          )}
        </div>
      )}

      {context.currentFocus && (
        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-text">Current Focus:</span> {context.currentFocus}
          </p>
        </div>
      )}
    </Card>
  );
}
