import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: string | number
    positive?: boolean
  }
  icon?: ReactNode
  className?: string
}

export function MetricCard({ title, value, change, icon, className }: MetricCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-2xl p-6 space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-text">{value}</div>
      {change && (
        <div className={cn(
          'text-sm font-medium',
          change.positive ? 'text-success' : 'text-danger'
        )}>
          {change.positive ? '+' : ''}{change.value}
        </div>
      )}
    </div>
  )
}
