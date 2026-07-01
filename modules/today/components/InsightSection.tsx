'use client'

import { cn } from '@/lib/utils'
import { InsightCard } from './InsightCard'

interface Insight {
  id: string
  title: string
  description: string
  type?: 'positive' | 'negative' | 'neutral' | 'warning'
}

interface InsightSectionProps {
  insights?: Insight[]
  className?: string
}

export function InsightSection({ insights = [], className }: InsightSectionProps) {
  if (insights.length === 0) {
    return null
  }

  return (
    <section className={cn('px-4 mb-6', className)}>
      <h2 className="text-heading text-text-primary tracking-tight mb-4">Insights</h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            title={insight.title}
            description={insight.description}
            type={insight.type}
          />
        ))}
      </div>
    </section>
  )
}
