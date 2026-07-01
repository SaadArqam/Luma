'use client'

import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface FloatingCaptureButtonProps {
  onClick?: () => void
  className?: string
}

export function FloatingCaptureButton({ onClick, className }: FloatingCaptureButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[var(--z-fixed)]',
        'w-14 h-14 rounded-full bg-accent text-accent-foreground',
        'flex items-center justify-center shadow-lg',
        'motion-fast motion-ease-out',
        'hover:scale-110 active:scale-95',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'transition-transform',
        className
      )}
      aria-label="Quick capture"
    >
      <Plus className="w-6 h-6" />
    </button>
  )
}
