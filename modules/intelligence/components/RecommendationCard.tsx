'use client';

import { Lightbulb, ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function RecommendationCard({ 
  title,
  description,
  actionText = 'Take Action',
  onAction
}: RecommendationCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
          <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text">{title}</h3>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
          {onAction && (
            <button
              onClick={onAction}
              className="mt-3 flex items-center gap-1 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              {actionText}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
