import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface WidgetContainerProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function WidgetContainer({ children, className, title, description, icon, action }: WidgetContainerProps) {
  return (
    <div className={cn('bg-card border border-border rounded-2xl overflow-hidden', className)}>
      {title && (
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <h3 className="font-semibold text-text">{title}</h3>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
