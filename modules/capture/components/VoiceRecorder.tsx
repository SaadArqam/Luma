'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
}

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        
        setIsProcessing(true);
        
        // For now, we'll use a mock transcription
        // In production, this would call a speech-to-text API
        setTimeout(() => {
          const mockTranscript = "Spent 500 on groceries today. Need to save 10000 for vacation.";
          onTranscript(mockTranscript);
          setIsProcessing(false);
        }, 1500);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <div className="flex flex-col items-center justify-center h-32 space-y-4">
      {isProcessing ? (
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-sm text-muted-foreground">Processing audio...</p>
        </div>
      ) : (
        <>
          <Button
            size="lg"
            variant={isRecording ? 'destructive' : 'default'}
            onClick={isRecording ? stopRecording : startRecording}
            className="rounded-full w-16 h-16"
          >
            {isRecording ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isRecording ? 'Tap to stop' : 'Tap to record'}
          </p>
        </>
      )}
    </div>
  );
}
