'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  side?: 'right' | 'left'
}

export function Sheet({ open, onClose, children, className, side = 'right' }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed top-0 bottom-0 w-full max-w-sm bg-card border-l border-border z-50 shadow-xl',
          'transition-transform duration-300 ease-in-out',
          side === 'right' ? 'right-0' : 'left-0',
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <div className="overflow-y-auto h-full p-4">
          {children}
        </div>
      </div>
    </>
  )
}
