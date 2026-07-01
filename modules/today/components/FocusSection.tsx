'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Calendar, Target, Clock } from 'lucide-react'

interface FocusItem {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  icon?: React.ReactNode
  action?: string
}

interface FocusSectionProps {
  items?: FocusItem[]
  className?: string
}

const iconMap = {
  bill: Calendar,
  goal: Target,
  event: Clock,
  default: AlertCircle,
}

export function FocusSection({ items = [], className }: FocusSectionProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className={cn('px-4 mb-6', className)}>
      <h2 className="text-heading text-text-primary tracking-tight mb-4">Focus</h2>
      <div className="space-y-3">
        {items.slice(0, 3).map((item) => (
          <Card key={item.id} className="elevation-subtle motion-fast motion-ease-out">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  item.priority === 'high' ? 'bg-danger/10 text-danger' : 'bg-accent/10 text-accent'
                )}>
                  {item.icon || <AlertCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-title text-text-primary tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-body text-text-secondary mb-2">
                    {item.description}
                  </p>
                  {item.action && (
                    <button className="text-caption text-accent font-medium hover:underline">
                      {item.action}
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
