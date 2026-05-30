"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BarChart3, Copy, Flame, Grid3X3, Lightbulb, Send, Sparkles, TrendingUp } from 'lucide-react'
import { educationLevels, learningModes, southAfricanLanguages, southAfricanSubjects } from '@/lib/context-options'

async function runAi(tool: Tool, text: string) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool: tool.id, text, toolTitle: tool.name, toolDescription: tool.description }),
  })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Generation failed.')
  }

  const content = data.result || data.choices?.[0]?.message?.content || ''

  if (!content || !content.trim()) {
    throw new Error('No content was returned. Please try again.')
  }

  return content
}

export function UtilityArchetypeLayout({ tool }: { tool: Tool }) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const process = () => {
    let next = input
    if (tool.id.includes('base64')) {
      try {
        next = tool.id.includes('encode') ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)))
      } catch {
        next = 'Invalid value for this mode.'
      }
    }
    setOutput(next)
    setHistory((h) => [`${new Date().toLocaleTimeString()} processed`, ...h].slice(0, 8))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Utility mode" eyebrow="FAST" statusTitle="Instant" statusText="Compact, low-friction utility interaction focused on speed." />
      <div className="mx-auto max-w-[980px] px-5 pb-10 sm:px-8">
        <div className="space-y-4 rounded-2xl border border-border/70 bg-white/85 p-5 shadow-[0_30px_80px_-48px_rgba(0,0,0,0.6)] backdrop-blur">
          <div className="grid gap-3 md:grid-cols-2">
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Input" className="min-h-[180px]" />
            <Textarea value={output} onChange={(e) => setOutput(e.target.value)} placeholder="Output" className="min-h-[180px]" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={process}>Run</Button>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(output)}><Copy className="mr-2 h-4 w-4" />Copy</Button>
          </div>
          <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">{history.length ? history.join(' | ') : 'No history yet'}</div>
        </div>
      </div>
    </motion.div>
  )
}

export function CreatorStudioArchetypeLayout({ tool }: { tool: Tool }) {
  const [idea, setIdea] = useState('')
  const [platform, setPlatform] = useState('TikTok')
  const [tone, setTone] = useState('Bold')
  const [output, setOutput] = useState('')

  const generate = async () => setOutput(await runAi(tool, `Create ${tool.name} output for ${platform} in ${tone} tone. Brief: ${idea}`))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Creator studio" eyebrow="SOCIAL" statusTitle={`${platform} / ${tone}`} statusText="Trend-aware creation with audience, platform, and preview-first workflow." />
      <div className="mx-auto max-w-[1500px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[330px_minmax(0,1fr)_360px]">
          <aside className="rounded-2xl border border-border/70 bg-white/85 p-4"><p className="mb-3 text-sm font-semibold">Trend Controls</p><div className="space-y-2 text-sm"><select value={platform} onChange={(e) => setPlatform(e.target.value)} className="h-9 w-full rounded-sm border border-border bg-background px-2"><option>TikTok</option><option>Instagram</option><option>X</option><option>YouTube</option></select><select value={tone} onChange={(e) => setTone(e.target.value)} className="h-9 w-full rounded-sm border border-border bg-background px-2"><option>Bold</option><option>Funny</option><option>Premium</option><option>Educational</option></select></div></aside>
          <main className="rounded-2xl border border-border/70 bg-white/85 p-4"><Textarea value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Describe audience, hook, offer, format..." className="min-h-[300px]" /><Button className="mt-3" onClick={generate}><Sparkles className="mr-2 h-4 w-4" />Generate</Button><div className="mt-4 rounded-xl border border-border bg-background p-4 whitespace-pre-wrap text-sm">{output || 'Output appears here...'}</div></main>
          <aside className="rounded-2xl border border-border/70 bg-white/85 p-4"><p className="mb-3 text-sm font-semibold">Performance Signals</p><div className="space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />Viral score preview</p><p className="flex items-center gap-2"><Flame className="h-4 w-4" />Trending hashtag lane</p><p className="flex items-center gap-2"><Lightbulb className="h-4 w-4" />CTA suggestions</p></div></aside>
        </div>
      </div>
    </motion.div>
  )
}

