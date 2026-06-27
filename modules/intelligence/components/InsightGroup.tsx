'use client';

import { InsightCard } from './InsightCard';
import type { Insight } from '../types';

interface InsightGroupProps {
  insights: Insight[];
  title?: string;
}

export function InsightGroup({ insights, title }: InsightGroupProps) {
  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {title && <h2 className="text-lg font-semibold text-text">{title}</h2>}
      <div className="space-y-3">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}
