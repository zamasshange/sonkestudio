"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Bot, Copy, Loader2, Mail, Send, Wand2 } from 'lucide-react'

interface EmailWorkspaceLayoutProps {
  tool: Tool
}

type ChatMessage = { role: 'user' | 'assistant'; text: string }

const tones = ['Professional', 'Friendly', 'Confident', 'Direct', 'Empathetic']
const audiences = ['Client', 'Recruiter', 'Manager', 'Lecturer', 'Team', 'Customer']
const urgencyOptions = ['Low', 'Normal', 'Urgent']
const languages = ['English', 'isiZulu', 'Afrikaans', 'French']
const emailTypes = ['Follow-up', 'Job application', 'Sales outreach', 'Support', 'Apology', 'Meeting']

export function EmailWorkspaceLayout({ tool }: EmailWorkspaceLayoutProps) {
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'I can co-write this email with you. Share the intent, recipient, and what response you want.' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [loading, setLoading] = useState(false)

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [signature, setSignature] = useState('Best regards,\nYour Name')
  const [tone, setTone] = useState(tones[0])
  const [audience, setAudience] = useState(audiences[0])
  const [urgency, setUrgency] = useState(urgencyOptions[1])
  const [language, setLanguage] = useState(languages[0])
  const [emailType, setEmailType] = useState(emailTypes[0])

  const conversationSummary = useMemo(() => chat.slice(-8).map((m) => `${m.role}: ${m.text}`).join('\n'), [chat])

  const askAi = async (instruction: string) => {
    setLoading(true)
    try {
      const prompt = `You are an expert email copilot.\nTone: ${tone}\nAudience: ${audience}\nUrgency: ${urgency}\nLanguage: ${language}\nType: ${emailType}\n\nConversation:\n${conversationSummary}\n\nSubject:\n${subject || '(empty)'}\n\nBody:\n${body || '(empty)'}\n\nSignature:\n${signature}\n\nInstruction:\n${instruction}\n\nReturn exactly:\nSUBJECT: ...\nBODY: ...\nSUGGESTION: ...`
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: tool.id, text: prompt, tone: tone.toLowerCase(), mode: 'enhance' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to generate')
      const content = data.result || data.choices?.[0]?.message?.content || ''
      const nextSubject = content.match(/SUBJECT:\s*([\s\S]*?)\nBODY:/i)?.[1]?.trim()
      const nextBody = content.match(/BODY:\s*([\s\S]*?)\nSUGGESTION:/i)?.[1]?.trim()
      const suggestion = content.match(/SUGGESTION:\s*([\s\S]*)/i)?.[1]?.trim()
      if (nextSubject) setSubject(nextSubject)
      if (nextBody) setBody(nextBody)
      setChat((prev) => [...prev, { role: 'assistant', text: suggestion || 'Want a shorter or more formal version next?' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero
        tool={tool}
        label="Email workspace"
        eyebrow="MAIL"
        statusTitle={`${tone} / ${emailType}`}
        statusText="Collaborative AI chat, live editable email canvas, and smart suggestions in one workspace."
      />

      <div className="mx-auto max-w-[1800px] px-4 pb-10 sm:px-8">
        <div className="mb-5 grid gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 text-white lg:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap gap-2 text-xs">
            {[tone, audience, urgency, language, emailType].map((item) => <span key={item} className="rounded-full border border-white/20 bg-white/10 px-3 py-1">{item}</span>)}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" className="h-9 gap-2" onClick={() => askAi('Generate 5 strong subject lines and apply the best one.')}>Subject Ideas</Button>
            <Button variant="secondary" className="h-9 gap-2" onClick={() => askAi('Create a follow-up email for this thread.')}>Follow-up</Button>
            <Button variant="secondary" className="h-9 gap-2" onClick={() => askAi('Improve CTA and give one high-conversion alternative.')}>CTA Boost</Button>
            <Button className="h-9 gap-2" onClick={() => navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}\n\n${signature}`)}><Copy className="h-4 w-4" />Copy</Button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <aside className="rounded-2xl border border-border/60 bg-white/70 p-4 backdrop-blur xl:sticky xl:top-32 h-fit">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Bot className="h-4 w-4" />AI Collaboration</div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              {['Shorten', 'Expand', 'Fix grammar', 'More formal'].map((item) => (
                <Button key={item} variant="outline" className="h-8 text-xs" onClick={() => askAi(`${item} this email while preserving intent.`)} disabled={loading}>{item}</Button>
              ))}
            </div>
            <div className="h-[420px] space-y-2 overflow-y-auto rounded-xl border border-border bg-background p-3 text-sm">
              {chat.map((m, i) => <div key={`${m.role}-${i}`} className={`rounded-lg px-3 py-2 ${m.role === 'assistant' ? 'border border-border bg-white' : 'bg-primary text-primary-foreground'}`}>{m.text}</div>)}
            </div>
            <div className="mt-3 flex gap-2">
              <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask AI for refinements..." />
              <Button disabled={loading || !chatInput.trim()} onClick={async () => { const msg = chatInput.trim(); setChatInput(''); setChat((p) => [...p, { role: 'user', text: msg }]); await askAi(msg) }}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </aside>

          <main className="rounded-2xl border border-border/60 bg-white/80 p-4 backdrop-blur">
            <div className="mb-3 grid gap-2 md:grid-cols-5">
              {[
                [tone, setTone, tones],
                [audience, setAudience, audiences],
                [urgency, setUrgency, urgencyOptions],
                [language, setLanguage, languages],
                [emailType, setEmailType, emailTypes],
              ].map(([value, setter, items], idx) => (
                <select key={idx} value={value as string} onChange={(e) => (setter as (v: string) => void)(e.target.value)} className="h-10 rounded-md border border-border bg-background px-2 text-sm">
                  {(items as string[]).map((item) => <option key={item}>{item}</option>)}
                </select>
              ))}
            </div>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject line" className="mb-3 h-11 text-base" />
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write and edit your email body here..." className="min-h-[520px] resize-y text-sm leading-6" />
            <Textarea value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Signature" className="mt-3 min-h-[90px] resize-y text-sm" />
            <div className="mt-3 flex gap-2">
              <Button variant="outline" onClick={() => askAi('Rewrite the opening greeting and improve first-paragraph clarity.')}>Smart greeting</Button>
              <Button variant="outline" onClick={() => askAi('Regenerate the second paragraph only with clearer value proposition.')}>Regenerate paragraph</Button>
              <Button onClick={() => askAi('Generate a polished final version ready to send.')}><Wand2 className="mr-2 h-4 w-4" />Finalize draft</Button>
            </div>
          </main>

          <aside className="rounded-2xl border border-border/60 bg-white/70 p-4 backdrop-blur xl:sticky xl:top-32 h-fit">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Smart Suggestions</p>
            <div className="mt-3 space-y-2 text-sm">
              {['Add a clearer deadline in CTA', 'Subject could be 20% shorter', 'Tone is strong for recruiter outreach', 'Include one concrete outcome metric'].map((item) => (
                <button key={item} onClick={() => askAi(item)} className="w-full rounded-xl border border-border bg-background p-3 text-left hover:border-foreground/30">{item}</button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-border bg-background p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3.5 w-3.5" />Desktop preview</div>
              <p className="text-sm font-semibold">{subject || 'Subject line preview'}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground line-clamp-6">{body || 'Email preview...'}</p>
            </div>
            <div className="mt-3 mx-auto max-w-[260px] rounded-[28px] border border-border bg-background p-4 shadow-sm">
              <div className="mb-2 text-xs text-muted-foreground">Mobile preview</div>
              <p className="text-sm font-semibold line-clamp-2">{subject || 'Subject line'}</p>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-6">{body || 'Body preview...'}</p>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
