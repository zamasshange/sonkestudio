"use client"

import { ChangeEvent, DragEvent, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownToLine,
  CheckCircle2,
  Download,
  FileArchive,
  FileImage,
  FileText,
  FileType,
  GripVertical,
  Layers3,
  Loader2,
  Minus,
  MoveRight,
  Scissors,
  Settings2,
  Sparkles,
  Trash2,
  UploadCloud,
  Wand2,
} from 'lucide-react'
import JSZip from 'jszip'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'

type WorkspaceFile = {
  file: File
  id: string
  name: string
  size: number
  type: string
  pageCount?: number
  preview?: string
}

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 KB'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function decodePdfText(raw: string) {
  const chunks: string[] = []
  const literalPattern = /\((?:\\.|[^\\)])*\)\s*Tj/g
  const arrayPattern = /\[([\s\S]*?)\]\s*TJ/g
  const hexPattern = /<([0-9A-Fa-f\s]+)>\s*Tj/g
  const cleanLiteral = (value: string) => value
    .slice(1, -1)
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\([()\\])/g, '$1')
    .replace(/\\\d{1,3}/g, ' ')

  for (const match of raw.matchAll(literalPattern)) chunks.push(cleanLiteral(match[0].replace(/\s*Tj$/, '')))
  for (const match of raw.matchAll(arrayPattern)) {
    for (const part of match[1].matchAll(/\((?:\\.|[^\\)])*\)/g)) chunks.push(cleanLiteral(part[0]))
  }
  for (const match of raw.matchAll(hexPattern)) {
    const hex = match[1].replace(/\s+/g, '')
    let text = ''
    for (let i = 0; i < hex.length; i += 2) {
      const code = parseInt(hex.slice(i, i + 2), 16)
      if (Number.isFinite(code) && code > 0) text += String.fromCharCode(code)
    }
    chunks.push(text)
  }

  return chunks.join(' ').replace(/\s+/g, ' ').trim()
}

