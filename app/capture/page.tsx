'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CaptureSheet, type CaptureMode } from '@/modules/capture/components'
import { FloatingCaptureButton } from '@/modules/today/components'
import { EmptyState } from '@/components/ui/empty-state'
import { Sparkles } from 'lucide-react'

export default function CapturePage() {
  const router = useRouter()
  const [showCaptureSheet, setShowCaptureSheet] = useState(false)

  const handleCapture = async (content: string, mode: CaptureMode, metadata?: any) => {
    try {
      const response = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: mode, content, metadata }),
      })

      if (!response.ok) throw new Error('Capture failed')

      const result = await response.json()
      
      // Navigate to review page with sessionId
      if (result.sessionId) {
        router.push(`/capture/review/${result.sessionId}`)
      }
    } catch (error) {
      console.error('Capture error:', error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-display text-text-primary tracking-tight">Capture</h1>
        <p className="text-body text-text-muted mt-2">
          Capture anything. Luma will figure out where it belongs.
        </p>
      </div>

      {/* Empty State / Welcome */}
      <div className="px-4 py-16">
        <EmptyState
          icon={<Sparkles className="w-12 h-12" />}
          title="Capture your first thought"
          description="Ideas are easier to remember when you write them down. Start capturing expenses, goals, tasks, or anything else on your mind."
        />
      </div>

      {/* Capture Sheet */}
      <CaptureSheet
        open={showCaptureSheet}
        onClose={() => setShowCaptureSheet(false)}
        onCapture={handleCapture}
      />

      {/* Floating Capture Button */}
      <FloatingCaptureButton onClick={() => setShowCaptureSheet(true)} />
    </div>
  )
}
