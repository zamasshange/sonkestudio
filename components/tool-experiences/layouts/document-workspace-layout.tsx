"use client"

import { ChangeEvent, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, FileUp, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import JSZip from 'jszip'

type LineItem = {
  id: string
  description: string
  quantity: number
  price: number
}

const analysisTools: Record<string, { label: string; modes: string[]; placeholder: string; checklist: string[] }> = {
  'ocr-extractor': {
    label: 'Extraction brief',
    modes: ['Extract clean text', 'Find tables', 'Pull contact details', 'Summarize document'],
    placeholder: 'Upload an image or paste rough visible text. Add anything the extractor should pay attention to...',
    checklist: ['Image preview', 'Text cleanup', 'Copy-ready output', 'Review notes'],
  },
  'doc-scanner': {
    label: 'Scan brief',
    modes: ['Clean scan', 'Extract key text', 'Create filing summary', 'Find missing fields'],
    placeholder: 'Upload a document image or describe what is on the page...',
    checklist: ['Upload queue', 'Document preview', 'Filing summary', 'Next actions'],
  },
  'resume-optimizer': {
    label: 'Resume content',
    modes: ['ATS review', 'Rewrite bullets', 'Keyword gaps', 'Hiring manager summary'],
    placeholder: 'Paste resume text and optionally add the job description...',
    checklist: ['ATS score hints', 'Rewrite suggestions', 'Keyword gaps', 'Action verbs'],
  },
  'legal-simplifier': {
    label: 'Legal text',
    modes: ['Plain English', 'Risk flags', 'Action checklist', 'Questions to ask'],
    placeholder: 'Paste legal wording, notices, clauses, or policy text...',
    checklist: ['Plain meaning', 'Risk flags', 'User obligations', 'Questions'],
  },
  'agreement-analyzer': {
    label: 'Agreement text',
    modes: ['Clause summary', 'Risk review', 'Negotiation notes', 'Obligation tracker'],
    placeholder: 'Paste an agreement section or upload the document...',
    checklist: ['Parties', 'Dates', 'Obligations', 'Red flags'],
  },
  'pdf-summarizer': {
    label: 'PDF notes',
    modes: ['Executive summary', 'Page-by-page brief', 'Action items', 'Study notes'],
    placeholder: 'Upload a PDF or paste text from it. Add the audience and purpose...',
    checklist: ['Summary', 'Key points', 'Action items', 'Open questions'],
  },
}

const builderTools = new Set(['invoice-generator', 'receipt-generator'])
const converterTools = new Set(['pdf-to-word', 'word-to-pdf'])

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
    const inner = match[1]
    for (const part of inner.matchAll(/\((?:\\.|[^\\)])*\)/g)) chunks.push(cleanLiteral(part[0]))
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

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function createDocxBlob(title: string, text: string) {
  const zip = new JSZip()
  const paragraphs = (text || 'No extractable text was found.').split(/\n+/).map((line) =>
    `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`
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
  if (!documentXml) throw new Error('Could not read Word document text.')
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
  const pageSize: [number, number] = [595.28, 841.89]
  const margin = 56
  const fontSize = 11
  const lineHeight = 16
  let page = pdf.addPage(pageSize)
  let y = page.getHeight() - margin

  page.drawText(title, { x: margin, y, size: 18, font: bold, color: rgb(0.05, 0.05, 0.05) })
  y -= 34

  const words = text.split(/\s+/)
  let line = ''
  const maxWidth = page.getWidth() - margin * 2
  const drawLine = (value: string) => {
    if (y < margin) {
      page = pdf.addPage(pageSize)
      y = page.getHeight() - margin
    }
    page.drawText(value, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) })
    y -= lineHeight
  }

  for (const word of words) {
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

export function DocumentWorkspaceLayout({ tool }: { tool: Tool }) {
  const isBuilder = builderTools.has(tool.id)
  const isConverter = converterTools.has(tool.id)
  const config = analysisTools[tool.id] || analysisTools['pdf-summarizer']
  const [mode, setMode] = useState(config.modes[0])
  const [files, setFiles] = useState<{ file: File; name: string; size: number; type: string; preview?: string }[]>([])
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [conversionStatus, setConversionStatus] = useState('')

  const [fromName, setFromName] = useState('Your Company')
  const [toName, setToName] = useState('Client Name')
  const [docNumber, setDocNumber] = useState(isBuilder && tool.id === 'receipt-generator' ? 'RCPT-001' : 'INV-001')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [taxRate, setTaxRate] = useState(15)
  const [notes, setNotes] = useState('Thank you for your business.')
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: 'Professional service', quantity: 1, price: 1250 },
  ])

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.price, 0), [items])
  const tax = useMemo(() => subtotal * (taxRate / 100), [subtotal, taxRate])
  const total = subtotal + tax

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || [])
    setFiles((current) => [
      ...current,
      ...selected.map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'file',
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      })),
    ])
  }

  const analyze = async () => {
    if (!input.trim() && files.length === 0) return
    setLoading(true)
    setError('')
    setOutput('')

    const prompt = `${tool.name}
Mode: ${mode}
Uploaded files: ${files.map((file) => `${file.name} (${file.type})`).join(', ') || 'none'}

User material:
${input || 'The user uploaded files and needs help based on the selected mode.'}

Return a polished, practical document workspace result with:
- A short summary
- Extracted or rewritten content
- Issues or missing fields
- Next actions`

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: tool.id,
          text: prompt,
          toolTitle: tool.name,
          toolDescription: tool.description,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Analysis failed.')
      setOutput(data.result || data.choices?.[0]?.message?.content || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed.')
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setItems((current) => [...current, { id: Date.now().toString(), description: 'New line item', quantity: 1, price: 0 }])
  }

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item))
  }

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const documentHtml = () => `<!doctype html><html><head><meta charset="utf-8"><title>${docNumber}</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#111}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ddd;padding:10px;text-align:left}.total{text-align:right;font-size:20px;font-weight:700}</style></head><body><h1>${tool.id === 'receipt-generator' ? 'Receipt' : 'Invoice'}</h1><p><strong>${docNumber}</strong> / ${date}</p><p>From: ${fromName}<br>To: ${toName}</p><table><thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>${items.map((item) => `<tr><td>${item.description}</td><td>${item.quantity}</td><td>R ${item.price.toFixed(2)}</td><td>R ${(item.quantity * item.price).toFixed(2)}</td></tr>`).join('')}</tbody></table><p class="total">Total: R ${total.toFixed(2)}</p><p>${notes}</p></body></html>`

  const downloadDocument = () => {
    const blob = new Blob([documentHtml()], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${docNumber}.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyOutput = async () => {
    const text = isBuilder ? documentHtml() : output
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const runConversion = async () => {
    if (files.length === 0) return
    setLoading(true)
    setError('')
    setConversionStatus('')
    setOutput('')

    try {
      if (tool.id === 'word-to-pdf') {
        for (const uploaded of files) {
          const source = uploaded.file
          const text = source.name.toLowerCase().endsWith('.docx')
            ? await extractDocxText(source)
            : await source.text()
          const blob = await createPdfBlob(source.name.replace(/\.[^.]+$/, ''), text)
          downloadBlob(blob, `${source.name.replace(/\.[^.]+$/, '')}.pdf`)
        }
        setConversionStatus(`Converted ${files.length} document${files.length === 1 ? '' : 's'} to PDF.`)
        setOutput('Your PDF download has started. The conversion preserves readable text and basic paragraph flow.')
      } else {
        for (const uploaded of files) {
          const source = uploaded.file
          const buffer = await source.arrayBuffer()
          const raw = new TextDecoder('latin1').decode(buffer)
          const extracted = decodePdfText(raw)
          const pdf = await PDFDocument.load(buffer)
          const fallback = `Source file: ${source.name}\nPages: ${pdf.getPageCount()}\n\nThis PDF uses encoded or compressed text streams that cannot be fully extracted in this browser-only converter. For scanned PDFs, use OCR first, then export the extracted text.`
          const finalText = extracted || fallback
          const blob = await createDocxBlob(source.name.replace(/\.pdf$/i, ''), finalText)
          downloadBlob(blob, `${source.name.replace(/\.pdf$/i, '') || 'converted'}.docx`)
        }
        setConversionStatus(`Created ${files.length} Word document${files.length === 1 ? '' : 's'}.`)
        setOutput('Your DOCX download has started. Text-based PDFs convert best; scanned PDFs should go through OCR first.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Document workspace"
        eyebrow="DOC"
        statusTitle={isConverter ? 'Convert and export' : isBuilder ? 'Build and download' : mode}
        statusText="Upload, paste, build, convert, or analyze documents in a focused workspace that matches the job."
      />

      {isConverter ? (
        <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
            <aside className="rounded-none border border-border bg-white p-6 h-fit xl:sticky xl:top-44">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Conversion settings</p>
              <h2 className="mt-2 text-xl font-semibold">{tool.id === 'word-to-pdf' ? 'Word to PDF' : 'PDF to Word'}</h2>
              <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
                {(tool.id === 'word-to-pdf'
                  ? ['Accepts .docx and .txt', 'Preserves readable text', 'Exports a real PDF', 'Runs locally in browser']
                  : ['Accepts text-based PDFs', 'Exports a real .docx file', 'Best-effort text extraction', 'Use OCR first for scans']
                ).map((item) => (
                  <div key={item} className="rounded-none border border-border bg-muted p-3">{item}</div>
                ))}
              </div>
            </aside>

            <main className="space-y-6">
              <section className="rounded-none border border-border bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Files</p>
                    <h2 className="mt-2 text-xl font-semibold">Add source documents</h2>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-none border border-border bg-white px-4 py-2 text-sm hover:border-foreground/30">
                    <FileUp className="h-4 w-4" />
                    Choose files
                    <input
                      type="file"
                      multiple
                      accept={tool.id === 'word-to-pdf' ? '.docx,.txt' : '.pdf'}
                      onChange={handleFiles}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mt-6 grid gap-3">
                  {files.length === 0 && (
                    <div className="rounded-none border border-dashed border-border bg-muted p-10 text-center text-sm text-muted-foreground">
                      Drop in {tool.id === 'word-to-pdf' ? 'Word or text files' : 'PDF files'} to start converting.
                    </div>
                  )}
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="rounded-none border border-border bg-muted p-4">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB / {file.type}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">{conversionStatus || `${files.length} file${files.length === 1 ? '' : 's'} ready`}</span>
                  <Button onClick={runConversion} disabled={loading || files.length === 0} className="rounded-none bg-primary text-primary-foreground gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Convert and download
                  </Button>
                </div>
                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
              </section>

              <section className="rounded-none border border-border bg-white p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Conversion notes</p>
                <div className="mt-5 min-h-[180px] rounded-none border border-border bg-muted p-5 text-sm leading-7 whitespace-pre-wrap">
                  {output || 'Conversion details and next-step guidance will appear here after processing.'}
                </div>
              </section>
            </main>

            <aside className="rounded-none border border-border bg-white p-6 h-fit">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Real-world fit</p>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p className="rounded-none border border-border bg-muted p-3">Text documents convert cleanly.</p>
                <p className="rounded-none border border-border bg-muted p-3">Scanned PDFs need OCR before Word export.</p>
                <p className="rounded-none border border-border bg-muted p-3">Complex layouts may need manual polishing after conversion.</p>
              </div>
            </aside>
          </div>
        </div>
      ) : isBuilder ? (
        <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
          <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="rounded-none border border-border bg-white p-6 h-fit xl:sticky xl:top-44">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Document setup</p>
              <div className="mt-5 grid gap-4">
                <input value={fromName} onChange={(event) => setFromName(event.target.value)} className="rounded-none border border-border bg-white px-3 py-2 text-sm" placeholder="From" />
                <input value={toName} onChange={(event) => setToName(event.target.value)} className="rounded-none border border-border bg-white px-3 py-2 text-sm" placeholder="To" />
                <input value={docNumber} onChange={(event) => setDocNumber(event.target.value)} className="rounded-none border border-border bg-white px-3 py-2 text-sm" placeholder="Document number" />
                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="rounded-none border border-border bg-white px-3 py-2 text-sm" />
                <label className="grid gap-2 text-sm font-medium">
                  Tax rate
                  <input type="number" value={taxRate} onChange={(event) => setTaxRate(Number(event.target.value))} className="rounded-none border border-border bg-white px-3 py-2 text-sm" />
                </label>
                <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-24 resize-none rounded-none border border-border bg-muted p-3 text-sm" />
              </div>
            </aside>

            <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
              <section className="rounded-none border border-border bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Line items</p>
                    <h2 className="mt-2 text-xl font-semibold">Build the document</h2>
                  </div>
                  <Button onClick={addItem} variant="outline" className="rounded-none bg-white gap-2">
                    <Plus className="h-4 w-4" />
                    Add item
                  </Button>
                </div>
                <div className="mt-5 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="grid gap-3 rounded-none border border-border bg-muted p-3 md:grid-cols-[1fr_90px_120px_auto]">
                      <input value={item.description} onChange={(event) => updateItem(item.id, { description: event.target.value })} className="rounded-none border border-border bg-white px-3 py-2 text-sm" />
                      <input type="number" value={item.quantity} onChange={(event) => updateItem(item.id, { quantity: Number(event.target.value) })} className="rounded-none border border-border bg-white px-3 py-2 text-sm" />
                      <input type="number" value={item.price} onChange={(event) => updateItem(item.id, { price: Number(event.target.value) })} className="rounded-none border border-border bg-white px-3 py-2 text-sm" />
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-foreground">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-none border border-border bg-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Preview</p>
                  <div className="flex gap-2">
                    <Button onClick={copyOutput} variant="outline" className="rounded-none bg-white gap-2">
                      <Copy className="h-4 w-4" />
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button onClick={downloadDocument} className="rounded-none bg-primary text-primary-foreground gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="mt-5 min-h-[520px] rounded-none border border-border bg-muted p-6">
                  <div className="bg-white p-6 text-sm leading-7">
                    <h2 className="text-2xl font-semibold">{tool.id === 'receipt-generator' ? 'Receipt' : 'Invoice'}</h2>
                    <p className="mt-2 text-muted-foreground">{docNumber} / {date}</p>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <p><span className="font-semibold">From</span><br />{fromName}</p>
                      <p><span className="font-semibold">To</span><br />{toName}</p>
                    </div>
                    <div className="mt-6 space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between border-b border-border py-2">
                          <span>{item.description} x {item.quantity}</span>
                          <span>R {(item.quantity * item.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 space-y-1 text-right">
                      <p>Subtotal: R {subtotal.toFixed(2)}</p>
                      <p>Tax: R {tax.toFixed(2)}</p>
                      <p className="text-xl font-semibold">Total: R {total.toFixed(2)}</p>
                    </div>
                    <p className="mt-6 text-muted-foreground">{notes}</p>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
            <aside className="rounded-none border border-border bg-white p-6 h-fit xl:sticky xl:top-44">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Workflow</p>
              <div className="mt-5 grid gap-2">
                {config.modes.map((item) => (
                  <button key={item} onClick={() => setMode(item)} className={`rounded-none border px-3 py-2 text-left text-sm ${mode === item ? 'border-foreground bg-foreground text-background' : 'border-border bg-white text-muted-foreground hover:border-foreground/30'}`}>
                    {item}
                  </button>
                ))}
              </div>
              <div className="mt-6 rounded-none border border-border bg-muted p-4 text-sm text-muted-foreground">
                {config.checklist.join(' / ')}
              </div>
            </aside>

            <main className="space-y-6">
              <section className="rounded-none border border-border bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">{config.label}</p>
                    <h2 className="mt-2 text-xl font-semibold">{mode}</h2>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-none border border-border bg-white px-4 py-2 text-sm hover:border-foreground/30">
                    <FileUp className="h-4 w-4" />
                    Upload files
                    <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.csv" onChange={handleFiles} className="hidden" />
                  </label>
                </div>
                <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder={config.placeholder} className="mt-5 min-h-[280px] resize-none rounded-none border border-border bg-muted p-4 text-sm" />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{files.length} file{files.length === 1 ? '' : 's'} / {input.length} characters</span>
                  <Button onClick={analyze} disabled={loading || (!input.trim() && files.length === 0)} className="rounded-none bg-primary text-primary-foreground gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Run workspace
                  </Button>
                </div>
                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
              </section>

              <section className="rounded-none border border-border bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Workspace output</p>
                    <h2 className="mt-2 text-xl font-semibold">Workspace output</h2>
                  </div>
                  <Button onClick={copyOutput} disabled={!output} variant="outline" className="rounded-none bg-white gap-2">
                    <Copy className="h-4 w-4" />
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <div className="mt-5 min-h-[300px] rounded-none border border-border bg-muted p-5 text-sm leading-7 whitespace-pre-wrap">
                  {output || 'Upload or paste document content, choose a workflow, and the output will appear here.'}
                </div>
              </section>
            </main>

            <aside className="space-y-6">
              <section className="rounded-none border border-border bg-white p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Files</p>
                <div className="mt-5 grid gap-3">
                  {files.length === 0 && <p className="text-sm text-muted-foreground">No files uploaded yet.</p>}
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="rounded-none border border-border bg-muted p-3 text-sm">
                      {file.preview && <img src={file.preview} alt="" className="mb-3 aspect-video w-full object-cover" />}
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB / {file.type}</p>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      )}
    </motion.div>
  )
}
