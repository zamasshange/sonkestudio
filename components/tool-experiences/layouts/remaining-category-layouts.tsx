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
import {
  ContextualFollowUps,
  describeAssets,
  InteractionAsset,
  SmartUploadPanel,
} from '@/components/tool-experiences/shared/ai-interaction-panel'

async function askAi(tool: Tool, text: string) {
  const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: tool.id, text }) })
  const data = await res.json()
  return data.result || data.choices?.[0]?.message?.content || ''
}

const uploadEnabledToolIds = new Set([
  'ai-resume',
  'resume-optimizer',
  'ai-resume-feedback',
  'pdf-summarizer',
  'ocr-extractor',
  'doc-scanner',
  'agreement-analyzer',
  'legal-simplifier',
  'contract-simplifier',
  'terms-simplifier',
  'explain-screenshot',
  'explain-contract',
  'explain-legal',
  'explain-chart',
  'explain-spreadsheet',
])

function shouldShowUpload(tool: Tool) {
  return uploadEnabledToolIds.has(tool.id)
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
  const [assets, setAssets] = useState<InteractionAsset[]>([])

  const run = async (followUp?: string) => {
    const assetContext = describeAssets(assets)
    const source = [input, assetContext].filter(Boolean).join('\n\n')
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
      setOutput(await askAi(tool, `Format and validate SQL:\n${source}`))
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
    setOutput(await askAi(tool, `Developer tool task for ${tool.name}:\n${followUp ? `Follow-up:${followUp}\n` : ''}${source}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Developer Lab" eyebrow="DEV" statusTitle={tool.name} statusText="Purpose-built engineering workflow for this specific developer tool." />
      <div className="mx-auto max-w-[1400px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-white p-4 space-y-3">
          {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
          {tool.id === 'regex-tester' && <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Regex pattern" />}
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[320px]" placeholder="Input" />
          <Button onClick={() => run()}>Execute</Button>
        </section>
        <section className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[380px] font-mono text-xs" placeholder="Output" />
          <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
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
  const [assets, setAssets] = useState<InteractionAsset[]>([])

  const run = async (followUp?: string) => {
    setOutput(await askAi(tool, `Creator workflow for ${tool.name}.\nPlatform:${platform}\nAudience:${audience}\n${followUp ? `Follow-up:${followUp}\n` : ''}Brief:${brief}\n${describeAssets(assets)}\nReturn: options + engagement prediction + hook improvements.`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Creator Studio" eyebrow="SOCIAL" statusTitle={`${platform} / ${tool.name}`} statusText="Social-first workflow with trend-aware generation and performance framing." />
      <div className="mx-auto max-w-[1500px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-white p-4 space-y-2">
          {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2"><option>Instagram</option><option>TikTok</option><option>YouTube</option><option>X</option><option>LinkedIn</option></select>
          <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" />
          <Button onClick={() => run()}>Generate</Button>
          {sa.isSouthAfrica && (
            <div className="rounded-lg border border-border bg-background p-2 text-xs text-muted-foreground">
              SA creator cues: local hashtags, Amapiano culture hooks, Johannesburg audience phrasing.
            </div>
          )}
        </aside>
        <main className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <Textarea value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-[180px]" placeholder="Campaign/content brief" />
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[280px]" placeholder="Creator output" />
          <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
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
  const [assets, setAssets] = useState<InteractionAsset[]>([])
  const run = async (followUp?: string) => {
    setOutput(await askAi(tool, `Business strategy for ${tool.name}. KPI:${kpi}\n${followUp ? `Follow-up:${followUp}\n` : ''}Context:${context}\n${describeAssets(assets)}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Business Console" eyebrow="BIZ" statusTitle={`${tool.name} / ${kpi}`} statusText="Strategic business workflow with KPI-centered recommendations and action plans." />
      <div className="mx-auto max-w-[1450px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-white p-4 space-y-2">
          {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
          <select value={kpi} onChange={(e) => setKpi(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2"><option>Revenue</option><option>Conversion</option><option>CAC</option><option>Retention</option><option>Brand Reach</option></select>
          <Button onClick={() => run()}>Run Analysis</Button>
          {sa.isSouthAfrica && (
            <div className="rounded-lg border border-border bg-background p-2 text-xs text-muted-foreground">
              SA business mode active: ZAR pricing, VAT conventions, SME/township context.
            </div>
          )}
        </aside>
        <main className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <Textarea value={context} onChange={(e) => setContext(e.target.value)} className="min-h-[180px]" placeholder="Market context, constraints, goals" />
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[320px]" placeholder="Strategic output" />
          <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
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
  const [assets, setAssets] = useState<InteractionAsset[]>([])
  const run = async (followUp?: string) => {
    setOutput(await askAi(tool, `Explain this in ${level} mode with examples and analogies.\n${followUp ? `Follow-up:${followUp}\n` : ''}${sa.isSouthAfrica ? 'When relevant, include SA context like VAT, SARS, NSFAS, load shedding, matric systems.' : ''}\n${thing}\n${describeAssets(assets)}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Explain Engine" eyebrow="EXPLAIN" statusTitle={`${level} mode`} statusText="Contextual explanation engine with analogy, step-by-step teaching, and follow-up guidance." />
      <div className="mx-auto max-w-[1400px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-white p-4 space-y-3">
          {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2"><option>Simple</option><option>Step-by-step</option><option>Advanced</option><option>ELI5</option></select>
          <Textarea value={thing} onChange={(e) => setThing(e.target.value)} className="min-h-[220px]" placeholder="Paste the thing to explain" />
          <Button onClick={() => run()}>Explain</Button>
        </section>
        <section className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[340px]" placeholder="Explanation" />
          <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
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
  const [assets, setAssets] = useState<InteractionAsset[]>([])
  const fileCount = assets.length
  const run = async (followUp?: string) => {
    setOutput(await askAi(tool, `Document task for ${tool.name}. Mode:${mode}\n${followUp ? `Follow-up:${followUp}\n` : ''}${sa.isSouthAfrica ? 'Use SA-ready conventions where relevant (ZAR, VAT, local legal/business wording).' : ''}\n${doc}\n${describeAssets(assets)}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Document Specialist" eyebrow="DOC" statusTitle={`${tool.name} / ${mode}`} statusText="Document-specific workflow focused on legal, resume, OCR, and summary analysis." />
      <div className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-8">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          {[
            { label: 'Workspace', value: tool.name },
            { label: 'Mode', value: mode },
            { label: 'Files', value: String(fileCount).padStart(2, '0') },
            { label: 'Region', value: sa.isSouthAfrica ? 'SA aware' : 'Global' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">File queue</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">Upload or attach context</h3>
            </div>
            {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Workflow stage</p>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-border bg-white px-3 text-sm">
                <option>Analyze</option>
                <option>Simplify</option>
                <option>Risk flags</option>
                <option>Rewrite</option>
              </select>
            </div>
            <Button onClick={() => run()} className="w-full">Run document workflow</Button>
            <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
              This workspace keeps document logic in one place: upload queue, structured extraction, and follow-up review.
            </div>
          </aside>

          <main className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Document canvas</p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">Paste the text or instructions</h3>
                </div>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">{tool.category}</span>
              </div>
              <Textarea value={doc} onChange={(e) => setDoc(e.target.value)} className="min-h-[250px] rounded-xl border-border bg-background/60" placeholder="Paste document content, clause text, scanned copy notes, or OCR output." />
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border px-2 py-1">Side-by-side preview</span>
                <span className="rounded-full border border-border px-2 py-1">Page and clause awareness</span>
                <span className="rounded-full border border-border px-2 py-1">Copy-ready result</span>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
              <div className="rounded-2xl border border-border bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Analysis output</p>
                  <Button variant="outline" onClick={() => run('Refine the output with clearer headings and a cleaner document focus.')}>Refine</Button>
                </div>
                <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[320px] rounded-xl border-border bg-background/60 font-mono text-xs" placeholder="Document output appears here." />
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-foreground">Document signals</p>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p>• Format scan and extraction flow</p>
                  <p>• Risk flag and rewrite assistance</p>
                  <p>• Summary, simplification, or OCR-style output</p>
                  <p>• Short follow-up prompts for the next pass</p>
                </div>
                <div className="mt-4 rounded-xl border border-border bg-background p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Recent context</p>
                  <div className="mt-2 space-y-2 text-xs text-muted-foreground">
                    {assets.length ? assets.map((asset) => (
                      <div key={`${asset.name}-${asset.url}`} className="rounded-md border border-border bg-white p-2">
                        <p className="truncate font-medium text-foreground">{asset.name}</p>
                        <p className="truncate">{asset.url}</p>
                      </div>
                    )) : <p>No attachments yet.</p>}
                  </div>
                </div>
              </div>
            </section>

            <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
          </main>
        </div>
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
  const [assets, setAssets] = useState<InteractionAsset[]>([])
  const [draftMode, setDraftMode] = useState('Conversation')
  const run = async (nextInstruction = instruction) => {
    setOutput(await askAi(tool, `Tool:${tool.name}\nInstruction:${nextInstruction}\nInput:${input}\n${describeAssets(assets)}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="AI Text Copilot" eyebrow="AI TEXT" statusTitle={tool.name} statusText="Purpose-tuned AI text workflow with instruction-driven transformations and iterative refinements." />
      <div className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-8">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          {[
            { label: 'Mode', value: draftMode },
            { label: 'Instruction', value: instruction },
            { label: 'Assets', value: String(assets.length).padStart(2, '0') },
            { label: 'Locale', value: sa.isSouthAfrica ? 'South Africa aware' : 'Global' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          <aside className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Copilot controls</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">Shape the rewrite path</h3>
            </div>
            {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
            <div className="rounded-xl border border-border bg-background p-3 space-y-2">
              <Input value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="Instruction" />
              <select value={draftMode} onChange={(e) => setDraftMode(e.target.value)} className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm">
                <option>Conversation</option>
                <option>Rewrite</option>
                <option>Shorten</option>
                <option>Expand</option>
                <option>Polish</option>
              </select>
              {sa.isSouthAfrica && (
                <select value={instruction} onChange={(e) => setInstruction(e.target.value)} className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm">
                  {sa.toneModes.map((item) => <option key={item}>{item}</option>)}
                </select>
              )}
            </div>
            <div className="grid gap-2">
              <Button onClick={() => run()} className="w-full">Transform</Button>
              <Button variant="outline" onClick={() => run('Give 3 alternative versions')} className="w-full">3 alternatives</Button>
            </div>
            <div className="grid gap-1">
              {localizedPrompts.slice(0, 4).map((item) => (
                <button key={item} onClick={() => setInstruction(item)} className="rounded-md border border-border bg-background px-2 py-2 text-left text-xs text-muted-foreground hover:text-foreground">
                  {item}
                </button>
              ))}
            </div>
          </aside>

          <main className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <section className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-semibold text-foreground">Prompt canvas</p>
                <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="mt-3 min-h-[260px] rounded-xl border-border bg-white" placeholder="Paste the text you want to transform or refine." />
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-border px-2 py-1">Live preview</span>
                  <span className="rounded-full border border-border px-2 py-1">Iterative generation</span>
                  <span className="rounded-full border border-border px-2 py-1">Conversation memory</span>
                </div>
              </section>
              <section className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-foreground">Suggestion lane</p>
                <div className="mt-3 space-y-2">
                  {[
                    'Make it more concise',
                    'Sound more human',
                    'Give me a formal version',
                    'Add one strong opening line',
                  ].map((item) => (
                    <button key={item} onClick={() => setInstruction(item)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground">
                      {item}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">AI output</p>
                <Button variant="outline" onClick={() => run('Give 3 alternative versions with distinct tones.')}>Refresh variants</Button>
              </div>
              <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="mt-3 min-h-[320px] rounded-xl border-border bg-white font-mono text-xs" placeholder="AI output appears here." />
            </section>

            <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
          </main>

          <aside className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Guidance</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">Refinement stack</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Conversational instructions</p>
              <p>• Immediate follow-up rewrites</p>
              <p>• Platform, audience, and tone-aware suggestions</p>
              <p>• Multiple alternatives on demand</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Prompt shortcuts</p>
              <div className="mt-2 grid gap-2">
                {localizedPrompts.slice(0, 5).map((item) => (
                  <button key={item} onClick={() => setInstruction(item)} className="rounded-md border border-border bg-white px-3 py-2 text-left text-xs text-muted-foreground hover:text-foreground">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
