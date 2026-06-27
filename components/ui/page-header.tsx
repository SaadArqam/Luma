import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  children: ReactNode
  className?: string
}

export function PageHeader({ children, className }: PageHeaderProps) {
  return (
    <div className={cn('space-y-1 mb-6', className)}>
      {children}
    </div>
  )
}

interface PageTitleProps {
  children: ReactNode
  className?: string
}

export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1 className={cn('text-3xl font-bold tracking-tight text-text', className)}>
      {children}
    </h1>
  )
}

interface PageDescriptionProps {
  children: ReactNode
  className?: string
}

export function PageDescription({ children, className }: PageDescriptionProps) {
  return (
    <p className={cn('text-muted-foreground', className)}>
      {children}
    </p>
  )
}
