'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Mic, MicOff, Pause, Play } from 'lucide-react'

interface VoiceCaptureProps {
  onTranscript: (transcript: string) => void
}

export function VoiceCapture({ onTranscript }: VoiceCaptureProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording, isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        chunksRef.current = []
        
        setIsProcessing(true)
        
        // Mock transcription - in production this would call a speech-to-text API
        setTimeout(() => {
          const mockTranscript = "Spent 500 on groceries today. Need to save 10000 for vacation."
          onTranscript(mockTranscript)
          setIsProcessing(false)
          setRecordingTime(0)
        }, 1500)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
    }
  }

  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
      } else {
        mediaRecorderRef.current.pause()
      }
      setIsPaused(!isPaused)
    }
  }

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isRecording])

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      {isProcessing ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          </div>
          <p className="text-body text-text-muted">Processing audio...</p>
        </div>
      ) : (
        <>
          {/* Recording Timer */}
          {isRecording && (
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isPaused ? "bg-text-muted" : "bg-danger animate-pulse"
              )} />
              <span className="text-title text-text-primary font-mono">
                {formatTime(recordingTime)}
              </span>
            </div>
          )}

          {/* Recording Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center motion-fast motion-ease-out",
              "hover:scale-105 active:scale-95",
              isRecording ? "bg-danger text-white" : "bg-accent text-accent-foreground"
            )}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>

          {/* Pause/Resume Button */}
          {isRecording && (
            <button
              onClick={togglePause}
              className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-text-muted hover:text-text-primary motion-fast motion-ease-out hover:scale-105 active:scale-95"
              aria-label={isPaused ? "Resume recording" : "Pause recording"}
            >
              {isPaused ? (
                <Play className="w-5 h-5" />
              ) : (
                <Pause className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Helper Text */}
          <p className="text-caption text-text-muted">
            {isRecording ? (isPaused ? "Paused" : "Recording...") : "Tap to record"}
          </p>
        </>
      )}
    </div>
  )
}
