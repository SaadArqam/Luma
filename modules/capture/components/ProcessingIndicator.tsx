'use client'

import { cn } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'

interface ProcessingIndicatorProps {
  message?: string
  className?: string
}

export function ProcessingIndicator({ message = "Saved. Luma is organizing it.", className }: ProcessingIndicatorProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 bg-surface rounded-xl border border-border/50",
      "motion-fast motion-ease-out",
      className
    )}>
      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle className="w-5 h-5 text-success" />
      </div>
      <p className="text-body text-text-primary">{message}</p>
    </div>
  )
}
