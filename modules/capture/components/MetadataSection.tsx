'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Tag, MapPin, Clock, Paperclip, X } from 'lucide-react'

interface MetadataSectionProps {
  onToggle: () => void
}

export function MetadataSection({ onToggle }: MetadataSectionProps) {
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [hasReminder, setHasReminder] = useState(false)
  const [reminderTime, setReminderTime] = useState('')

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="space-y-4 p-4 bg-surface rounded-xl border border-border/50">
      <div className="flex items-center justify-between">
        <h3 className="text-title text-text-primary">Details</h3>
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-card motion-fast motion-ease-out"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-caption text-text-muted">
          <Tag className="w-3 h-3" />
          <span>Tags</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 px-2 py-1 bg-card rounded-lg text-caption text-text-primary"
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-text-muted motion-fast motion-ease-out"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              placeholder="Add tag..."
              className="px-2 py-1 bg-card rounded-lg text-caption text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              onClick={addTag}
              className="px-2 py-1 bg-accent text-accent-foreground rounded-lg text-caption font-medium motion-fast motion-ease-out hover:scale-105 active:scale-95"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-caption text-text-muted">
          <MapPin className="w-3 h-3" />
          <span>Location</span>
        </div>
        <input
          type="text"
          placeholder="Add location..."
          className="w-full px-3 py-2 bg-card rounded-lg text-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Reminder */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-caption text-text-muted">
          <Clock className="w-3 h-3" />
          <span>Reminder</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHasReminder(!hasReminder)}
            className={cn(
              "w-10 h-6 rounded-full transition-colors motion-fast motion-ease-out",
              hasReminder ? "bg-accent" : "bg-border"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full bg-white transition-transform motion-fast motion-ease-out",
                hasReminder ? "translate-x-5" : "translate-x-1"
              )}
            />
          </button>
          {hasReminder && (
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="px-3 py-2 bg-card rounded-lg text-body text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          )}
        </div>
      </div>

      {/* Attachments */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-caption text-text-muted">
          <Paperclip className="w-3 h-3" />
          <span>Attachments</span>
        </div>
        <button className="w-full px-3 py-2 bg-card rounded-lg text-body text-text-muted border border-dashed border-border hover:border-accent/50 hover:text-text-primary motion-fast motion-ease-out transition-colors">
          Add attachment
        </button>
      </div>
    </div>
  )
}
