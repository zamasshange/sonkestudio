"use client"

import { ChangeEvent, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Code2,
  Copy,
  Download,
  FileArchive,
  FileUp,
  FolderTree,
  KeyRound,
  Minimize2,
  Play,
  RotateCcw,
  ShieldAlert,
  Terminal,
} from 'lucide-react'

type JsonParseResult = {
  value: unknown | null
  error: string
}

function parseJson(raw: string): JsonParseResult {
  try {
    return { value: JSON.parse(raw), error: '' }
  } catch (error) {
    return { value: null, error: error instanceof Error ? error.message : 'Invalid JSON' }
  }
}

function lineCount(text: string) {
  return Math.max(1, text.split('\n').length)
}

function CodeFrame({
  value,
  minHeight = 360,
  placeholder,
}: {
  value: string
  minHeight?: number
  placeholder?: string
}) {
  const lines = lineCount(value || placeholder || '')
  return (
    <div className="grid overflow-hidden rounded-xl border border-border bg-zinc-950 text-zinc-100 shadow-inner" style={{ gridTemplateColumns: '52px minmax(0,1fr)' }}>
      <div className="select-none border-r border-white/10 bg-black/30 py-3 text-right font-mono text-[11px] leading-5 text-zinc-500">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="px-3">{index + 1}</div>
        ))}
      </div>
      <pre className="overflow-auto p-3 font-mono text-xs leading-5" style={{ minHeight }}>
        {value || placeholder || ''}
      </pre>
    </div>
  )
}

