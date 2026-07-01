'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Target, CheckSquare, Clock } from 'lucide-react'

interface UpcomingItem {
  id: string
  title: string
  date: string
  time?: string
  type: 'bill' | 'calendar' | 'habit' | 'goal' | 'task'
}

interface UpcomingSectionProps {
  items?: UpcomingItem[]
  className?: string
}

const iconMap = {
  bill: Calendar,
  calendar: Calendar,
  habit: CheckSquare,
  goal: Target,
  task: Clock,
}

const typeLabels = {
  bill: 'Bill',
  calendar: 'Event',
  habit: 'Habit',
  goal: 'Goal',
  task: 'Task',
}

export function UpcomingSection({ items = [], className }: UpcomingSectionProps) {
  if (items.length === 0) {
    return null
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <section className={cn('px-4 mb-6', className)}>
      <h2 className="text-heading text-text-primary tracking-tight mb-4">Upcoming</h2>
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
                    <h3 className="text-title text-text-primary tracking-tight mb-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-caption text-text-muted">
                      <span>{typeLabels[item.type]}</span>
                      <span>•</span>
                      <span>{formatDate(item.date)}</span>
                      {item.time && (
                        <>
                          <span>•</span>
                          <span>{item.time}</span>
                        </>
                      )}
                    </div>
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
