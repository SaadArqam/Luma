import { Recommendation } from '../types';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAction?: (action: string) => void;
}

export function RecommendationCard({ recommendation, onAction }: RecommendationCardProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl p-4 mb-3">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Lightbulb className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text mb-1">{recommendation.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{recommendation.message}</p>
          {recommendation.action && (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-600 h-8 px-3"
              onClick={() => onAction?.(recommendation.action!)}
            >
              {recommendation.action}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
