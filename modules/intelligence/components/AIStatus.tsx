'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/modules/shared/utils';

interface AIStatusProps {
  status: 'idle' | 'loading' | 'ready' | 'error';
}

export function AIStatus({ status }: AIStatusProps) {
  const statusConfig = {
    idle: { icon: Sparkles, text: 'AI Ready', color: 'text-muted-foreground' },
    loading: { icon: Sparkles, text: 'AI Working...', color: 'text-blue-500' },
    ready: { icon: Sparkles, text: 'AI Ready', color: 'text-green-500' },
    error: { icon: Sparkles, text: 'AI Error', color: 'text-red-500' },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon className={cn('w-4 h-4', config.color, status === 'loading' && 'animate-spin')} />
      <span className={cn('text-sm', config.color)}>
        {config.text}
      </span>
    </div>
  );
}
