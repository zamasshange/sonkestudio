"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, Copy, FileUp, FolderTree, Minimize2, Play, RotateCcw, ShieldAlert } from 'lucide-react'

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
  const [error, setError] = useState('')

  const parsed = useMemo(() => {
    try {
      const out = JSON.parse(raw)
      setError('')
      return out
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
      return null
    }
  }, [raw])

  const beautified = useMemo(() => {
    if (!parsed) return ''
    return JSON.stringify(parsed, null, indent)
  }, [parsed, indent])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Inspection workspace" eyebrow="JSON" statusTitle="Validate + Visualize" statusText="Raw JSON input, structural tree view, and validation diagnostics in one inspection flow." />
      <div className="mx-auto max-w-[1720px] space-y-5 px-5 pb-10 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-border/70 bg-white/85 p-4 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Raw JSON</p>
              <div className="flex gap-2">
                <Button variant="outline" className="h-8" onClick={() => setRaw('')}>Clear</Button>
                <Button className="h-8" onClick={() => setRaw(beautified || raw)}>Beautify</Button>
              </div>
            </div>
            <Textarea value={raw} onChange={(e) => setRaw(e.target.value)} className="min-h-[500px] font-mono text-xs" />
          </section>

          <section className="rounded-2xl border border-border/70 bg-white/85 p-4 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Formatted + Tree</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Indent</span>
                <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="h-8 rounded-sm border border-border bg-background px-2">
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                </select>
              </div>
            </div>
            <div className="grid gap-3 xl:grid-cols-2">
              <pre className="max-h-[500px] overflow-auto rounded-xl border border-border bg-background p-3 text-xs leading-5">{beautified || 'Invalid JSON'}</pre>
              <div className="max-h-[500px] overflow-auto rounded-xl border border-border bg-background p-3">
                {parsed ? <JsonTreeNode value={parsed} /> : <p className="text-xs text-muted-foreground">Tree unavailable.</p>}
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-border/70 bg-white/85 p-4 shadow-[0_14px_40px_-28px_rgba(0,0,0,0.5)] backdrop-blur">
          {!error ? (
            <div className="flex items-center gap-2 text-emerald-600 text-sm"><CheckCircle2 className="h-4 w-4" /> JSON is valid.</div>
          ) : (
            <div className="flex items-center gap-2 text-red-600 text-sm"><ShieldAlert className="h-4 w-4" /> {error}</div>
          )}
        </section>
      </div>
    </motion.div>
  )
}

export function Base64UtilityLayout({ tool }: { tool: Tool }) {
  const defaultMode = tool.id === 'base64-decode' ? 'decode' : 'encode'
  const [mode, setMode] = useState<'encode' | 'decode'>(defaultMode)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])

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
    setHistory((h) => [`Loaded ${file.name}`, ...h].slice(0, 8))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Rapid utility" eyebrow="B64" statusTitle="Instant conversion" statusText="Compact, technical, and fast conversion with drag-drop and quick copy workflow." />
      <div className="mx-auto max-w-[1100px] px-5 pb-10 sm:px-8">
        <div className="rounded-2xl border border-border/70 bg-white/90 p-5 shadow-[0_25px_80px_-45px_rgba(0,0,0,0.6)] backdrop-blur">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Button variant={mode === 'encode' ? 'default' : 'outline'} onClick={() => setMode('encode')}>Encode</Button>
            <Button variant={mode === 'decode' ? 'default' : 'outline'} onClick={() => setMode('decode')}>Decode</Button>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" onClick={() => setInput('')}><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
              <Button onClick={() => { navigator.clipboard.writeText(output); setHistory((h) => [`Copied ${mode} output`, ...h].slice(0, 8)) }}><Copy className="mr-2 h-4 w-4" />Copy output</Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Plain text or file content...' : 'Base64 string...'} className="min-h-[220px] font-mono text-xs" />
            <Textarea value={output} readOnly className="min-h-[220px] font-mono text-xs" />
          </div>

          <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/80 px-4 py-3 text-sm text-muted-foreground hover:text-foreground">
            <FileUp className="h-4 w-4" /> Drop or choose a file
            <Input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>

          <div className="mt-4 rounded-xl border border-border bg-background p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">History</p>
            <div className="space-y-1 text-xs text-muted-foreground">{history.length ? history.map((item, idx) => <p key={`${item}-${idx}`}>{item}</p>) : <p>No recent conversions.</p>}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function APITesterLayout({ tool }: { tool: Tool }) {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1')
  const [headers, setHeaders] = useState('Content-Type: application/json')
  const [body, setBody] = useState('{\n  "name": "SONKE"\n}')
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState('idle')
  const [timing, setTiming] = useState<number | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const sendRequest = async () => {
    setLoading(true)
    setResponse('')
    const started = performance.now()
    try {
      const parsedHeaders = Object.fromEntries(headers.split('\n').filter(Boolean).map((line) => {
        const [k, ...rest] = line.split(':')
        return [k.trim(), rest.join(':').trim()]
      }))
      const res = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: method === 'GET' ? undefined : body,
      })
      const text = await res.text()
      const elapsed = Math.round(performance.now() - started)
      setTiming(elapsed)
      setStatus(`${res.status} ${res.statusText}`)
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
        <div className="mb-4 flex gap-2 rounded-2xl border border-border/70 bg-white/85 p-3 backdrop-blur">
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
            <p className="mb-2 text-sm font-semibold">Request Builder</p>
            <p className="mb-1 text-xs text-muted-foreground">Headers</p>
            <Textarea value={headers} onChange={(e) => setHeaders(e.target.value)} className="mb-3 min-h-[140px] font-mono text-xs" />
            <p className="mb-1 text-xs text-muted-foreground">Body</p>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[260px] font-mono text-xs" />
          </section>

          <section className="rounded-2xl border border-border/70 bg-white/85 p-4 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.5)]">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="rounded-full border border-border bg-background px-3 py-1">Status: {status}</span>
              <span className="rounded-full border border-border bg-background px-3 py-1">{timing ? `${timing}ms` : '--'}</span>
            </div>
            <pre className="mb-3 min-h-[320px] overflow-auto rounded-xl border border-border bg-background p-3 text-xs">{response || 'Response will appear here...'}</pre>
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Logs</p>
              <div className="space-y-1 text-xs text-muted-foreground">{logs.length ? logs.map((line, idx) => <p key={`${line}-${idx}`}>{line}</p>) : <p>No logs.</p>}</div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  )
}
