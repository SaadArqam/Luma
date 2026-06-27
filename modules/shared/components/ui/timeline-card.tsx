import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TimelineCardProps {
  title: string
  description?: string
  time?: string
  icon?: ReactNode
  className?: string
}

export function TimelineCard({ title, description, time, icon, className }: TimelineCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-4 space-y-2', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h4 className="font-medium text-text">{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {icon}
      </div>
      {time && (
        <div className="text-xs text-muted-foreground">{time}</div>
      )}
    </div>
  )
}
