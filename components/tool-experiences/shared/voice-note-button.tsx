"use client"

import { useRef, useState } from 'react'
import { Loader2, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SpeechRecognitionLike = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

type SpeechCtor = new () => SpeechRecognitionLike

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechCtor
    SpeechRecognition?: SpeechCtor
  }
}

type VoiceNoteButtonProps = {
  onTranscript: (text: string) => void
  language?: string
  disabled?: boolean
  className?: string
}

export function VoiceNoteButton({ onTranscript, language = 'en-ZA', disabled, className }: VoiceNoteButtonProps) {
  const [listening, setListening] = useState(false)
  const [supported] = useState(typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition))
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  const start = () => {
    if (!supported || disabled) return
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Ctor) return
    const recognition = new Ctor()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = language
    recognition.onresult = (event) => {
      const result = event.results?.[0]?.[0]?.transcript?.trim()
      if (result) onTranscript(result)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }

  const stop = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  if (!supported) return null

  return (
    <Button
      type="button"
      variant="outline"
      onClick={listening ? stop : start}
      disabled={disabled}
      className={className}
      title={listening ? 'Stop voice note' : 'Start voice note'}
    >
      {listening ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
      <span className="sr-only">{listening ? 'Stop recording' : 'Start recording'}</span>
    </Button>
  )
}