export function DocumentArchetypeLayout({ tool }: { tool: Tool }) {
  const [chat, setChat] = useState('')
  const [doc, setDoc] = useState('')
  const send = async () => setDoc(await runAi(tool, `Collaboratively improve this document. User request: ${chat}\nCurrent doc:\n${doc}`))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Document workspace" eyebrow="DOC" statusTitle="Collaborative Drafting" statusText="AI sidebar + editable document canvas with iterative refinement." />
      <div className="mx-auto grid max-w-[1700px] gap-4 px-5 pb-10 sm:px-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border/70 bg-white/85 p-4"><p className="mb-3 text-sm font-semibold">AI Collaborator</p><Textarea value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Ask for rewrite, shorten, improve tone..." className="min-h-[220px]" /><Button className="mt-2" onClick={send}><Send className="mr-2 h-4 w-4" />Apply</Button></aside>
        <section className="rounded-2xl border border-border/70 bg-white/85 p-4"><Input placeholder="Document title" className="mb-3 h-10" /><Textarea value={doc} onChange={(e) => setDoc(e.target.value)} placeholder="Editable document canvas..." className="min-h-[560px]" /></section>
      </div>
    </motion.div>
  )
}

export function EducationArchetypeLayout({ tool }: { tool: Tool }) {
  const [topic, setTopic] = useState('')
  const [output, setOutput] = useState('')
  const [streak] = useState(7)
  const [xp] = useState(1280)
  const [progress] = useState(64)
  const [grade, setGrade] = useState('Grade 10')
  const [subject, setSubject] = useState('Mathematics')
  const [language, setLanguage] = useState('English')
  const [mode, setMode] = useState(learningModes[0])
  const [sessionMins, setSessionMins] = useState(25)
  const generate = async () =>
    setOutput(
      await runAi(
        tool,
        `Create CAPS-aligned study output.
Grade: ${grade}
Subject: ${subject}
Language: ${language}
Mode: ${mode}
Session minutes: ${sessionMins}

Topic or notes:
${topic}

Return:
- concise explanation
- study steps
- quiz questions
- spaced repetition guidance`,
      ),
    )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Learning workspace" eyebrow="LEARN" statusTitle={`${subject} / ${grade}`} statusText="Gamified, CAPS-aware study ecosystem with progress, XP, practice modes, and AI tutoring flow." />
      <div className="mx-auto max-w-[1500px] px-5 pb-10 sm:px-8">
        <div className="mb-4 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-border/70 bg-white/85 p-4 text-sm"><p className="text-muted-foreground">Daily streak</p><p className="text-2xl font-semibold">{streak} days</p></div>
          <div className="rounded-2xl border border-border/70 bg-white/85 p-4 text-sm"><p className="text-muted-foreground">XP earned</p><p className="text-2xl font-semibold">{xp}</p></div>
          <div className="rounded-2xl border border-border/70 bg-white/85 p-4 text-sm"><p className="text-muted-foreground">Progress</p><p className="text-2xl font-semibold">{progress}%</p></div>
          <div className="rounded-2xl border border-border/70 bg-white/85 p-4 text-sm"><p className="text-muted-foreground">Mode</p><p className="text-2xl font-semibold">{mode}</p></div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)_360px]">
          <aside className="rounded-2xl border border-border/70 bg-white/85 p-4">
            <p className="mb-2 text-sm font-semibold">South African Learning Context</p>
            <div className="grid gap-2 text-sm">
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{educationLevels.map((v) => <option key={v}>{v}</option>)}</select>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{southAfricanSubjects.map((v) => <option key={v}>{v}</option>)}</select>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{southAfricanLanguages.map((v) => <option key={v}>{v}</option>)}</select>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{learningModes.map((v) => <option key={v}>{v}</option>)}</select>
              <Input type="number" value={sessionMins} onChange={(e) => setSessionMins(Number(e.target.value) || 25)} className="h-9" />
            </div>
          </aside>
          <section className="rounded-2xl border border-border/70 bg-white/85 p-4">
            <Textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Paste notes, topic, textbook section, or homework question..." className="min-h-[220px]" />
            <Button className="mt-2" onClick={generate}>Generate study set</Button>
            <div className="mt-4 whitespace-pre-wrap rounded-xl border border-border bg-background p-4 text-sm">{output || 'Study content appears here...'}</div>
          </section>
          <aside className="rounded-2xl border border-border/70 bg-white/85 p-4">
            <p className="mb-2 text-sm font-semibold">Study Modes</p>
            <div className="space-y-2 text-sm text-muted-foreground"><p>Flashcards with spaced repetition</p><p>Quiz sprint</p><p>Explain wrong answers</p><p>Achievement badges and streak boosts</p></div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

