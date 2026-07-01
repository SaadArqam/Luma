'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, CheckSquare, Target, Sparkles, Clock, FileText } from 'lucide-react'

interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: Date
  type: 'transaction' | 'capture' | 'journal' | 'habit' | 'ai' | 'goal'
  amount?: number
}

interface RecentTimelinePreviewProps {
  items?: TimelineItem[]
  className?: string
}

const iconMap = {
  transaction: DollarSign,
  capture: Sparkles,
  journal: FileText,
  habit: CheckSquare,
  ai: Sparkles,
  goal: Target,
}

const typeLabels = {
  transaction: 'Expense',
  capture: 'Capture',
  journal: 'Journal',
  habit: 'Habit',
  ai: 'Insight',
  goal: 'Goal',
}

export function RecentTimelinePreview({ items = [], className }: RecentTimelinePreviewProps) {
  if (items.length === 0) {
    return null
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <section className={cn('px-4 mb-6', className)}>
      <h2 className="text-heading text-text-primary tracking-tight mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {items.slice(0, 5).map((item) => {
          const Icon = iconMap[item.type]
          return (
            <Card key={item.id} className="elevation-subtle motion-fast motion-ease-out">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-title text-text-primary tracking-tight">
                        {item.title}
                      </h3>
                      {item.amount !== undefined && (
                        <span className="text-amount text-text-primary">
                          {formatAmount(item.amount)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-caption text-text-muted">
                      <span>{typeLabels[item.type]}</span>
                      <span>•</span>
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                    {item.description && (
                      <p className="text-body text-text-secondary mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
