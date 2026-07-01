'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CaptureInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  maxLength?: number
}

export function CaptureInput({ 
  value, 
  onChange, 
  placeholder = "What's on your mind?", 
  disabled = false,
  maxLength = 2000 
}: CaptureInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= maxLength) {
      onChange(newValue)
    }
  }

  const characterCount = value.length
  const isNearLimit = characterCount > maxLength * 0.9

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={cn(
          "w-full min-h-[120px] max-h-[300px] p-4",
          "bg-surface border border-border rounded-2xl",
          "text-body text-text-primary placeholder:text-text-muted",
          "resize-none focus:outline-none focus:ring-2 focus:ring-accent/50",
          "motion-fast motion-ease-out",
          "transition-all"
        )}
        style={{ height: 'auto' }}
      />
      
      {/* Character Count */}
      <div className="flex justify-end">
        <span className={cn(
          "text-caption",
          isNearLimit ? "text-warning" : "text-text-muted"
        )}>
          {characterCount}/{maxLength}
        </span>
      </div>
    </div>
  )
}