export function BusinessArchetypeLayout({ tool }: { tool: Tool }) {
  const [brief, setBrief] = useState('')
  const [output, setOutput] = useState('')
  const [focus, setFocus] = useState('Growth')
  const [score, setScore] = useState(72)
  const run = async () => {
    const result = await runAi(tool, `Business strategy workspace.\nFocus: ${focus}\nBrief:\n${brief}\n\nReturn strategy, metrics, risks, and next actions.`)
    setOutput(result)
    setScore((s) => Math.min(98, s + 4))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Business command center" eyebrow="BIZ" statusTitle={`${focus} / Score ${score}`} statusText="Strategic planning environment with optimization signals, recommendations, and execution-ready outputs." />
      <div className="mx-auto max-w-[1650px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
          <aside className="rounded-2xl border border-border/70 bg-white/85 p-4"><p className="text-sm font-semibold">Strategy Lens</p><select value={focus} onChange={(e) => setFocus(e.target.value)} className="mt-3 h-9 w-full rounded-sm border border-border bg-background px-2"><option>Growth</option><option>Conversion</option><option>Retention</option><option>Positioning</option><option>Cost efficiency</option></select><div className="mt-4 rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">Templates: campaign plan, offer angle, competitor response, KPI ladder.</div></aside>
          <main className="rounded-2xl border border-border/70 bg-white/85 p-4"><Textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Describe business context, market, constraints, objective, and decision needed..." className="min-h-[260px]" /><Button className="mt-2" onClick={run}>Generate strategy</Button><div className="mt-4 whitespace-pre-wrap rounded-xl border border-border bg-background p-4 text-sm">{output || 'Business strategy output appears here...'}</div></main>
          <aside className="rounded-2xl border border-border/70 bg-white/85 p-4"><p className="mb-2 text-sm font-semibold">Optimization Signals</p><div className="space-y-2 text-sm text-muted-foreground"><p>Execution readiness: {score}%</p><p>Competitor pressure: Medium</p><p>Confidence level: High</p><p>Recommended next action: Run pilot campaign</p></div></aside>
        </div>
      </div>
    </motion.div>
  )
}

