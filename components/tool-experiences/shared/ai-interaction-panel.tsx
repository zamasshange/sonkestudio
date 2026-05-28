"use client"

import { ChangeEvent, ClipboardEvent, DragEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  Bot,
  CheckCircle2,
  FileArchive,
  FileCode2,
  FileText,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { uploadToCloudinary } from '@/lib/upload-client'

export type InteractionAsset = {
  id: string
  name: string
  type: string
  size: number
  previewUrl?: string
  remoteUrl?: string
  publicId?: string
  progress: number
  status: 'queued' | 'uploading' | 'ready' | 'error'
  error?: string
}

type UploadExperience = {
  title: string
  prompt: string
  accepts: string
  folder: string
  chips: string[]
  tone: string
}

const uploadExperiences: Record<string, UploadExperience> = {
  student: {
    title: 'Study context',
    prompt: 'Drop homework screenshots, notes, PDFs, or textbook pages',
    accepts: 'image/*,.pdf,.doc,.docx,.txt',
    folder: 'sonke-student-context',
    chips: ['Homework screenshot', 'Study notes', 'Textbook PDF'],
    tone: 'from-blue-500/15 via-cyan-500/10 to-emerald-500/15',
  },
  developer: {
    title: 'Dev context',
    prompt: 'Paste screenshots or upload JSON, logs, code, and API responses',
    accepts: 'image/*,.json,.txt,.log,.js,.ts,.tsx,.html,.css,.md',
    folder: 'sonke-dev-context',
    chips: ['JSON payload', 'Error screenshot', 'API response'],
    tone: 'from-slate-500/15 via-zinc-500/10 to-cyan-500/15',
  },
  creator: {
    title: 'Creator assets',
    prompt: 'Add thumbnails, brand assets, moodboards, and content screenshots',
    accepts: 'image/*,.pdf,.txt,.md',
    folder: 'sonke-creator-assets',
    chips: ['Thumbnail', 'Brand asset', 'Caption brief'],
    tone: 'from-pink-500/15 via-rose-500/10 to-amber-500/15',
  },
  document: {
    title: 'Document intake',
    prompt: 'Upload PDFs, scans, Word docs, receipts, or OCR images',
    accepts: 'image/*,.pdf,.doc,.docx,.txt,.rtf',
    folder: 'sonke-document-intake',
    chips: ['PDF', 'OCR image', 'Word document'],
    tone: 'from-emerald-500/15 via-teal-500/10 to-sky-500/15',
  },
  'ai-text': {
    title: 'Writing memory',
    prompt: 'Attach drafts, voice notes as text, screenshots, or source docs',
    accepts: 'image/*,.pdf,.doc,.docx,.txt,.md',
    folder: 'sonke-ai-text-context',
    chips: ['Draft', 'Reference doc', 'Screenshot'],
    tone: 'from-violet-500/15 via-fuchsia-500/10 to-amber-500/15',
  },
  business: {
    title: 'Business context',
    prompt: 'Attach decks, notes, CVs, market screenshots, or strategy docs',
    accepts: 'image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx',
    folder: 'sonke-business-context',
    chips: ['Pitch deck', 'Market notes', 'CV'],
    tone: 'from-indigo-500/15 via-blue-500/10 to-emerald-500/15',
  },
  explain: {
    title: 'Explain inputs',
    prompt: 'Drop screenshots, charts, contracts, emails, code, or PDFs',
    accepts: 'image/*,.pdf,.doc,.docx,.txt,.json,.csv',
    folder: 'sonke-explain-context',
    chips: ['Screenshot', 'Chart', 'Document'],
    tone: 'from-fuchsia-500/15 via-pink-500/10 to-blue-500/15',
  },
}

const defaultExperience: UploadExperience = {
  title: 'AI context',
  prompt: 'Drop files, paste screenshots, or attach helpful context',
  accepts: 'image/*,.pdf,.doc,.docx,.txt,.md,.json,.csv',
  folder: 'sonke-tool-context',
  chips: ['Screenshot', 'PDF', 'Notes'],
  tone: 'from-primary/15 via-background to-foreground/10',
}

export function getUploadExperience(tool: Tool) {
  return uploadExperiences[tool.category] ?? defaultExperience
}

export function describeAssets(assets: InteractionAsset[]) {
  const ready = assets.filter((asset) => asset.status === 'ready')
  if (!ready.length) return ''
  return ready
    .map((asset) => `Attached file: ${asset.name} (${asset.type || 'unknown type'}, ${formatSize(asset.size)}).${asset.remoteUrl ? ` URL: ${asset.remoteUrl}` : ''}`)
    .join('\n')
}

export function SmartUploadPanel({
  tool,
  assets,
  onAssetsChange,
  compact = false,
}: {
  tool: Tool
  assets: InteractionAsset[]
  onAssetsChange: (assets: InteractionAsset[]) => void
  compact?: boolean
}) {
  const inputId = useId()
  const experience = getUploadExperience(tool)
  const [dragging, setDragging] = useState(false)
  const [pasteReady, setPasteReady] = useState(false)
  const assetsRef = useRef(assets)

  useEffect(() => {
    assetsRef.current = assets
  }, [assets])

  useEffect(() => {
    return () => {
      assetsRef.current.forEach((asset) => {
        if (asset.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(asset.previewUrl)
      })
    }
  }, [])

  const acceptHint = useMemo(() => experience.accepts.replaceAll(',', ', '), [experience.accepts])

  const updateAsset = (id: string, patch: Partial<InteractionAsset>) => {
    onAssetsChange(assetsRef.current.map((asset) => (asset.id === id ? { ...asset, ...patch } : asset)))
  }

  const addFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList)
    if (!files.length) return

    const incoming = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 8,
      status: 'queued' as const,
    }))

    onAssetsChange([...assetsRef.current, ...incoming])
    incoming.forEach((asset, index) => uploadFile(files[index], asset.id))
  }

  const uploadFile = async (file: File, id: string) => {
    updateAsset(id, { status: 'uploading', progress: 18 })
    let progress = 18
    const timer = window.setInterval(() => {
      progress = Math.min(progress + Math.random() * 18, 88)
      updateAsset(id, { progress: Math.round(progress) })
    }, 260)

    try {
      const uploaded = await uploadToCloudinary(file, experience.folder)
      window.clearInterval(timer)
      updateAsset(id, {
        status: 'ready',
        progress: 100,
        remoteUrl: uploaded.url,
        publicId: uploaded.publicId,
      })
    } catch (error) {
      window.clearInterval(timer)
      updateAsset(id, {
        status: 'error',
        progress: 100,
        error: error instanceof Error ? error.message : 'Upload failed',
      })
    }
  }

  const removeAsset = (id: string) => {
    const asset = assetsRef.current.find((item) => item.id === id)
    if (asset?.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(asset.previewUrl)
    onAssetsChange(assetsRef.current.filter((item) => item.id !== id))
  }

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(event.target.files)
    event.target.value = ''
  }

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  const onPaste = (event: ClipboardEvent<HTMLLabelElement>) => {
    const files = Array.from(event.clipboardData.files)
    if (!files.length) return
    setPasteReady(true)
    window.setTimeout(() => setPasteReady(false), 900)
    addFiles(files)
  }

  return (
    <section className={`rounded-2xl border border-border/70 bg-white/80 p-3 shadow-[0_20px_70px_-48px_rgba(0,0,0,0.6)] backdrop-blur ${compact ? '' : 'space-y-3'}`}>
      <label
        htmlFor={inputId}
        tabIndex={0}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onPaste={onPaste}
        className={`group relative flex min-h-[150px] cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-dashed p-4 outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring ${
          dragging ? 'border-primary bg-primary/10' : 'border-border bg-background/80 hover:border-foreground/30'
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${experience.tone} opacity-80 transition-opacity group-hover:opacity-100`} />
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <UploadCloud className="h-4 w-4 text-primary" />
              {experience.title}
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{experience.prompt}</p>
          </div>
          <span className="rounded-full border border-border bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase text-muted-foreground">
            Ctrl+V
          </span>
        </div>
        <div className="relative z-10 mt-4 flex flex-wrap gap-2">
          {experience.chips.map((chip) => (
            <span key={chip} className="rounded-full border border-border bg-white/75 px-2.5 py-1 text-[11px] text-muted-foreground">
              {chip}
            </span>
          ))}
        </div>
        <input id={inputId} type="file" multiple accept={experience.accepts} onChange={onInput} className="hidden" />
      </label>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Paperclip className="h-3.5 w-3.5" /> {acceptHint}</span>
        {pasteReady ? <span className="text-primary">Screenshot captured</span> : null}
      </div>

      {assets.length ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {assets.map((asset) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-white/85 p-2"
            >
              <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
                {asset.previewUrl ? (
                  <img src={asset.previewUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">{fileIcon(asset.type)}</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{asset.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(asset.size)}</p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${asset.status === 'error' ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${asset.progress}%` }} />
                </div>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  {asset.status === 'uploading' ? <Loader2 className="h-3 w-3 animate-spin" /> : asset.status === 'ready' ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> : null}
                  {asset.status === 'error' ? asset.error : asset.status}
                </p>
              </div>
              <Button type="button" size="icon" variant="ghost" className="h-8 w-8 opacity-70 group-hover:opacity-100" onClick={() => removeAsset(asset.id)}>
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export function ContextualFollowUps({
  tool,
  output,
  onAction,
}: {
  tool: Tool
  output: string
  onAction: (action: string) => void
}) {
  if (!output.trim()) return null
  const actions = getFollowUps(tool)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/70 bg-white/80 p-3 backdrop-blur">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Bot className="h-3.5 w-3.5" />
        Continue with AI
      </p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button key={action} type="button" variant="outline" className="h-auto min-h-8 gap-2 whitespace-normal px-3 py-1.5 text-xs" onClick={() => onAction(action)}>
            <Sparkles className="h-3.5 w-3.5" />
            {action}
          </Button>
        ))}
      </div>
    </motion.div>
  )
}

function getFollowUps(tool: Tool) {
  const categoryActions: Record<string, string[]> = {
    student: ['Explain this further', 'Create flashcards', 'Make a study summary', 'Quiz me on this'],
    developer: ['Explain the error', 'Generate cleaner code', 'Add edge cases', 'Convert this format'],
    creator: ['Turn this into social content', 'Generate hooks', 'Make it punchier', 'Create platform variants'],
    document: ['Summarize this', 'Improve formatting', 'Flag risks', 'Generate a cleaner version'],
    'ai-text': ['Improve tone', 'Summarize this', 'Generate alternatives', 'Continue editing'],
    business: ['Create action steps', 'Improve positioning', 'Add metrics', 'Make it executive-ready'],
    explain: ['Explain this further', 'Give examples', 'Simplify it', 'Create next steps'],
  }
  return categoryActions[tool.category] ?? ['Explain this further', 'Summarize this', 'Improve formatting', 'Continue editing']
}

function fileIcon(type: string) {
  if (type.includes('json') || type.includes('javascript') || type.includes('typescript')) return <FileCode2 className="h-5 w-5 text-slate-600" />
  if (type.includes('zip') || type.includes('archive')) return <FileArchive className="h-5 w-5 text-slate-600" />
  if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-slate-600" />
  return <FileText className="h-5 w-5 text-slate-600" />
}

function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
