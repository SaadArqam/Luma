'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X, Keyboard, Mic } from 'lucide-react';
import { VoiceCapture } from './VoiceCapture';
import { CaptureInput } from './CaptureInput';
import { CaptureTypeSelector } from './CaptureTypeSelector';
import { AISuggestionList } from './AISuggestionList';
import { MetadataSection } from './MetadataSection';
import { ProcessingIndicator } from './ProcessingIndicator';

export type CaptureMode = 'text' | 'voice';

interface CaptureSheetProps {
  open: boolean;
  onClose: () => void;
  onCapture: (content: string, mode: CaptureMode, metadata?: any) => Promise<void>;
}

export function CaptureSheet({ open, onClose, onCapture }: CaptureSheetProps) {
  const [mode, setMode] = useState<CaptureMode>('text');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('luma-capture-draft');
    if (savedDraft) {
      setContent(savedDraft);
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (content.trim()) {
      localStorage.setItem('luma-capture-draft', content);
    }
  }, [content]);

  // Clear draft on successful capture
  const handleCapture = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onCapture(content, mode);
      setContent('');
      localStorage.removeItem('luma-capture-draft');
      onClose();
    } catch (error) {
      console.error('Capture failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setContent(transcript);
    setMode('text');
  };

  const handleDiscardDraft = () => {
    setContent('');
    localStorage.removeItem('luma-capture-draft');
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-[var(--z-modal)] flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div 
        ref={sheetRef}
        className={cn(
          "w-full md:max-w-lg bg-card border border-border",
          "rounded-t-3xl md:rounded-3xl",
          "p-6 space-y-6",
          "motion-fast motion-ease-out",
          "shadow-2xl",
          "max-h-[90vh] md:max-h-[80vh] overflow-y-auto"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-heading text-text-primary tracking-tight">Capture</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface motion-fast motion-ease-out"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Capture Type Selector */}
        <CaptureTypeSelector mode={mode} onModeChange={setMode} />

        {/* Content Input */}
        {mode === 'text' ? (
          <div className="space-y-4">
            <CaptureInput
              value={content}
              onChange={setContent}
              placeholder="What's on your mind?"
              disabled={isSubmitting}
            />
            
            {/* AI Suggestions Area */}
            {showSuggestions && (
              <AISuggestionList content={content} />
            )}
          </div>
        ) : (
          <VoiceCapture onTranscript={handleVoiceTranscript} />
        )}

        {/* Metadata Section */}
        {showMetadata && (
          <MetadataSection
            onToggle={() => setShowMetadata(false)}
          />
        )}

        {/* Processing Indicator */}
        {isSubmitting && (
          <ProcessingIndicator message="Saved. Luma is organizing it." />
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="text-caption text-text-muted hover:text-text-primary motion-fast motion-ease-out"
          >
            {showMetadata ? 'Hide details' : 'Add details'}
          </button>

          <div className="flex items-center gap-3">
            {content && (
              <button
                onClick={handleDiscardDraft}
                className="text-caption text-text-muted hover:text-text-primary motion-fast motion-ease-out"
              >
                Discard
              </button>
            )}
            <button
              onClick={handleCapture}
              disabled={!content.trim() || isSubmitting}
              className={cn(
                "px-6 py-3 rounded-xl bg-accent text-accent-foreground",
                "font-medium text-body",
                "motion-fast motion-ease-out",
                "hover:scale-105 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              )}
            >
              {isSubmitting ? 'Saving...' : 'Capture'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
