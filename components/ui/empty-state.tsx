import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && (
        <div className="mb-6 text-text-muted opacity-soft">
          {icon}
        </div>
      )}
      <h3 className="text-title text-text-primary tracking-tight mb-3">{title}</h3>
      {description && (
        <p className="text-body text-text-muted mb-8 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  )
}
