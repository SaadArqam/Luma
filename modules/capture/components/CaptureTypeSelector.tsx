'use client'

import { cn } from '@/lib/utils'
import { Keyboard, Mic } from 'lucide-react'
import type { CaptureMode } from './CaptureSheet'

interface CaptureTypeSelectorProps {
  mode: CaptureMode
  onModeChange: (mode: CaptureMode) => void
}

export function CaptureTypeSelector({ mode, onModeChange }: CaptureTypeSelectorProps) {
  return (
    <div className="flex gap-2 p-1 bg-surface rounded-xl">
      <button
        onClick={() => onModeChange('text')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
          "text-body font-medium motion-fast motion-ease-out",
          mode === 'text'
            ? "bg-card text-text-primary shadow-sm"
            : "text-text-muted hover:text-text-primary hover:bg-card/50"
        )}
      >
        <Keyboard className="w-4 h-4" />
        <span>Text</span>
      </button>
      
      <button
        onClick={() => onModeChange('voice')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
          "text-body font-medium motion-fast motion-ease-out",
          mode === 'voice'
            ? "bg-card text-text-primary shadow-sm"
            : "text-text-muted hover:text-text-primary hover:bg-card/50"
        )}
      >
        <Mic className="w-4 h-4" />
        <span>Voice</span>
      </button>
    </div>
  )
}
