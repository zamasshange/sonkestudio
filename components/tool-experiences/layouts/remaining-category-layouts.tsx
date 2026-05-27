"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLocation } from '@/hooks/use-location'
import { getLocalizedPromptSuggestions } from '@/lib/smart-recommendations'
import { getSAContextSignal } from '@/lib/sa-intelligence'

async function askAi(tool: Tool, text: string) {
  const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: tool.id, text }) })
  const data = await res.json()
  return data.result || data.choices?.[0]?.message?.content || ''
}

export function UtilityPurposeLayout({ tool }: { tool: Tool }) {
  const [inputA, setInputA] = useState('')
  const [inputB, setInputB] = useState('')
  const [output, setOutput] = useState('')

  const run = async () => {
    if (tool.id === 'word-counter' || tool.id === 'char-counter') {
      const words = inputA.trim() ? inputA.trim().split(/\s+/).length : 0
      const chars = inputA.length
      const lines = inputA ? inputA.split('\n').length : 0
      setOutput(`Words: ${words}\nCharacters: ${chars}\nLines: ${lines}`)
      return
    }
    if (tool.id === 'case-converter') {
      setOutput(`UPPER:\n${inputA.toUpperCase()}\n\nlower:\n${inputA.toLowerCase()}\n\nTitle:\n${inputA.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase())}`)
      return
    }
    if (tool.id === 'text-compare') {
      const a = new Set(inputA.split(/\s+/).filter(Boolean))
      const b = new Set(inputB.split(/\s+/).filter(Boolean))
      const onlyA = [...a].filter((x) => !b.has(x)).slice(0, 50)
      const onlyB = [...b].filter((x) => !a.has(x)).slice(0, 50)
      setOutput(`Only in A:\n${onlyA.join(', ') || '-'}\n\nOnly in B:\n${onlyB.join(', ') || '-'}`)
      return
    }
    if (tool.id === 'uuid-generator') {
      const list = Array.from({ length: Math.max(1, Number(inputA) || 1) }, () => crypto.randomUUID())
      setOutput(list.join('\n'))
      return
    }
    if (tool.id === 'random-generator') {
      const max = Number(inputA) || 100
      const min = Number(inputB) || 1
      setOutput(String(Math.floor(Math.random() * (max - min + 1)) + min))
      return
    }
    if (tool.id === 'password-generator' || tool.id === 'password-checker') {
      const prompt = tool.id === 'password-generator'
        ? `Generate a secure password pack based on this request: ${inputA || 'length 16, symbols yes'}`
        : `Evaluate password strength and give improvements: ${inputA}`
      setOutput(await askAi(tool, prompt))
      return
    }
    if (tool.id === 'qr-generator') {
      setOutput(`QR payload ready:\n${inputA}\n\nTip: Use short links for better scan reliability.`)
      return
    }
    if (tool.id === 'unit-converter') {
      setOutput(await askAi(tool, `Convert with clear steps: ${inputA}`))
      return
    }
    setOutput(await askAi(tool, `Utility task:\nA:${inputA}\nB:${inputB}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Utility Tool" eyebrow="FAST" statusTitle="Instant Mode" statusText="Purpose-built quick utility flow with direct input-output behavior." />
      <div className="mx-auto max-w-[1100px] px-5 pb-10 sm:px-8">
        <div className="rounded-2xl border border-border bg-white p-5 space-y-3">
          <Input value={inputA} onChange={(e) => setInputA(e.target.value)} placeholder="Primary input" />
          {(tool.id === 'text-compare' || tool.id === 'random-generator') && <Input value={inputB} onChange={(e) => setInputB(e.target.value)} placeholder={tool.id === 'text-compare' ? 'Second text' : 'Min value'} />}
          <Button onClick={run}>Run</Button>
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[280px]" placeholder="Result" />
        </div>
      </div>
    </motion.div>
  )
}

export function DeveloperPurposeLayout({ tool }: { tool: Tool }) {
  const [input, setInput] = useState('')
  const [pattern, setPattern] = useState('')
  const [output, setOutput] = useState('')

  const run = async () => {
    if (tool.id === 'regex-tester') {
      try {
        const re = new RegExp(pattern, 'g')
        const matches = [...input.matchAll(re)].map((m) => m[0])
        setOutput(`Matches (${matches.length}):\n${matches.join('\n') || 'None'}`)
      } catch (e) {
        setOutput(e instanceof Error ? e.message : 'Invalid regex')
      }
      return
    }
    if (tool.id === 'sql-formatter') {
      setOutput(await askAi(tool, `Format and validate SQL:\n${input}`))
      return
    }
    if (tool.id === 'jwt-decoder') {
      const parts = input.split('.')
      if (parts.length < 2) {
        setOutput('Invalid JWT format')
        return
      }
      try {
        const decode = (v: string) => atob(v.replace(/-/g, '+').replace(/_/g, '/'))
        setOutput(`HEADER:\n${decode(parts[0])}\n\nPAYLOAD:\n${decode(parts[1])}`)
      } catch {
        setOutput('Could not decode token.')
      }
      return
    }
    setOutput(await askAi(tool, `Developer tool task for ${tool.name}:\n${input}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Developer Lab" eyebrow="DEV" statusTitle={tool.name} statusText="Purpose-built engineering workflow for this specific developer tool." />
      <div className="mx-auto max-w-[1400px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-white p-4 space-y-3">
          {tool.id === 'regex-tester' && <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Regex pattern" />}
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[320px]" placeholder="Input" />
          <Button onClick={run}>Execute</Button>
        </section>
        <section className="rounded-2xl border border-border bg-white p-4">
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[380px] font-mono text-xs" placeholder="Output" />
        </section>
      </div>
    </motion.div>
  )
}

export function CreatorPurposeLayout({ tool }: { tool: Tool }) {
  const { location } = useLocation()
  const sa = getSAContextSignal(location)
  const [brief, setBrief] = useState('')
  const [platform, setPlatform] = useState('Instagram')
  const [audience, setAudience] = useState('Gen Z')
  const [output, setOutput] = useState('')

  const run = async () => {
    setOutput(await askAi(tool, `Creator workflow for ${tool.name}.\nPlatform:${platform}\nAudience:${audience}\nBrief:${brief}\nReturn: options + engagement prediction + hook improvements.`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Creator Studio" eyebrow="SOCIAL" statusTitle={`${platform} / ${tool.name}`} statusText="Social-first workflow with trend-aware generation and performance framing." />
      <div className="mx-auto max-w-[1500px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-white p-4 space-y-2">
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2"><option>Instagram</option><option>TikTok</option><option>YouTube</option><option>X</option><option>LinkedIn</option></select>
          <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" />
          <Button onClick={run}>Generate</Button>
          {sa.isSouthAfrica && (
            <div className="rounded-lg border border-border bg-background p-2 text-xs text-muted-foreground">
              SA creator cues: local hashtags, Amapiano culture hooks, Johannesburg audience phrasing.
            </div>
          )}
        </aside>
        <main className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <Textarea value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-[180px]" placeholder="Campaign/content brief" />
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[280px]" placeholder="Creator output" />
        </main>
      </div>
    </motion.div>
  )
}

export function BusinessPurposeLayout({ tool }: { tool: Tool }) {
  const { location } = useLocation()
  const sa = getSAContextSignal(location)
  const [context, setContext] = useState('')
  const [kpi, setKpi] = useState('Revenue')
  const [output, setOutput] = useState('')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Business Console" eyebrow="BIZ" statusTitle={`${tool.name} / ${kpi}`} statusText="Strategic business workflow with KPI-centered recommendations and action plans." />
      <div className="mx-auto max-w-[1450px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-white p-4 space-y-2">
          <select value={kpi} onChange={(e) => setKpi(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2"><option>Revenue</option><option>Conversion</option><option>CAC</option><option>Retention</option><option>Brand Reach</option></select>
          <Button onClick={async () => setOutput(await askAi(tool, `Business strategy for ${tool.name}. KPI:${kpi}\nContext:${context}`))}>Run Analysis</Button>
          {sa.isSouthAfrica && (
            <div className="rounded-lg border border-border bg-background p-2 text-xs text-muted-foreground">
              SA business mode active: ZAR pricing, VAT conventions, SME/township context.
            </div>
          )}
        </aside>
        <main className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <Textarea value={context} onChange={(e) => setContext(e.target.value)} className="min-h-[180px]" placeholder="Market context, constraints, goals" />
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[320px]" placeholder="Strategic output" />
        </main>
      </div>
    </motion.div>
  )
}

export function ExplainPurposeLayout({ tool }: { tool: Tool }) {
  const { location } = useLocation()
  const sa = getSAContextSignal(location)
  const [thing, setThing] = useState('')
  const [level, setLevel] = useState('Simple')
  const [output, setOutput] = useState('')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Explain Engine" eyebrow="EXPLAIN" statusTitle={`${level} mode`} statusText="Contextual explanation engine with analogy, step-by-step teaching, and follow-up guidance." />
      <div className="mx-auto max-w-[1400px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2"><option>Simple</option><option>Step-by-step</option><option>Advanced</option><option>ELI5</option></select>
          <Textarea value={thing} onChange={(e) => setThing(e.target.value)} className="min-h-[220px]" placeholder="Paste the thing to explain" />
          <Button onClick={async () => setOutput(await askAi(tool, `Explain this in ${level} mode with examples and analogies.\n${sa.isSouthAfrica ? 'When relevant, include SA context like VAT, SARS, NSFAS, load shedding, matric systems.' : ''}\n${thing}`))}>Explain</Button>
        </section>
        <section className="rounded-2xl border border-border bg-white p-4">
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[340px]" placeholder="Explanation" />
        </section>
      </div>
    </motion.div>
  )
}

export function DocumentPurposeLayout({ tool }: { tool: Tool }) {
  const { location } = useLocation()
  const sa = getSAContextSignal(location)
  const [doc, setDoc] = useState('')
  const [mode, setMode] = useState('Analyze')
  const [output, setOutput] = useState('')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Document Specialist" eyebrow="DOC" statusTitle={`${tool.name} / ${mode}`} statusText="Document-specific workflow focused on legal, resume, OCR, and summary analysis." />
      <div className="mx-auto max-w-[1500px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-white p-4 space-y-2">
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2"><option>Analyze</option><option>Simplify</option><option>Risk flags</option><option>Rewrite</option></select>
          <Button onClick={async () => setOutput(await askAi(tool, `Document task for ${tool.name}. Mode:${mode}\n${sa.isSouthAfrica ? 'Use SA-ready conventions where relevant (ZAR, VAT, local legal/business wording).' : ''}\n${doc}`))}>Run</Button>
        </aside>
        <main className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <Textarea value={doc} onChange={(e) => setDoc(e.target.value)} className="min-h-[180px]" placeholder="Paste document content" />
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[320px]" placeholder="Document output" />
        </main>
      </div>
    </motion.div>
  )
}

export function AITextPurposeLayout({ tool }: { tool: Tool }) {
  const { location } = useLocation()
  const sa = getSAContextSignal(location)
  const localizedPrompts = getLocalizedPromptSuggestions(location)
  const [input, setInput] = useState('')
  const [instruction, setInstruction] = useState('Improve clarity')
  const [output, setOutput] = useState('')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="AI Text Copilot" eyebrow="AI TEXT" statusTitle={tool.name} statusText="Purpose-tuned AI text workflow with instruction-driven transformations and iterative refinements." />
      <div className="mx-auto max-w-[1450px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-white p-4 space-y-2">
          <Input value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="Instruction" />
          <Button onClick={async () => setOutput(await askAi(tool, `Tool:${tool.name}\nInstruction:${instruction}\nInput:${input}`))}>Transform</Button>
          <Button variant="outline" onClick={async () => setOutput(await askAi(tool, `Tool:${tool.name}\nInstruction:Give 3 alternative versions\nInput:${input}`))}>3 Alternatives</Button>
          {sa.isSouthAfrica && (
            <select value={instruction} onChange={(e) => setInstruction(e.target.value)} className="h-9 w-full rounded-sm border border-border bg-background px-2 text-sm">
              {sa.toneModes.map((item) => <option key={item}>{item}</option>)}
            </select>
          )}
          <div className="grid gap-1">
            {localizedPrompts.slice(0, 4).map((item) => (
              <button key={item} onClick={() => setInstruction(item)} className="rounded-md border border-border bg-background px-2 py-1 text-left text-xs text-muted-foreground hover:text-foreground">
                {item}
              </button>
            ))}
          </div>
        </aside>
        <main className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[180px]" placeholder="Text input" />
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[320px]" placeholder="AI output" />
        </main>
      </div>
    </motion.div>
  )
}