function JsonTreeNode({ k, value, depth = 0 }: { k?: string; value: unknown; depth?: number }) {
  const [open, setOpen] = useState(depth < 2)
  const isObj = value !== null && typeof value === 'object'
  const pad = { paddingLeft: `${depth * 14}px` }

  if (!isObj) {
    return (
      <div className="font-mono text-xs" style={pad}>
        <span className="text-muted-foreground">{k ? `${k}: ` : ''}</span>
        <span className="text-foreground">{JSON.stringify(value)}</span>
      </div>
    )
  }

  const entries = Array.isArray(value)
    ? value.map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>)

  return (
    <div style={pad}>
      <button className="mb-1 flex items-center gap-2 text-xs font-mono text-foreground" onClick={() => setOpen((s) => !s)}>
        <FolderTree className="h-3.5 w-3.5 text-emerald-500" />
        <span>{k ? `${k}: ` : ''}{Array.isArray(value) ? `[${entries.length}]` : `{${entries.length}}`}</span>
      </button>
      {open && (
        <div className="space-y-1">
          {entries.map(([childKey, childValue]) => (
            <JsonTreeNode key={childKey} k={childKey} value={childValue} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function JsonFormatterLayout({ tool }: { tool: Tool }) {
  const [raw, setRaw] = useState('{\n  "project": "SONKE",\n  "features": ["immersive", "personalized"],\n  "active": true\n}')
  const [indent, setIndent] = useState(2)
  const [minified, setMinified] = useState(false)
  const [activePanel, setActivePanel] = useState<'preview' | 'tree'>('preview')

  const parsed = useMemo(() => parseJson(raw), [raw])

  const beautified = useMemo(() => {
    if (parsed.error) return ''
    return JSON.stringify(parsed.value, null, minified ? 0 : indent)
  }, [parsed, indent, minified])

  const stats = [
    { label: 'Lines', value: String(lineCount(raw)).padStart(2, '0') },
    { label: 'Bytes', value: `${new Blob([raw]).size}` },
    { label: 'Status', value: parsed.error ? 'Invalid' : 'Valid' },
    { label: 'Mode', value: minified ? 'Minify' : `${indent} spaces` },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Developer workspace" eyebrow="JSON" statusTitle="Validate + Inspect" statusText="A developer-grade JSON bench with line numbers, live formatting, minify, tree inspection, and export actions." />
      <div className="mx-auto max-w-[1720px] space-y-4 px-5 pb-10 sm:px-8">
        <div className="grid gap-3 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
              <p className={`mt-2 text-xl font-semibold ${item.value === 'Invalid' ? 'text-red-600' : item.value === 'Valid' ? 'text-emerald-600' : 'text-foreground'}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_440px]">
          <section className="rounded-2xl border border-border bg-white p-4 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.45)]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Raw editor</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="h-8" onClick={() => setMinified((value) => !value)}><Minimize2 className="mr-2 h-3.5 w-3.5" />{minified ? 'Pretty' : 'Minify'}</Button>
                <Button variant="outline" className="h-8" onClick={() => setRaw('')}>Clear</Button>
                <Button className="h-8" onClick={() => setRaw(beautified || raw)}>Apply format</Button>
              </div>
            </div>
            <div className="grid overflow-hidden rounded-xl border border-border bg-zinc-950" style={{ gridTemplateColumns: '52px minmax(0,1fr)' }}>
              <div className="select-none border-r border-white/10 bg-black/30 py-3 text-right font-mono text-[11px] leading-5 text-zinc-500">
                {Array.from({ length: lineCount(raw) }).map((_, index) => <div key={index} className="px-3">{index + 1}</div>)}
              </div>
              <Textarea value={raw} onChange={(e) => setRaw(e.target.value)} className="min-h-[560px] resize-none rounded-none border-0 bg-transparent p-3 font-mono text-xs leading-5 text-zinc-100 shadow-none focus-visible:ring-0" spellCheck={false} />
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-3 flex rounded-lg border border-border bg-background p-1">
                {(['preview', 'tree'] as const).map((panel) => (
                  <button key={panel} onClick={() => setActivePanel(panel)} className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold uppercase ${activePanel === panel ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
                    {panel}
                  </button>
                ))}
              </div>
              {activePanel === 'preview' ? (
                <CodeFrame value={beautified} minHeight={430} placeholder={parsed.error ? parsed.error : 'Formatted JSON preview'} />
              ) : (
                <div className="max-h-[486px] overflow-auto rounded-xl border border-border bg-background p-3">
                  {parsed.error ? <p className="text-xs text-red-600">{parsed.error}</p> : <JsonTreeNode value={parsed.value} />}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-white p-4">
              {!parsed.error ? (
                <div className="flex items-center gap-2 text-sm text-emerald-600"><CheckCircle2 className="h-4 w-4" /> JSON is valid and ready to export.</div>
              ) : (
                <div className="flex items-start gap-2 text-sm text-red-600"><ShieldAlert className="mt-0.5 h-4 w-4" /> {parsed.error}</div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(beautified || raw)}><Copy className="mr-2 h-4 w-4" />Copy</Button>
                <Button variant="outline" onClick={() => {
                  const blob = new Blob([beautified || raw], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const anchor = document.createElement('a')
                  anchor.href = url
                  anchor.download = 'sonke-formatted.json'
                  anchor.click()
                  URL.revokeObjectURL(url)
                }}><Download className="mr-2 h-4 w-4" />Export</Button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

export function Base64UtilityLayout({ tool }: { tool: Tool }) {
  const defaultMode = tool.id === 'base64-decode' ? 'decode' : 'encode'
  const [mode, setMode] = useState<'encode' | 'decode'>(defaultMode)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [fileMeta, setFileMeta] = useState<{ name: string; type: string; size: number } | null>(null)

  const output = useMemo(() => {
    try {
      if (!input.trim()) return ''
      if (mode === 'encode') return btoa(unescape(encodeURIComponent(input)))
      return decodeURIComponent(escape(atob(input)))
    } catch {
      return 'Invalid input for this mode.'
    }
  }, [input, mode])

  const onFile = async (file: File) => {
    const text = await file.text()
    setInput(text)
    setFileMeta({ name: file.name, type: file.type || 'unknown', size: file.size })
    setHistory((h) => [`Loaded ${file.name}`, ...h].slice(0, 8))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Encoding utility" eyebrow="B64" statusTitle="Dual-pane converter" statusText="A real encoding bench with live sync, file intake, binary metadata, copy, and download actions." />
      <div className="mx-auto grid max-w-[1720px] gap-4 px-5 pb-10 sm:px-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 rounded-2xl border border-border bg-white p-4">
          <div className="rounded-xl border border-border bg-background p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Conversion mode</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant={mode === 'encode' ? 'default' : 'outline'} onClick={() => setMode('encode')}>Encode</Button>
              <Button variant={mode === 'decode' ? 'default' : 'outline'} onClick={() => setMode('decode')}>Decode</Button>
            </div>
          </div>

          <label className="flex min-h-[150px] cursor-pointer flex-col justify-center gap-3 rounded-xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground">
            <FileUp className="h-5 w-5 text-primary" />
            <span>Upload text, JSON, logs, or small binary-readable files</span>
            <Input type="file" className="hidden" onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>

          <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
            <p className="mb-2 font-semibold uppercase tracking-[0.16em]">Binary preview</p>
            {fileMeta ? (
              <div className="space-y-1">
                <p className="truncate text-foreground">{fileMeta.name}</p>
                <p>{fileMeta.type}</p>
                <p>{fileMeta.size} bytes</p>
              </div>
            ) : (
              <p>No file loaded. Text input still converts live.</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-background p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">History</p>
            <div className="space-y-1 text-xs text-muted-foreground">{history.length ? history.map((item, idx) => <p key={`${item}-${idx}`}>{item}</p>) : <p>No recent conversions.</p>}</div>
          </div>
        </aside>

        <main className="rounded-2xl border border-border bg-white p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold"><FileArchive className="h-4 w-4 text-primary" /> Live Base64 workspace</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => { setInput(''); setFileMeta(null) }}><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
              <Button variant="outline" onClick={() => {
                const blob = new Blob([output], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const anchor = document.createElement('a')
                anchor.href = url
                anchor.download = mode === 'encode' ? 'encoded-base64.txt' : 'decoded-output.txt'
                anchor.click()
                URL.revokeObjectURL(url)
              }}><Download className="mr-2 h-4 w-4" />Download</Button>
              <Button onClick={() => { navigator.clipboard.writeText(output); setHistory((h) => [`Copied ${mode} output`, ...h].slice(0, 8)) }}><Copy className="mr-2 h-4 w-4" />Copy output</Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="overflow-hidden rounded-xl border border-border">
              <div className="flex h-10 items-center justify-between border-b border-border bg-background px-3 text-xs font-semibold uppercase text-muted-foreground">
                <span>{mode === 'encode' ? 'Plain input' : 'Base64 input'}</span>
                <span>{input.length} chars</span>
              </div>
              <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Paste text, JSON, HTML, or file content...' : 'Paste Base64 payload...'} className="min-h-[520px] resize-none rounded-none border-0 bg-zinc-950 font-mono text-xs leading-5 text-zinc-100 focus-visible:ring-0" spellCheck={false} />
            </section>
            <section className="overflow-hidden rounded-xl border border-border">
              <div className="flex h-10 items-center justify-between border-b border-border bg-background px-3 text-xs font-semibold uppercase text-muted-foreground">
                <span>{mode === 'encode' ? 'Encoded output' : 'Decoded output'}</span>
                <span>{output.length} chars</span>
              </div>
              <Textarea value={output} readOnly className="min-h-[520px] resize-none rounded-none border-0 bg-zinc-950 font-mono text-xs leading-5 text-zinc-100 focus-visible:ring-0" />
            </section>
          </div>
        </main>
      </div>
    </motion.div>
  )
}

export function APITesterLayout({ tool }: { tool: Tool }) {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1')
  const [headers, setHeaders] = useState('Content-Type: application/json')
  const [authType, setAuthType] = useState('None')
  const [authValue, setAuthValue] = useState('')
  const [body, setBody] = useState('{\n  "name": "SONKE"\n}')
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState('idle')
  const [timing, setTiming] = useState<number | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [requestTab, setRequestTab] = useState<'headers' | 'auth' | 'body'>('headers')
  const [responseTab, setResponseTab] = useState<'body' | 'headers' | 'timeline'>('body')
  const [responseHeaders, setResponseHeaders] = useState('')

  const sendRequest = async () => {
    setLoading(true)
    setResponse('')
    const started = performance.now()
    try {
      const parsedHeaders: Record<string, string> = Object.fromEntries(headers.split('\n').filter(Boolean).map((line) => {
        const [k, ...rest] = line.split(':')
        return [k.trim(), rest.join(':').trim()]
      }))
      if (authType === 'Bearer' && authValue.trim()) parsedHeaders.Authorization = `Bearer ${authValue.trim()}`
      if (authType === 'Basic' && authValue.trim()) parsedHeaders.Authorization = `Basic ${authValue.trim()}`
      const res = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: method === 'GET' ? undefined : body,
      })
      const text = await res.text()
      const elapsed = Math.round(performance.now() - started)
      setTiming(elapsed)
      setStatus(`${res.status} ${res.statusText}`)
      setResponseHeaders([...res.headers.entries()].map(([key, value]) => `${key}: ${value}`).join('\n'))
      try {
        setResponse(JSON.stringify(JSON.parse(text), null, 2))
      } catch {
        setResponse(text)
      }
      setHistory((h) => [`${method} ${url}`, ...h].slice(0, 12))
      setLogs((l) => [`${new Date().toLocaleTimeString()} -> ${res.status} in ${elapsed}ms`, ...l].slice(0, 16))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Request failed'
      setStatus('error')
      setResponse(msg)
      setLogs((l) => [`${new Date().toLocaleTimeString()} -> ERROR ${msg}`, ...l].slice(0, 16))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="API lab" eyebrow="HTTP" statusTitle="Collections + Request Builder" statusText="A large, Postman-style testing environment with history, request composition, and response diagnostics." />
      <div className="mx-auto max-w-[1720px] px-5 pb-10 sm:px-8">
        <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-border/70 bg-white/85 p-3 backdrop-blur lg:flex-row">
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-28 rounded-lg border border-border bg-background px-3 text-sm">
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m}>{m}</option>)}
          </select>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} className="h-10" />
          <Button onClick={sendRequest} disabled={loading}>{loading ? <Play className="h-4 w-4 animate-pulse" /> : <Play className="h-4 w-4" />}<span className="ml-2">Send</span></Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border/70 bg-white/85 p-4 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.5)]">
            <p className="mb-2 text-sm font-semibold">History / Collections</p>
            <div className="space-y-2 text-xs">
              {history.length ? history.map((item, idx) => (
                <button key={`${item}-${idx}`} onClick={() => setUrl(item.split(' ').slice(1).join(' '))} className="block w-full rounded-lg border border-border bg-background px-2 py-2 text-left hover:border-foreground/30">{item}</button>
              )) : <p className="text-muted-foreground">No requests yet.</p>}
            </div>
          </aside>

          <section className="rounded-2xl border border-border/70 bg-white/85 p-4 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.5)]">
            <div className="mb-3 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold">Request Builder</p>
            </div>
            <div className="mb-3 grid grid-cols-3 rounded-lg border border-border bg-background p-1">
              {(['headers', 'auth', 'body'] as const).map((tab) => (
                <button key={tab} onClick={() => setRequestTab(tab)} className={`rounded-md px-3 py-2 text-xs font-semibold uppercase ${requestTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>{tab}</button>
              ))}
            </div>
            {requestTab === 'headers' && (
              <>
                <p className="mb-1 text-xs text-muted-foreground">Headers</p>
                <Textarea value={headers} onChange={(e) => setHeaders(e.target.value)} className="min-h-[420px] rounded-xl bg-zinc-950 font-mono text-xs text-zinc-100" />
              </>
            )}
            {requestTab === 'auth' && (
              <div className="space-y-3 rounded-xl border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-semibold"><KeyRound className="h-4 w-4 text-primary" /> Auth</div>
                <select value={authType} onChange={(e) => setAuthType(e.target.value)} className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm">
                  <option>None</option>
                  <option>Bearer</option>
                  <option>Basic</option>
                </select>
                <Input value={authValue} onChange={(e) => setAuthValue(e.target.value)} placeholder={authType === 'Bearer' ? 'Token' : authType === 'Basic' ? 'Base64 user:pass' : 'No auth selected'} disabled={authType === 'None'} />
                <div className="rounded-lg border border-border bg-white p-3 text-xs text-muted-foreground">Auth is injected into the request headers only when you press Send.</div>
              </div>
            )}
            {requestTab === 'body' && (
              <>
                <p className="mb-1 text-xs text-muted-foreground">Body</p>
                <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[420px] rounded-xl bg-zinc-950 font-mono text-xs text-zinc-100" />
              </>
            )}
          </section>

          <section className="rounded-2xl border border-border/70 bg-white/85 p-4 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.5)]">
            <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
              <span className={`rounded-full border px-3 py-2 text-center font-semibold ${status.startsWith('2') ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : status === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-border bg-background'}`}>Status: {status}</span>
              <span className="rounded-full border border-border bg-background px-3 py-2 text-center"><Clock3 className="mr-1 inline h-3.5 w-3.5" />{timing ? `${timing}ms` : '--'}</span>
              <span className="rounded-full border border-border bg-background px-3 py-2 text-center">{response ? `${response.length} bytes` : '0 bytes'}</span>
            </div>
            <div className="mb-3 grid grid-cols-3 rounded-lg border border-border bg-background p-1">
              {(['body', 'headers', 'timeline'] as const).map((tab) => (
                <button key={tab} onClick={() => setResponseTab(tab)} className={`rounded-md px-3 py-2 text-xs font-semibold uppercase ${responseTab === tab ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>{tab}</button>
              ))}
            </div>
            {responseTab === 'body' && <CodeFrame value={response} minHeight={460} placeholder="Response body will appear here..." />}
            {responseTab === 'headers' && <CodeFrame value={responseHeaders} minHeight={460} placeholder="Response headers will appear here..." />}
            {responseTab === 'timeline' && (
              <div className="min-h-[516px] rounded-xl border border-border bg-background p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Request timeline</p>
                <div className="space-y-2 text-xs text-muted-foreground">{logs.length ? logs.map((line, idx) => <p key={`${line}-${idx}`} className="rounded-lg border border-border bg-white p-2">{line}</p>) : <p>No logs.</p>}</div>
              </div>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  )
}
