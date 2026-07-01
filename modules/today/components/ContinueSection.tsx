'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Target, FileText, ArrowRight } from 'lucide-react'

interface ContinueItem {
  id: string
  title: string
  subtitle: string
  type: 'journal' | 'goal' | 'planning' | 'notes'
  href?: string
}

interface ContinueSectionProps {
  items?: ContinueItem[]
  className?: string
}

const iconMap = {
  journal: BookOpen,
  goal: Target,
  planning: FileText,
  notes: FileText,
}

export function ContinueSection({ items = [], className }: ContinueSectionProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className={cn('px-4 mb-6', className)}>
      <h2 className="text-heading text-text-primary tracking-tight mb-4">Continue</h2>
      <div className="space-y-3">
        {items.slice(0, 3).map((item) => {
          const Icon = iconMap[item.type]
          return (
            <Card key={item.id} className="elevation-subtle motion-fast motion-ease-out cursor-pointer hover:translate-x-1 transition-transform">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-title text-text-primary tracking-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-body text-text-secondary">
                      {item.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-muted flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
