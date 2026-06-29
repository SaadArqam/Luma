'use client';

import { useState } from 'react';
import { Mic, Keyboard, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceRecorder } from './VoiceRecorder';

interface CaptureSheetProps {
  onCapture: (content: string, source: 'text' | 'voice') => Promise<void>;
  onClose: () => void;
}

export function CaptureSheet({ onCapture, onClose }: CaptureSheetProps) {
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onCapture(text, mode);
      setText('');
      onClose();
    } catch (error) {
      console.error('Capture failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setText(transcript);
    setMode('text');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-card border border-border rounded-t-3xl w-full max-w-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">Capture</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={mode === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('text')}
          >
            <Keyboard className="w-4 h-4 mr-2" />
            Text
          </Button>
          <Button
            variant={mode === 'voice' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('voice')}
          >
            <Mic className="w-4 h-4 mr-2" />
            Voice
          </Button>
        </div>

        {mode === 'text' ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or speak to capture expenses, goals, tasks..."
            className="w-full h-32 p-4 bg-background border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent text-text"
            disabled={isSubmitting}
          />
        ) : (
          <VoiceRecorder onTranscript={handleVoiceTranscript} />
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!text.trim() || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Capture'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