export function AIConversationArchetypeLayout({ tool }: { tool: Tool }) {
  const [chat, setChat] = useState([{ role: 'assistant', text: `I am your ${tool.name} copilot. Ask for rewrites, summaries, ideas, or follow-up refinements.` }])
  const [input, setInput] = useState('')
  const [memory, setMemory] = useState('Keep answers concise and practical.')
  const [loading, setLoading] = useState(false)

  const send = async (message?: string) => {
    const msg = (message || input).trim()
    if (!msg) return
    setInput('')
    setChat((c) => [...c, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const context = chat.slice(-8).map((m) => `${m.role}: ${m.text}`).join('\n')
      const result = await runAi(tool, `Conversation memory: ${memory}\n\nRecent chat:\n${context}\n\nUser: ${msg}\n\nRespond with useful answer and one follow-up question.`)
      setChat((c) => [...c, { role: 'assistant', text: result }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="AI conversation" eyebrow="AI" statusTitle="Context-aware chat" statusText="Conversation-first AI workspace with follow-up prompts, memory, and iterative refinement." />
      <div className="mx-auto max-w-[1500px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-2xl border border-border/70 bg-white/85 p-4">
            <div className="mb-3 flex flex-wrap gap-2">{['Summarize this', 'Rewrite professionally', 'Translate to isiZulu', 'Generate 3 alternatives'].map((q) => <Button key={q} variant="outline" className="h-8 text-xs" onClick={() => send(q)}>{q}</Button>)}</div>
            <div className="h-[520px] space-y-2 overflow-y-auto rounded-xl border border-border bg-background p-3">
              {chat.map((m, i) => <div key={`${m.role}-${i}`} className={`rounded-lg px-3 py-2 text-sm ${m.role === 'assistant' ? 'border border-border bg-white' : 'bg-foreground text-background'}`}>{m.text}</div>)}
            </div>
            <div className="mt-3 flex gap-2"><Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a follow-up..." /><Button onClick={() => send()} disabled={loading || !input.trim()}>{loading ? '...' : 'Send'}</Button></div>
          </section>
          <aside className="rounded-2xl border border-border/70 bg-white/85 p-4"><p className="text-sm font-semibold">Conversation Memory</p><Textarea value={memory} onChange={(e) => setMemory(e.target.value)} className="mt-3 min-h-[150px]" /><div className="mt-3 rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">AI uses memory to keep style, goals, and context consistent across turns.</div></aside>
        </div>
      </div>
    </motion.div>
  )
}

export function DataArchetypeLayout({ tool }: { tool: Tool }) {
  const [prompt, setPrompt] = useState('')
  const [insight, setInsight] = useState('')
  const columns = ['A', 'B', 'C', 'D', 'E']
  const rows = [1, 2, 3, 4, 5, 6]
  const cells = useMemo(() => rows.map((r) => columns.map((c) => `${c}${r}`)), [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Data workspace" eyebrow="GRID" statusTitle="Table + Insights" statusText="Grid-first analytical environment with formula flow and AI insight lane." />
      <div className="mx-auto max-w-[1700px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-border/70 bg-white/85 p-4"><div className="overflow-auto rounded-xl border border-border"><table className="w-full text-xs"><thead><tr>{columns.map((c) => <th key={c} className="border-b border-r border-border bg-background p-2 text-left">{c}</th>)}</tr></thead><tbody>{cells.map((row, idx) => <tr key={idx}>{row.map((cell) => <td key={cell} className="border-r border-t border-border p-0"><input className="h-9 w-full bg-white px-2" defaultValue={cell} /></td>)}</tr>)}</tbody></table></div></section>
          <aside className="rounded-2xl border border-border/70 bg-white/85 p-4"><p className="mb-2 text-sm font-semibold">Formula + Insights</p><Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask for formula or insight" /><Button className="mt-2" onClick={async () => setInsight(await runAi(tool, `Generate spreadsheet insight/formula for: ${prompt}`))}><BarChart3 className="mr-2 h-4 w-4" />Analyze</Button><div className="mt-3 whitespace-pre-wrap rounded-xl border border-border bg-background p-3 text-sm">{insight || 'Insights will appear here.'}</div></aside>
        </div>
      </div>
    </motion.div>
  )
}

export function DeveloperWorkspaceArchetypeLayout({ tool }: { tool: Tool }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Developer workspace" eyebrow="ENGINEER" statusTitle="Technical environment" statusText="Editor-first architecture with diagnostics, panels, and advanced controls." />
      <div className="mx-auto max-w-[1700px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="rounded-2xl border border-border/70 bg-white/85 p-4"><p className="text-sm font-semibold">Project</p><div className="mt-3 space-y-2 text-xs text-muted-foreground"><p className="flex items-center gap-2"><Grid3X3 className="h-3.5 w-3.5" />Files</p><p>Requests</p><p>History</p></div></aside>
          <section className="rounded-2xl border border-border/70 bg-white/85 p-4"><div className="mb-2 flex gap-2 text-xs"><span className="rounded bg-background px-2 py-1">Editor</span><span className="rounded bg-background px-2 py-1">Preview</span><span className="rounded bg-background px-2 py-1">Logs</span></div><div className="min-h-[520px] rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">Use specialized developer tool layout for advanced behavior.</div></section>
          <aside className="rounded-2xl border border-border/70 bg-white/85 p-4"><p className="text-sm font-semibold">Inspector</p><div className="mt-3 text-xs text-muted-foreground">Schema, metrics, tokens, diagnostics.</div></aside>
        </div>
      </div>
    </motion.div>
  )
}