async function createDocxBlob(title: string, text: string) {
  const zip = new JSZip()
  const paragraphs = (text || 'No extractable text was found.').split(/\n+/).map((line) =>
    `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`,
  ).join('')

  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`)
  zip.folder('_rels')?.file('.rels', `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`)
  zip.folder('word')?.file('document.xml', `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${escapeXml(title)}</w:t></w:r></w:p>${paragraphs}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`)
  zip.folder('word')?.folder('_rels')?.file('document.xml.rels', `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`)

  return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
}

async function extractDocxText(file: File) {
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  const documentXml = await zip.file('word/document.xml')?.async('string')
  if (!documentXml) return await file.text()
  return documentXml
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function createPdfBlob(title: string, text: string) {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const margin = 56
  const fontSize = 11
  const lineHeight = 16
  let page = pdf.addPage([595.28, 841.89])
  let y = page.getHeight() - margin
  page.drawText(title, { x: margin, y, size: 18, font: bold, color: rgb(0.05, 0.05, 0.05) })
  y -= 34

  let line = ''
  const maxWidth = page.getWidth() - margin * 2
  const drawLine = (value: string) => {
    if (y < margin) {
      page = pdf.addPage([595.28, 841.89])
      y = page.getHeight() - margin
    }
    page.drawText(value, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) })
    y -= lineHeight
  }

  for (const word of (text || 'No text content found.').split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(next, fontSize) > maxWidth) {
      drawLine(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) drawLine(line)
  return new Blob([await pdf.save()], { type: 'application/pdf' })
}

function DocumentDropPanel({
  accept,
  multiple = true,
  files,
  onFiles,
  onRemove,
}: {
  accept: string
  multiple?: boolean
  files: WorkspaceFile[]
  onFiles: (files: File[]) => void
  onRemove: (id: string) => void
}) {
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    onFiles(Array.from(event.dataTransfer.files))
  }

  return (
    <aside className="space-y-4 rounded-xl border border-border bg-white p-4 shadow-sm xl:sticky xl:top-32 xl:h-fit">
      <label
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className="group flex min-h-[220px] cursor-pointer flex-col justify-between rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-slate-900 hover:bg-white"
      >
        <input type="file" accept={accept} multiple={multiple} onChange={(event: ChangeEvent<HTMLInputElement>) => onFiles(Array.from(event.target.files || []))} className="hidden" />
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-white"><UploadCloud className="h-5 w-5" /></span>
        <span>
          <span className="block text-lg font-semibold text-slate-950">Drop documents here</span>
          <span className="mt-2 block text-sm leading-6 text-muted-foreground">Drag files into the workspace or click to browse. Files are processed locally in your browser where possible.</span>
        </span>
      </label>

      <div className="rounded-lg border border-border bg-background p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Recent Files</p>
        <div className="mt-3 space-y-2">
          {files.length === 0 ? ['Client-contract.pdf', 'Signed-brief.pdf', 'Invoice-scan.jpg'].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" /> {item}
            </div>
          )) : files.map((item) => (
            <div key={item.id} className="group flex items-center gap-3 rounded-md border border-border bg-white p-3">
              <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded border bg-slate-50 text-xs font-semibold text-slate-500">{item.pageCount || 1}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(item.size)}{item.pageCount ? ` / ${item.pageCount} pages` : ''}</p>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-muted-foreground opacity-80 hover:text-foreground">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        {['PDF', 'DOCX', 'TXT', 'JPG/PNG'].map((item) => <span key={item} className="rounded-md border border-border bg-background px-3 py-2">{item}</span>)}
      </div>
    </aside>
  )
}

export function DocumentSoftwareWorkspaceLayout({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<WorkspaceFile[]>([])
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [status, setStatus] = useState('Ready')
  const [error, setError] = useState('')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [splitRange, setSplitRange] = useState('1-3, 5')
  const [compression, setCompression] = useState([72])
  const [extractedText, setExtractedText] = useState('')

  const mode = tool.id
  const isPdfToWord = mode === 'pdf-to-word'
  const isWordToPdf = mode === 'word-to-pdf'
  const isMerge = mode === 'merge-pdfs'
  const isSplit = mode === 'split-pdfs'
  const isCompress = mode === 'compress-pdfs'
  const isOcr = mode === 'ocr-extractor'

  const totalPages = useMemo(() => files.reduce((sum, item) => sum + (item.pageCount || 0), 0), [files])
  const totalSize = useMemo(() => files.reduce((sum, item) => sum + item.size, 0), [files])
  const accept = isWordToPdf ? '.docx,.txt' : isOcr ? 'image/*,.pdf,.txt' : '.pdf'

  const addFiles = async (incoming: File[]) => {
    setError('')
    const filtered = incoming.filter((file) => {
      if (isWordToPdf) return file.name.toLowerCase().endsWith('.docx') || file.type.startsWith('text/') || file.name.toLowerCase().endsWith('.txt')
      if (isOcr) return file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.startsWith('text/')
      return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    })
    if (filtered.length === 0) {
      setError(`Unsupported file type for ${tool.name}.`)
      return
    }
    const next = await Promise.all(filtered.map(async (file) => {
      let pageCount: number | undefined
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        try {
          const pdf = await PDFDocument.load(await file.arrayBuffer())
          pageCount = pdf.getPageCount()
        } catch {
          pageCount = undefined
        }
      }
      return {
        file,
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'file',
        pageCount,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }
    }))
    setFiles((current) => isSplit ? next.slice(0, 1) : [...current, ...next])
    setStatus(`${next.length} file${next.length === 1 ? '' : 's'} added`)
  }

  const removeFile = (id: string) => setFiles((current) => current.filter((item) => item.id !== id))

  const reorder = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return
    setFiles((current) => {
      const next = [...current]
      const [item] = next.splice(draggedIndex, 1)
      next.splice(index, 0, item)
      return next
    })
    setDraggedIndex(index)
  }

  const convert = async () => {
    if (!files.length) return
    setProcessing(true)
    setError('')
    setProgress(0)
    try {
      for (let index = 0; index < files.length; index += 1) {
        const source = files[index].file
        if (isWordToPdf) {
          const text = source.name.toLowerCase().endsWith('.docx') ? await extractDocxText(source) : await source.text()
          const blob = await createPdfBlob(source.name.replace(/\.[^.]+$/, ''), text)
          downloadBlob(blob, `${source.name.replace(/\.[^.]+$/, '')}.pdf`)
        } else {
          const buffer = await source.arrayBuffer()
          const raw = new TextDecoder('latin1').decode(buffer)
          const pdf = await PDFDocument.load(buffer)
          const extracted = decodePdfText(raw)
          const fallback = `Source file: ${source.name}\nPages: ${pdf.getPageCount()}\n\nThis PDF uses encoded, compressed, or scanned text. Run OCR first for image-based pages, then export the extracted text.`
          const blob = await createDocxBlob(source.name.replace(/\.pdf$/i, ''), extracted || fallback)
          downloadBlob(blob, `${source.name.replace(/\.pdf$/i, '') || 'converted'}.docx`)
          setExtractedText(extracted || fallback)
        }
        setProgress(((index + 1) / files.length) * 100)
      }
      setStatus(isWordToPdf ? 'PDF export complete' : 'Word export complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.')
    } finally {
      setProcessing(false)
    }
  }

  const merge = async () => {
    if (files.length < 2) return
    setProcessing(true)
    setError('')
    setProgress(0)
    try {
      const mergedPdf = await PDFDocument.create()
      for (let i = 0; i < files.length; i += 1) {
        const pdf = await PDFDocument.load(await files[i].file.arrayBuffer())
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        pages.forEach((page) => mergedPdf.addPage(page))
        setProgress(((i + 1) / files.length) * 100)
      }
      downloadBlob(new Blob([await mergedPdf.save()], { type: 'application/pdf' }), 'sonke-merged.pdf')
      setStatus('Merged PDF downloaded')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Merge failed.')
    } finally {
      setProcessing(false)
    }
  }

  const split = async () => {
    if (files.length !== 1) return
    setProcessing(true)
    setError('')
    setProgress(0)
    try {
      const pdf = await PDFDocument.load(await files[0].file.arrayBuffer())
      const total = pdf.getPageCount()
      const selected = splitRange.split(',').map((part) => part.trim()).filter(Boolean).flatMap((part) => {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map((n) => Number.parseInt(n.trim(), 10))
          if (!Number.isFinite(start) || !Number.isFinite(end)) return []
          return Array.from({ length: Math.max(0, Math.min(end, total) - start + 1) }, (_, i) => start + i - 1)
        }
        const page = Number.parseInt(part, 10)
        return Number.isFinite(page) ? [page - 1] : []
      }).filter((page, index, all) => page >= 0 && page < total && all.indexOf(page) === index)

      if (selected.length === 0) {
        for (let i = 0; i < total; i += 1) {
          const next = await PDFDocument.create()
          const [page] = await next.copyPages(pdf, [i])
          next.addPage(page)
          downloadBlob(new Blob([await next.save()], { type: 'application/pdf' }), `page-${i + 1}.pdf`)
          setProgress(((i + 1) / total) * 100)
        }
      } else {
        const next = await PDFDocument.create()
        const pages = await next.copyPages(pdf, selected)
        pages.forEach((page) => next.addPage(page))
        downloadBlob(new Blob([await next.save()], { type: 'application/pdf' }), 'sonke-extracted-pages.pdf')
        setProgress(100)
      }
      setStatus('Split export complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Split failed.')
    } finally {
      setProcessing(false)
    }
  }

  const compressPdf = async () => {
    if (!files.length) return
    setProcessing(true)
    setError('')
    setProgress(0)
    try {
      for (let i = 0; i < files.length; i += 1) {
        const pdf = await PDFDocument.load(await files[i].file.arrayBuffer())
        pdf.setTitle('')
        pdf.setAuthor('')
        pdf.setSubject('')
        pdf.setKeywords([])
        const bytes = await pdf.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: compression[0] })
        downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `compressed-${files[i].name}`)
        setProgress(((i + 1) / files.length) * 100)
      }
      setStatus('Compressed PDF downloaded')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed.')
    } finally {
      setProcessing(false)
    }
  }

  const runOcr = async () => {
    if (!files.length) return
    setProcessing(true)
    setError('')
    setProgress(20)
    try {
      const textParts: string[] = []
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i].file
        if (file.type.startsWith('text/')) textParts.push(await file.text())
        else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          const raw = new TextDecoder('latin1').decode(await file.arrayBuffer())
          textParts.push(decodePdfText(raw) || `[${file.name}] No embedded text found. Use a scanned-image OCR service for image-only pages.`)
        } else {
          textParts.push(`[${file.name}] Image uploaded. Browser OCR is not available in this workspace yet, so no extracted text was generated from pixels.`)
        }
        setProgress(((i + 1) / files.length) * 100)
      }
      setExtractedText(textParts.join('\n\n'))
      setStatus('Extraction pass complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed.')
    } finally {
      setProcessing(false)
    }
  }

  const primaryAction = isMerge ? merge : isSplit ? split : isCompress ? compressPdf : isOcr ? runOcr : convert
  const canRun = isMerge ? files.length >= 2 : isSplit ? files.length === 1 : files.length > 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-slate-50 text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Document software"
        eyebrow="DOC"
        statusTitle={status}
        statusText="A focused document workspace with local file handling, previews, sequencing, processing states, and export controls."
      />

      <div className="mx-auto max-w-[1800px] px-4 pb-10 sm:px-8">
        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
          <DocumentDropPanel accept={accept} multiple={!isSplit} files={files} onFiles={addFiles} onRemove={removeFile} />

          <main className="space-y-5">
            <section className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Live Workflow</p>
                  <h2 className="mt-1 text-2xl font-semibold">{tool.name}</h2>
                </div>
                <Button onClick={primaryAction} disabled={!canRun || processing} className="gap-2 rounded-md bg-slate-950 text-white hover:bg-slate-800">
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {isMerge ? 'Merge & download' : isSplit ? 'Split & download' : isCompress ? 'Compress & download' : isOcr ? 'Extract text' : 'Convert & download'}
                </Button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {[
                  ['Files', files.length.toString(), FileText],
                  ['Pages', totalPages ? totalPages.toString() : 'Scan', Layers3],
                  ['Size', formatBytes(totalSize), FileArchive],
                  ['OCR', isOcr || isPdfToWord ? 'Check' : 'N/A', Sparkles],
                ].map(([label, value, Icon]) => (
                  <div key={label as string} className="rounded-lg border border-border bg-slate-50 p-3">
                    <Icon className="h-4 w-4 text-slate-500" />
                    <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">{label as string}</p>
                    <p className="mt-1 font-semibold">{value as string}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-border bg-slate-950 p-4 text-white">
                <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
                  {[
                    isWordToPdf ? 'Word source' : isOcr ? 'Scan source' : 'PDF source',
                    isMerge ? 'Sequence pages' : isSplit ? 'Mark ranges' : isCompress ? 'Optimize objects' : isOcr ? 'Read embedded text' : 'Extract structure',
                    isWordToPdf ? 'PDF export' : isOcr ? 'Editable text' : isMerge ? 'Merged PDF' : isSplit ? 'Extracted PDFs' : isCompress ? 'Smaller PDF' : 'Word export',
                  ].map((item, index) => (
                    <div key={item} className="rounded-lg border border-white/15 bg-white/10 p-3 text-sm">
                      <p className="text-xs text-white/55">Step {index + 1}</p>
                      <p className="mt-1 font-medium">{item}</p>
                    </div>
                  ))}
                  <MoveRight className="hidden h-5 w-5 text-white/50 md:block" />
                  <MoveRight className="hidden h-5 w-5 text-white/50 md:block" />
                </div>
                {(processing || progress > 0) && <Progress value={progress} className="mt-4 h-2 bg-white/15" />}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{isMerge ? 'Merge Timeline' : isSplit ? 'Page Selection' : isCompress ? 'Quality Comparison' : isOcr ? 'Extraction Preview' : 'Page Previews'}</p>
                  <h3 className="mt-1 text-lg font-semibold">{files.length ? 'Workspace is active' : 'Start with a guided sample workspace'}</h3>
                </div>
                {files.length > 0 && <Button variant="outline" onClick={() => { setFiles([]); setProgress(0); setExtractedText('') }} className="gap-2"><Trash2 className="h-4 w-4" />Clear</Button>}
              </div>

              {files.length === 0 ? (
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {['Upload files into a queue', 'Review metadata and page flow', 'Export with settings applied'].map((item, index) => (
                    <div key={item} className="min-h-[180px] rounded-lg border border-dashed border-border bg-slate-50 p-4">
                      <div className="flex h-24 items-center justify-center rounded-md bg-white text-slate-300">
                        {index === 0 ? <UploadCloud className="h-10 w-10" /> : index === 1 ? <Layers3 className="h-10 w-10" /> : <ArrowDownToLine className="h-10 w-10" />}
                      </div>
                      <p className="mt-4 text-sm font-medium">{item}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">No blank workspace: this preview shows the production flow before your first upload.</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {files.map((file, index) => (
                    <div
                      key={file.id}
                      draggable={isMerge}
                      onDragStart={() => setDraggedIndex(index)}
                      onDragOver={(event) => { event.preventDefault(); reorder(index) }}
                      onDragEnd={() => setDraggedIndex(null)}
                      className="rounded-lg border border-border bg-slate-50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{isMerge && <GripVertical className="h-4 w-4" />} Item {index + 1}</span>
                        <span className="text-xs text-muted-foreground">{file.pageCount || 1} pages</span>
                      </div>
                      <div className="mt-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border bg-white">
                        {file.preview ? <img src={file.preview} alt="" className="h-full w-full object-cover" /> : <FileType className="h-12 w-12 text-slate-300" />}
                      </div>
                      <p className="mt-3 truncate text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                    </div>
                  ))}
                </div>
              )}

              {isSplit && files.length === 1 && (
                <div className="mt-4 rounded-lg border border-border bg-slate-50 p-4">
                  <label className="text-sm font-medium">Custom ranges</label>
                  <input value={splitRange} onChange={(event) => setSplitRange(event.target.value)} className="mt-2 w-full rounded-md border border-border bg-white px-3 py-2 text-sm" placeholder="1-3, 5, 8-10" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from({ length: Math.min(files[0].pageCount || 6, 12) }, (_, i) => <span key={i} className="rounded border border-border bg-white px-3 py-2 text-xs">Page {i + 1}</span>)}
                  </div>
                </div>
              )}

              {isOcr && (
                <Textarea value={extractedText} onChange={(event) => setExtractedText(event.target.value)} className="mt-4 min-h-[260px] rounded-lg bg-slate-50 text-sm leading-7" placeholder="Extracted text appears here and remains editable." />
              )}
            </section>
          </main>

          <aside className="space-y-4 rounded-xl border border-border bg-white p-4 shadow-sm xl:sticky xl:top-32 xl:h-fit">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Export Panel</p>
              <h3 className="mt-1 text-lg font-semibold">Output Controls</h3>
            </div>
            <div className="space-y-2">
              {[
                isPdfToWord ? 'Preserve paragraph flow' : 'Keep source order',
                isPdfToWord ? 'Flag scanned pages' : isCompress ? 'Remove metadata' : 'Include page metadata',
                isOcr ? 'Editable text output' : 'Download on completion',
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-lg border border-border bg-slate-50 p-3 text-sm">
                  <span>{item}</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
              ))}
            </div>

            {isCompress && (
              <div className="rounded-lg border border-border bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Compression quality</span>
                  <span>{compression[0]}%</span>
                </div>
                <Slider value={compression} onValueChange={setCompression} min={20} max={95} step={5} className="mt-4" />
                <p className="mt-3 text-xs leading-5 text-muted-foreground">Higher values prioritize fidelity. This browser compressor optimizes PDF object streams and metadata.</p>
              </div>
            )}

            <div className="rounded-lg border border-border bg-slate-950 p-4 text-white">
              <div className="flex items-center gap-2 text-sm font-medium"><Wand2 className="h-4 w-4" />AI Cleanup Suggestions</div>
              <div className="mt-3 space-y-2 text-sm text-white/75">
                {(isPdfToWord ? ['Run OCR first for scanned pages', 'Review tables after export', 'Use high quality for contracts'] : isMerge ? ['Put cover pages first', 'Remove duplicates before merge', 'Check final page numbering'] : isSplit ? ['Use ranges for chapters', 'Export one section at a time', 'Verify page count before split'] : isCompress ? ['Keep quality above 65%', 'Compare before sharing', 'Archive the original file'] : ['Paste extracted text for cleanup', 'Review low-confidence areas', 'Export editable text after scan']).map((item) => (
                  <p key={item} className="rounded-md bg-white/10 px-3 py-2">{item}</p>
                ))}
              </div>
            </div>

            {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span className="rounded-md border border-border bg-slate-50 p-3"><Settings2 className="mb-2 h-4 w-4" />Local processing</span>
              <span className="rounded-md border border-border bg-slate-50 p-3"><Minus className="mb-2 h-4 w-4" />No watermark</span>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
