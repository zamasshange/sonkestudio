'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Link2, Loader2, Users } from 'lucide-react'
import { LiveblocksProvider, RoomProvider, useMutation, useStorage } from '@liveblocks/react/suspense'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { getLiveblocksPublishableKey } from '@/lib/liveblocks-public'

function roomIdFromSearch() {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('room')?.trim() || ''
}

function createRoomId() {
  return `note-${crypto.randomUUID().slice(0, 8)}`
}

function NoteEditor() {
  const note = useStorage((root) => root.note) ?? ''
  const updateNote = useMutation(({ storage }, value: string) => {
    storage.set('note', value)
  }, [])

  return (
    <Textarea
      value={note}
      onChange={(event) => updateNote(event.target.value)}
      placeholder="Type a quick note. Anyone with the share link can edit in real time."
      className="min-h-[320px] resize-y rounded-sm border-border text-base leading-7"
    />
  )
}

function NoteRoom({ roomId, onShare }: { roomId: string; onShare: (link: string) => void }) {
  const shareLink = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const url = new URL(window.location.href)
    url.searchParams.set('room', roomId)
    return url.toString()
  }, [roomId])

  useEffect(() => {
    onShare(shareLink)
  }, [onShare, shareLink])

  return (
    <RoomProvider id={roomId} initialStorage={{ note: '' }}>
      <Suspense
        fallback={
          <div className="flex min-h-[320px] items-center justify-center rounded-sm border border-border bg-muted/30">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <NoteEditor />
      </Suspense>
    </RoomProvider>
  )
}

export function TempNotesLayout({ tool }: { tool: Tool }) {
  const [roomId, setRoomId] = useState('')
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const existing = roomIdFromSearch()
    setRoomId(existing || createRoomId())
  }, [])

  const onShare = useCallback((link: string) => setShareLink(link), [])

  const copyShare = async () => {
    if (!shareLink) return
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const newRoom = () => {
    const next = createRoomId()
    setRoomId(next)
    const url = new URL(window.location.href)
    url.searchParams.set('room', next)
    window.history.replaceState({}, '', url.toString())
  }

  if (!roomId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Temp notes"
        eyebrow="everyday"
        statusTitle="Live collaboration"
        statusText="Share the room link so others can edit this note with you in real time."
      />

      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <LiveblocksProvider
          publicApiKey={getLiveblocksPublishableKey()}
          authEndpoint={async (room) => {
            const guestKey = 'sonke-liveblocks-guest'
            let guestId = localStorage.getItem(guestKey)
            if (!guestId) {
              guestId = `guest-${crypto.randomUUID()}`
              localStorage.setItem(guestKey, guestId)
            }
            const response = await fetch('/api/liveblocks-auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ room, userId: guestId }),
            })
            return response.json()
          }}
        >
          <div className="rounded-md border border-border bg-white p-6 sm:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                Room: {roomId}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" className="rounded-sm" onClick={copyShare} disabled={!shareLink}>
                  <Copy className="h-4 w-4" />
                  {copied ? 'Link copied' : 'Copy share link'}
                </Button>
                <Button type="button" variant="outline" className="rounded-sm" onClick={newRoom}>
                  <Link2 className="h-4 w-4" />
                  New room
                </Button>
              </div>
            </div>
            <NoteRoom roomId={roomId} onShare={onShare} />
          </div>
        </LiveblocksProvider>
      </div>
    </motion.div>
  )
}
