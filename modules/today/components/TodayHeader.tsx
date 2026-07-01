'use client'

import { cn } from '@/lib/utils'

interface TodayHeaderProps {
  className?: string
}

export function TodayHeader({ className }: TodayHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  const getContextualSubtitle = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Fresh start. Your day awaits.'
    if (hour < 17) return 'Afternoon in progress. You\'re doing well.'
    return 'Quiet evening. Everything looks under control.'
  }

  return (
    <header className={cn('px-4 pt-6 pb-4 space-y-1', className)}>
      <h1 className="text-display text-text-primary tracking-tight">
        {getGreeting()}, Saad.
      </h1>
      <p className="text-body text-text-secondary">
        {formatDate()}
      </p>
      <p className="text-caption text-text-muted">
        {getContextualSubtitle()}
      </p>
    </header>
  )
}
