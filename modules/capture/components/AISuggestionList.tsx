'use client'

import { cn } from '@/lib/utils'
import { Sparkles, DollarSign, CheckSquare, Target, Calendar } from 'lucide-react'

interface AISuggestion {
  id: string
  type: 'expense' | 'task' | 'goal' | 'event' | 'journal'
  title: string
  confidence?: number
}

interface AISuggestionListProps {
  content: string
  className?: string
}

// Mock suggestions - in production this would come from AI analysis
const mockSuggestions: AISuggestion[] = [
  {
    id: '1',
    type: 'expense',
    title: 'Expense detected: Spent 500 on groceries',
    confidence: 0.95
  },
  {
    id: '2',
    type: 'goal',
    title: 'Goal progress: Vacation savings at 60%',
    confidence: 0.88
  }
]

const iconMap = {
  expense: DollarSign,
  task: CheckSquare,
  goal: Target,
  event: Calendar,
  journal: Sparkles
}

export function AISuggestionList({ content, className }: AISuggestionListProps) {
  // In production, this would analyze content and return real suggestions
  const suggestions = content.length > 10 ? mockSuggestions : []

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-caption text-text-muted">
        <Sparkles className="w-3 h-3" />
        <span>AI suggestions</span>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((suggestion) => {
          const Icon = iconMap[suggestion.type]
          return (
            <div
              key={suggestion.id}
              className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border/50"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-body text-text-primary">{suggestion.title}</p>
              </div>
              {suggestion.confidence && (
                <span className="text-caption text-text-muted">
                  {Math.round(suggestion.confidence * 100)}%
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
