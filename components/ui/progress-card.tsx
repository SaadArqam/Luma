import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ProgressCardProps {
  title: string
  progress: string | number
  total?: string | number
  icon?: ReactNode
  className?: string
}

export function ProgressCard({ title, progress, total, icon, className }: ProgressCardProps) {
  // Extract numeric values for percentage calculation
  const progressNum = typeof progress === 'string' ? parseFloat(progress.replace(/[^0-9.-]+/g, '')) || 0 : progress
  const totalNum = typeof total === 'string' ? parseFloat(total.replace(/[^0-9.-]+/g, '')) || 0 : total
  const percentage = totalNum ? (progressNum / totalNum) * 100 : progressNum

  return (
    <div className={cn('bg-card border border-border rounded-2xl p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text font-medium">{progress}</span>
          {total && <span className="text-muted-foreground">of {total}</span>}
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
