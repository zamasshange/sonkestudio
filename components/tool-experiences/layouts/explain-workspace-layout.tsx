"use client"

import { ChangeEvent, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Copy, FileUp, Loader2, Sparkles } from 'lucide-react'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import {
  developerLanguages,
  educationLevels,
  explanationDepths,
  southAfricanLanguages,
  southAfricanSubjects,
} from '@/lib/context-options'

type ExplainConfig = {
  label: string
  placeholder: string
  primaryField: string
  modes: string[]
  detailFields: string[]
  acceptsFile?: string
  outputSections: string[]
}

const explainConfigs: Record<string, ExplainConfig> = {
  'explain-screenshot': {
    label: 'Screen context',
    primaryField: 'What should SONKE focus on?',
    placeholder: 'Describe the screenshot or upload it, then tell SONKE what is confusing...',
    modes: ['Plain explanation', 'UI walkthrough', 'Bug diagnosis', 'What to click next', 'Summarize screen'],
    detailFields: ['Platform', 'User goal'],
    acceptsFile: 'image/*',
    outputSections: ['What is happening', 'Important elements', 'Recommended next action'],
  },
  'explain-error': {
    label: 'Error details',
    primaryField: 'Error message or stack trace',
    placeholder: 'Paste the error message, stack trace, log output, or failing command...',
    modes: ['Root cause', 'Step-by-step fix', 'Beginner explanation', 'Production triage', 'Prevention checklist'],
    detailFields: ['Framework', 'Runtime'],
    outputSections: ['Likely cause', 'Fix steps', 'Prevention'],
  },
  'explain-code': {
    label: 'Code snippet',
    primaryField: 'Code to explain',
    placeholder: 'Paste code here and choose the language, framework, and explanation level...',
    modes: ['Line-by-line', 'Simplify code', 'Find bugs', 'Optimize', 'Generate comments'],
    detailFields: ['Code language', 'Framework'],
    outputSections: ['Overview', 'Line-by-line explanation', 'Risks and improvements'],
  },
  'explain-contract': {
    label: 'Contract clause',
    primaryField: 'Clause or contract text',
    placeholder: 'Paste a contract clause or agreement section...',
    modes: ['Plain English', 'Risk review', 'Negotiation points', 'Obligations', 'Red flags'],
    detailFields: ['Jurisdiction', 'Party perspective'],
    acceptsFile: '.pdf,.doc,.docx,.txt',
    outputSections: ['Plain meaning', 'Risks', 'Questions to ask'],
  },
  'explain-legal': {
    label: 'Legal document',
    primaryField: 'Legal text',
    placeholder: 'Paste legal wording, policy text, or a formal notice...',
    modes: ['Plain English', 'Rights and duties', 'Risk summary', 'Action checklist', 'Questions for a professional'],
    detailFields: ['Jurisdiction', 'Document type'],
    acceptsFile: '.pdf,.doc,.docx,.txt',
    outputSections: ['Summary', 'Rights and duties', 'Next steps'],
  },
  'explain-chart': {
    label: 'Chart or data',
    primaryField: 'Data, labels, or chart description',
    placeholder: 'Paste chart labels, table values, or describe what the chart shows...',
    modes: ['Insight summary', 'Trend explanation', 'Executive summary', 'Outlier detection', 'Presentation notes'],
    detailFields: ['Chart type', 'Audience'],
    acceptsFile: 'image/*,.csv,.xlsx',
    outputSections: ['Key insight', 'Trend details', 'Recommended takeaway'],
  },
  'explain-homework': {
    label: 'Homework question',
    primaryField: 'Question',
    placeholder: 'Paste the homework question and choose grade, subject, and language...',
    modes: ['Step-by-step', 'Simple explanation', 'Exam-style answer', 'Check my answer', 'Practice question'],
    detailFields: ['Grade', 'Subject', 'Language'],
    outputSections: ['Method', 'Worked answer', 'Practice check'],
  },
  'explain-email': {
    label: 'Email content',
    primaryField: 'Email to explain',
    placeholder: 'Paste the email and SONKE will explain tone, intent, and what to reply...',
    modes: ['Intent summary', 'Tone analysis', 'Reply advice', 'Simplify email', 'Action items'],
    detailFields: ['Relationship', 'Reply goal'],
    outputSections: ['Meaning', 'Tone', 'Suggested response'],
  },
  'explain-spreadsheet': {
    label: 'Spreadsheet data',
    primaryField: 'Rows, formulas, or sheet description',
    placeholder: 'Paste formulas, rows, column names, or describe the spreadsheet...',
    modes: ['Formula explanation', 'Data summary', 'Find errors', 'Dashboard insight', 'Cleaning steps'],
    detailFields: ['Spreadsheet app', 'Goal'],
    acceptsFile: '.csv,.xlsx',
    outputSections: ['What it shows', 'Formula or data logic', 'Recommended actions'],
  },
  'explain-api-error': {
    label: 'API failure',
    primaryField: 'Request, response, or error',
    placeholder: 'Paste status code, request body, response body, headers, or logs...',
    modes: ['Debug request', 'Explain status code', 'Fix authentication', 'CORS check', 'Retry strategy'],
    detailFields: ['Method', 'Environment'],
    outputSections: ['Diagnosis', 'Fix', 'Test again'],
  },
}

