"use client"

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Copy, FileDown, Loader2, Sparkles, Wand2 } from 'lucide-react'
import { Tool } from '@/lib/tools-data'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type ChatMessage = { role: 'user' | 'assistant'; text: string }

type WorkspaceConfig = {
  workflowLabel: string
  starterPrompt: string
  proactive: string[]
  focusAreas: string[]
  rightTitle: string
  rightCards: string[]
}

const configs: Record<string, WorkspaceConfig> = {
  'cover-letter': {
    workflowLabel: 'Cover letter workspace',
    starterPrompt: 'Draft a role-tailored cover letter for a Product Designer role at a fintech company.',
    proactive: ['Make this recruiter-focused', 'Highlight measurable impact', 'Strengthen opening paragraph', 'Shorten to one page'],
    focusAreas: ['Role alignment', 'Company fit', 'Outcome-driven bullets', 'Confident close'],
    rightTitle: 'Recruiter Insights',
    rightCards: ['Role match score', 'Keyword coverage', 'Impact density', 'Clarity and tone'],
  },
  'ai-essay': {
    workflowLabel: 'Essay workspace',
    starterPrompt: 'Create a structured essay on how AI affects higher education with a clear thesis.',
    proactive: ['Improve thesis clarity', 'Strengthen counter-argument', 'Improve academic tone', 'Suggest citations'],
    focusAreas: ['Thesis quality', 'Argument strength', 'Paragraph flow', 'Academic voice'],
    rightTitle: 'Academic Insights',
    rightCards: ['Readability level', 'Argument balance', 'Citation opportunities', 'Structure recommendations'],
  },
  'contract-simplifier': {
    workflowLabel: 'Contract simplifier workspace',
    starterPrompt: 'Simplify this contract section and flag high-risk clauses in plain English.',
    proactive: ['Explain clause in plain English', 'Flag legal risk', 'List obligations and deadlines', 'Create negotiation questions'],
    focusAreas: ['Risk flags', 'Deadlines', 'Hidden obligations', 'Negotiation points'],
    rightTitle: 'Legal Insight Panel',
    rightCards: ['Clause risk indicators', 'Critical dates', 'Financial exposure', 'Actions to take'],
  },
  'notes-summarizer': {
    workflowLabel: 'Notes summarizer workspace',
    starterPrompt: 'Summarize these lecture notes and generate exam-focused flashcards.',
    proactive: ['Generate key points', 'Create flashcards', 'Group by topics', 'Explain difficult sections'],
    focusAreas: ['Key concepts', 'Memory hooks', 'Topic clusters', 'Exam readiness'],
    rightTitle: 'Study Insights',
    rightCards: ['Coverage score', 'Knowledge gaps', 'Flashcard count', 'Review plan'],
  },
  'ai-rewriter': {
    workflowLabel: 'Document rewrite workspace',
    starterPrompt: 'Rewrite this document to be more concise, professional, and persuasive.',
    proactive: ['Make more concise', 'Improve professional tone', 'Boost persuasiveness', 'Fix grammar and style'],
    focusAreas: ['Tone consistency', 'Clarity', 'Structure', 'Conversion impact'],
    rightTitle: 'Rewrite Insights',
    rightCards: ['Tone delta', 'Reading ease', 'Sentence quality', 'Section-level suggestions'],
  },
  'pitch-deck': {
    workflowLabel: 'Proposal workspace',
    starterPrompt: 'Draft a client proposal with scope, timeline, outcomes, and CTA.',
    proactive: ['Strengthen value proposition', 'Add timeline detail', 'Improve CTA', 'Add risk mitigation section'],
    focusAreas: ['Value clarity', 'Scope definition', 'Execution plan', 'Decision confidence'],
    rightTitle: 'Proposal Insights',
    rightCards: ['Decision-readiness', 'Scope clarity', 'Commercial strength', 'Next-step quality'],
  },
  'marketing-plan': {
    workflowLabel: 'Business plan workspace',
    starterPrompt: 'Draft a practical business plan with market analysis, operations, and financial assumptions.',
    proactive: ['Sharpen market positioning', 'Add go-to-market steps', 'Stress-test assumptions', 'Improve executive summary'],
    focusAreas: ['Market logic', 'Execution realism', 'Financial assumptions', 'Narrative quality'],
    rightTitle: 'Business Insights',
    rightCards: ['Plan completeness', 'Risk profile', 'Model assumptions', 'Investor readability'],
  },
}

