'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CaptureSheet } from '@/modules/capture/components';
import { Button } from '@/components/ui/button';
import { Mic, Sparkles } from 'lucide-react';

export default function CapturePage() {
  const router = useRouter();
  const [showCaptureSheet, setShowCaptureSheet] = useState(false);

  const handleCapture = async (content: string, source: 'text' | 'voice') => {
    try {
      const response = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, content }),
      });

      if (!response.ok) throw new Error('Capture failed');

      const result = await response.json();
      
      // Navigate to review page with sessionId
      if (result.sessionId) {
        router.push(`/capture/review/${result.sessionId}`);
      }
    } catch (error) {
      console.error('Capture error:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-display text-text-primary tracking-tight">Capture</h1>
        <p className="text-body text-text-muted">
          Quickly capture expenses, goals, tasks, and more. Luma will figure out where it belongs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          size="lg"
          onClick={() => setShowCaptureSheet(true)}
          className="h-32 flex flex-col gap-3"
        >
          <Mic className="w-8 h-8" />
          <span>Quick Capture</span>
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="h-32 flex flex-col gap-3"
        >
          <Sparkles className="w-8 h-8" />
          <span>AI Capture</span>
        </Button>
      </div>

      {showCaptureSheet && (
        <CaptureSheet
          onCapture={handleCapture}
          onClose={() => setShowCaptureSheet(false)}
        />
      )}
    </div>
  );
}