function optionsForField(field: string) {
  if (field === 'Code language') return developerLanguages
  if (field === 'Grade') return educationLevels
  if (field === 'Subject') return southAfricanSubjects
  if (field === 'Language') return southAfricanLanguages
  if (field === 'Framework') return ['None', 'React', 'Next.js', 'Node.js', 'Django', 'Laravel', 'Spring', '.NET', 'Flutter']
  if (field === 'Runtime') return ['Browser', 'Node.js', 'Python', 'Java', 'Docker', 'Serverless', 'Mobile']
  if (field === 'Jurisdiction') return ['South Africa', 'United States', 'United Kingdom', 'European Union', 'Other']
  if (field === 'Party perspective') return ['Individual', 'Customer', 'Supplier', 'Employee', 'Employer', 'Founder']
  if (field === 'Document type') return ['Contract', 'Policy', 'Notice', 'Terms and conditions', 'Letter', 'Compliance document']
  if (field === 'Chart type') return ['Bar chart', 'Line chart', 'Pie chart', 'Dashboard', 'Table', 'Unknown']
  if (field === 'Audience') return ['Student', 'Executive', 'Client', 'Developer', 'General audience']
  if (field === 'Relationship') return ['Client', 'Manager', 'Colleague', 'Customer support', 'Friend', 'Unknown']
  if (field === 'Reply goal') return ['Clarify', 'Accept', 'Decline', 'Negotiate', 'Apologize', 'Follow up']
  if (field === 'Spreadsheet app') return ['Excel', 'Google Sheets', 'CSV', 'Airtable', 'Unknown']
  if (field === 'Goal') return ['Understand', 'Fix errors', 'Summarize', 'Prepare report', 'Clean data']
  if (field === 'Method') return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  if (field === 'Environment') return ['Localhost', 'Production', 'Staging', 'Vercel', 'Mobile app']
  if (field === 'Platform') return ['Web app', 'Mobile app', 'Desktop app', 'Dashboard', 'Website']
  if (field === 'User goal') return ['Understand screen', 'Fix issue', 'Find next step', 'Improve UX', 'Summarize']
  return ['General', 'Detailed', 'Beginner', 'Professional']
}