const defaultConfig: WorkspaceConfig = {
  workflowLabel: 'Document workspace',
  starterPrompt: 'Help me create and improve this document with a collaborative workflow.',
  proactive: ['Rewrite selected text', 'Improve structure', 'Professionalize tone', 'Shorten long sections'],
  focusAreas: ['Structure', 'Tone', 'Clarity', 'Readability'],
  rightTitle: 'Document Insights',
  rightCards: ['Readability', 'Tone', 'Structure', 'Actionable improvements'],
}

const inlineActions = ['Rewrite', 'Shorten', 'Expand', 'Improve Tone', 'Make Professional', 'Simplify', 'Translate', 'Fix Grammar', 'Make Persuasive']

export function DocumentAiWorkspaceLayout({ tool }: { tool: Tool }) {
  const config = configs[tool.id] ?? defaultConfig
  const [documentText, setDocumentText] = useState('')
  const [tone, setTone] = useState('Professional')
  const [language, setLanguage] = useState('English')
  const [chat, setChat] = useState<ChatMessage[]>([{ role: 'assistant', text: `I am your ${config.workflowLabel.toLowerCase()} copilot. Paste content or ask me to start from scratch.` }])
  const [chatInput, setChatInput] = useState('')
  const [loading, setLoading] = useState(false)
  const docRef = useRef<HTMLTextAreaElement>(null)

  const quickMetrics = useMemo(() => {
    const words = documentText.trim() ? documentText.trim().split(/\s+/).length : 0
    const paragraphs = documentText.trim() ? documentText.split(/\n\s*\n/).length : 0
    return { words, paragraphs }
  }, [documentText])

  const applyAi = async (instruction: string, selectedText?: string) => {
    setLoading(true)
    try {
      const prompt = `You are an AI document copilot in a collaborative editor.\nTool: ${tool.name}\nTone: ${tone}\nLanguage: ${language}\nInstruction: ${instruction}\n\nCurrent document:\n${documentText || '(empty)'}\n\nSelected text:\n${selectedText || '(none)'}\n\nReturn:\n1) Updated document text\n2) One short follow-up question.`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: tool.id, text: prompt, tone: tone.toLowerCase(), mode: 'enhance' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'AI request failed')
      const content = data.result || data.choices?.[0]?.message?.content || ''
      const parts = content.split(/\n\s*2\)\s*/i)
      const updated = parts[0]?.replace(/^\s*1\)\s*/i, '').trim()
      const followUp = parts[1]?.trim()
      if (updated) setDocumentText(updated)
      setChat((prev) => [...prev, { role: 'assistant', text: followUp || 'Would you like me to refine the next section too?' }])
    } catch (error) {
      setChat((prev) => [...prev, { role: 'assistant', text: error instanceof Error ? error.message : 'Something went wrong.' }])
    } finally {
      setLoading(false)
    }
  }

  const runInlineAction = async (action: string) => {
    const textarea = docRef.current
    if (!textarea) return
    const selected = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)
    const instruction = selected ? `${action} the selected text and integrate it naturally.` : `${action} the full document.`
    await applyAi(instruction, selected)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label={config.workflowLabel}
        eyebrow="DOC AI"
        statusTitle={`${tone} / ${language}`}
        statusText="Collaborate with AI in a live editable document with contextual actions and insight-driven refinement."
      />

      <div className="mx-auto max-w-[1800px] px-4 pb-8 sm:px-8">
        <div className="mb-5 grid gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 text-white lg:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[tone, language, `${quickMetrics.words} words`, `${quickMetrics.paragraphs} sections`].map((item) => (
              <span key={item} className="rounded-full border border-white/20 bg-white/10 px-3 py-1">{item}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="h-9 rounded-md border border-white/20 bg-white/10 px-2 text-sm text-white">
              {['Professional', 'Friendly', 'Academic', 'Persuasive', 'Concise'].map((item) => <option key={item} className="text-black">{item}</option>)}
            </select>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-9 rounded-md border border-white/20 bg-white/10 px-2 text-sm text-white">
              {['English', 'Afrikaans', 'isiZulu', 'French'].map((item) => <option key={item} className="text-black">{item}</option>)}
            </select>
            <Button className="h-9 gap-2 border border-white/25 bg-white/10 text-white hover:bg-white/20" variant="outline" onClick={() => navigator.clipboard.writeText(documentText)}><Copy className="h-4 w-4" />Copy</Button>
            <Button className="h-9 gap-2 border border-white/35 bg-white text-slate-900 hover:bg-white/90" onClick={() => applyAi('Create a polished full draft using the current context and workflow.', documentText || config.starterPrompt)}><Wand2 className="h-4 w-4" />Generate</Button>
            <Button className="h-9 gap-2 border border-white/25 bg-white/10 text-white hover:bg-white/20" variant="outline"><FileDown className="h-4 w-4" />Export</Button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <aside className="rounded-2xl border border-border/60 bg-white/70 p-4 backdrop-blur xl:sticky xl:top-32 h-fit">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Bot className="h-4 w-4" />AI Collaboration</div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {config.proactive.map((item) => (
                <Button
                  key={item}
                  variant="outline"
                  className="h-auto min-h-9 whitespace-normal break-words px-2 py-2 text-center text-xs leading-snug"
                  onClick={() => applyAi(item)}
                  disabled={loading}
                >
                  {item}
                </Button>
              ))}
            </div>
            <div className="h-[420px] space-y-2 overflow-y-auto rounded-xl border border-border bg-background p-3 text-sm">
              {chat.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={`rounded-lg px-3 py-2 whitespace-pre-wrap break-words ${m.role === 'assistant' ? 'border border-border bg-white' : 'bg-primary text-primary-foreground'}`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="min-h-9 resize-none text-sm" placeholder="Ask AI to improve a section..." />
              <Button disabled={loading || !chatInput.trim()} onClick={async () => { const msg = chatInput.trim(); setChatInput(''); setChat((p) => [...p, { role: 'user', text: msg }]); await applyAi(msg) }}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          </aside>

          <main className="rounded-2xl border border-border/60 bg-white/80 p-4 backdrop-blur">
            <div className="mb-3 flex flex-wrap gap-2">
              {inlineActions.map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  className="h-auto min-h-8 whitespace-normal break-words px-3 py-1.5 text-xs leading-snug"
                  onClick={() => runInlineAction(action)}
                  disabled={loading}
                >
                  {action}
                </Button>
              ))}
            </div>
            <Textarea
              ref={docRef}
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder={config.starterPrompt}
              className="min-h-[740px] resize-y rounded-xl border-border bg-white p-5 text-sm leading-7"
            />
          </main>

          <aside className="rounded-2xl border border-border/60 bg-white/70 p-4 backdrop-blur xl:sticky xl:top-32 h-fit">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Insights</p>
            <h3 className="mt-2 text-lg font-semibold">{config.rightTitle}</h3>
            <div className="mt-4 space-y-2">
              {config.rightCards.map((item) => (
                <div key={item} className="rounded-xl border border-border bg-background p-3 text-sm">{item}</div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-border bg-background p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Focus areas</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {config.focusAreas.map((item) => <span key={item} className="rounded-full bg-muted px-2 py-1 text-xs">{item}</span>)}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
