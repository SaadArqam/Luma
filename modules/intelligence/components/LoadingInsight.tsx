'use client';

import { Loader2 } from 'lucide-react';

export function LoadingInsight() {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 py-2">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground text-sm">Generating insights...</span>
      </div>
    </div>
  );
}