export function ExplainWorkspaceLayout({ tool }: { tool: Tool }) {
  const config = explainConfigs[tool.id] || explainConfigs['explain-error']
  const [mode, setMode] = useState(config.modes[0])
  const [depth, setDepth] = useState(explanationDepths[1])
  const [input, setInput] = useState('')
  const [fileName, setFileName] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [context, setContext] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.detailFields.map((field) => [field, optionsForField(field)[0]]))
  )
  const [error, setError] = useState('')

  const contextSummary = useMemo(
    () => Object.entries(context).map(([key, value]) => `${key}: ${value}`).join(' / '),
    [context]
  )

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setFileName(file.name)
  }

  const explain = async () => {
    if (!input.trim() && !fileName) return
    setLoading(true)
    setError('')
    setOutput('')

    const prompt = `Tool: ${tool.name}
Mode: ${mode}
Depth: ${depth}
Context: ${contextSummary || 'General'}
Uploaded file: ${fileName || 'none'}

User material:
${input || 'The user uploaded a file and needs explanation based on the selected context.'}

Return a practical explanation with these sections:
${config.outputSections.map((section) => `- ${section}`).join('\n')}

Make it specific, actionable, and avoid generic filler.`

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
      if (!response.ok) throw new Error(data.error || 'Explanation failed.')
      setOutput(data.result || data.choices?.[0]?.message?.content || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Explanation failed.')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Explain workspace"
        eyebrow="WHY"
        statusTitle={mode}
        statusText="Add the confusing thing, choose context and depth, then get a structured explanation with clear next steps."
      />

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <aside className="space-y-6">
            <section className="rounded-none border border-border bg-white p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Explain mode</p>
              <div className="mt-5 grid gap-2">
                {config.modes.map((item) => (
                  <button key={item} onClick={() => setMode(item)} className={`rounded-none border px-3 py-2 text-left text-sm ${mode === item ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary'}`}>
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-none border border-border bg-white p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Context</p>
              <div className="mt-5 grid gap-3">
                <label className="grid gap-2 text-sm font-medium">
                  Detail level
                  <select value={depth} onChange={(event) => setDepth(event.target.value)} className="rounded-none border border-border bg-white px-3 py-2 text-sm font-normal">
                    {explanationDepths.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                {config.detailFields.map((field) => (
                  <label key={field} className="grid gap-2 text-sm font-medium">
                    {field}
                    <select value={context[field]} onChange={(event) => setContext((current) => ({ ...current, [field]: event.target.value }))} className="rounded-none border border-border bg-white px-3 py-2 text-sm font-normal">
                      {optionsForField(field).map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                ))}
              </div>
            </section>
          </aside>

          <main className="space-y-6">
            <section className="rounded-none border border-border bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">{config.label}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">{config.primaryField}</h2>
                </div>
                {config.acceptsFile && (
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-none border border-border px-3 py-2 text-sm hover:border-primary">
                    <FileUp className="h-4 w-4" />
                    Upload
                    <input type="file" accept={config.acceptsFile} onChange={handleFile} className="hidden" />
                  </label>
                )}
              </div>
              {fileName && <p className="mt-4 text-sm text-muted-foreground">Attached: {fileName}</p>}
              <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder={config.placeholder} className="mt-5 min-h-[320px] resize-none bg-muted border-none" />
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">{input.length} characters</span>
                <Button onClick={explain} disabled={loading || (!input.trim() && !fileName)} className="rounded-none bg-primary">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Explain
                </Button>
              </div>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </section>

            <section className="rounded-none border border-border bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">SONKE explanation</p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">{mode}</h2>
                </div>
                <Button variant="outline" onClick={copy} disabled={!output} className="rounded-none">
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="mt-5 min-h-[260px] rounded-none border border-border bg-muted p-5 text-sm leading-7 whitespace-pre-wrap">
                {output || 'Choose a mode, add context, and SONKE will build a focused explanation here.'}
              </div>
            </section>
          </main>

          <aside className="rounded-none border border-border bg-white p-6 h-fit">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Output plan</p>
            <div className="mt-5 space-y-3">
              {config.outputSections.map((section) => (
                <div key={section} className="flex items-start gap-3 rounded-none border border-border bg-background p-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{section}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-none border border-border bg-background p-4 text-sm text-muted-foreground">
              {contextSummary || 'General explanation'} / {depth}
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
