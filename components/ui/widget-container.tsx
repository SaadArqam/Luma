import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface WidgetContainerProps {
  children: ReactNode
  className?: string
  title?: string
}

export function WidgetContainer({ children, className, title }: WidgetContainerProps) {
  return (
    <div className={cn('bg-card border border-border rounded-2xl overflow-hidden', className)}>
      {title && (
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-text">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
