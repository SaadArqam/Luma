'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'

interface InsightCardProps {
  title: string
  description: string
  type?: 'positive' | 'negative' | 'neutral' | 'warning'
  className?: string
}

export function InsightCard({ title, description, type = 'neutral', className }: InsightCardProps) {
  const iconMap = {
    positive: TrendingUp,
    negative: TrendingDown,
    neutral: CheckCircle,
    warning: AlertTriangle,
  }

  const colorMap = {
    positive: 'text-success bg-success/10',
    negative: 'text-danger bg-danger/10',
    neutral: 'text-accent bg-accent/10',
    warning: 'text-warning bg-warning/10',
  }

  const Icon = iconMap[type]

  return (
    <Card className={cn('elevation-subtle motion-fast motion-ease-out', className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', colorMap[type])}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-title text-text-primary tracking-tight mb-1">
              {title}
            </h3>
            <p className="text-body text-text-secondary">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
