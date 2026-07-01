'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

interface DailyBriefCardProps {
  content?: string
  isLoading?: boolean
  isEmpty?: boolean
  className?: string
}

export function DailyBriefCard({ content, isLoading, isEmpty, className }: DailyBriefCardProps) {
  if (isLoading) {
    return (
      <Card className={cn('mx-4 mb-3', className)}>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-accent/20 animate-pulse" />
            <div className="h-4 w-24 bg-surface rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-surface rounded animate-pulse w-full" />
            <div className="h-3 bg-surface rounded animate-pulse w-5/6" />
            <div className="h-3 bg-surface rounded animate-pulse w-4/6" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isEmpty) {
    return (
      <Card className={cn('mx-4 mb-3', className)}>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-accent mt-0.5" />
            <div className="flex-1">
              <p className="text-body text-text-secondary leading-relaxed">
                Your day looks beautifully quiet. Nothing needs your attention right now.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('mx-4 mb-3', className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-body text-text-primary leading-relaxed">
              {content || "You spent less than usual today, completed your reading habit, and have one electricity bill due tomorrow."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
