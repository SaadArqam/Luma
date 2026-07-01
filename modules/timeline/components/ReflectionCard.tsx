import type { Reflection } from '../types';
import { Sparkles, TrendingUp, Lightbulb } from 'lucide-react';

interface ReflectionCardProps {
  reflection: Reflection;
}

export function ReflectionCard({ reflection }: ReflectionCardProps) {
  const getIcon = () => {
    switch (reflection.type) {
      case 'pattern':
        return TrendingUp;
      case 'insight':
        return Sparkles;
      case 'observation':
        return Lightbulb;
      default:
        return Sparkles;
    }
  };

  const Icon = getIcon();

  return (
    <div className="mb-4 p-5 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/10 rounded-2xl border border-violet-200/50 dark:border-violet-800/30 elevation-subtle">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1">
          <p className="text-body text-text-primary leading-relaxed">
            {reflection.text}
          </p>
        </div>
      </div>
    </div>
  );
}
