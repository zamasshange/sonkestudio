"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Search, Sparkles, Target } from 'lucide-react'

export function ResumeOptimizerLayout({ tool }: { tool: Tool }) {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [improved, setImproved] = useState('')
  const [loading, setLoading] = useState(false)

  const keywordCount = useMemo(() => {
    if (!resumeText || !jobDescription) return 0
    const jdWords = new Set(jobDescription.toLowerCase().split(/\W+/).filter((w) => w.length > 4))
    const resumeWords = new Set(resumeText.toLowerCase().split(/\W+/).filter((w) => w.length > 4))
    return [...jdWords].filter((w) => resumeWords.has(w)).length
  }, [resumeText, jobDescription])

  const atsScore = useMemo(() => {
    const base = Math.min(100, Math.round((keywordCount / 30) * 100))
    if (!resumeText.trim()) return 0
    return Math.max(22, base)
  }, [keywordCount, resumeText])

  const runAnalysis = async () => {
    if (!resumeText.trim()) return
    setLoading(true)
    try {
      const prompt = `You are a resume optimizer.
Target role: ${targetRole || 'Not specified'}
Job description:
${jobDescription || 'Not provided'}

Resume:
${resumeText}

Return:
1) ATS gap analysis
2) Missing keywords
3) Bullet improvement suggestions
4) Stronger summary rewrite`
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: tool.id, text: prompt }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Generation failed.')

      const content = data.result || data.choices?.[0]?.message?.content || ''
      if (!content || !content.trim()) {
        throw new Error('No content was returned. Please try again.')
      }

      setAnalysis(content)
    } catch (err) {
      setAnalysis(err instanceof Error ? err.message : 'Generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const improveResume = async () => {
    if (!resumeText.trim()) return
    setLoading(true)
    try {
      const prompt = `Rewrite this resume to better match ${targetRole || 'the target role'} and improve ATS fit.
Job description:
${jobDescription || 'Not provided'}

Resume:
${resumeText}`
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: tool.id, text: prompt }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Generation failed.')

      const content = data.result || data.choices?.[0]?.message?.content || ''
      if (!content || !content.trim()) {
        throw new Error('No content was returned. Please try again.')
      }

      setImproved(content)
    } catch (err) {
      setImproved(err instanceof Error ? err.message : 'Generation failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Resume Optimizer"
        eyebrow="ATS"
        statusTitle={`${targetRole || 'Target role'} / ATS ${atsScore}`}
        statusText="Analyze job match, detect missing keywords, and generate ATS-focused resume improvements."
      />

      <div className="mx-auto max-w-[1720px] px-5 pb-10 sm:px-8">
        <div className="grid gap-5 xl:grid-cols-[330px_minmax(0,1fr)_380px]">
          <aside className="rounded-2xl border border-border bg-white p-5 h-fit xl:sticky xl:top-32">
            <p className="text-sm font-semibold">Optimization Controls</p>
            <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="mt-3" placeholder="Target role" />
            <Textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="mt-3 min-h-[170px]" placeholder="Paste job description" />
            <div className="mt-3 space-y-2">
              <Button className="w-full gap-2" onClick={runAnalysis} disabled={loading}><Search className="h-4 w-4" />Run ATS analysis</Button>
              <Button variant="outline" className="w-full gap-2" onClick={improveResume} disabled={loading}><Sparkles className="h-4 w-4" />Generate optimized version</Button>
            </div>
          </aside>

          <main className="space-y-5">
            <section className="rounded-2xl border border-border bg-white p-5">
              <p className="mb-2 text-sm font-semibold">Current Resume</p>
              <Textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} className="min-h-[320px]" placeholder="Paste your resume text" />
            </section>
            <section className="rounded-2xl border border-border bg-white p-5">
              <p className="mb-2 text-sm font-semibold">Optimized Resume Draft</p>
              <Textarea value={improved} onChange={(e) => setImproved(e.target.value)} className="min-h-[320px]" placeholder="AI-improved resume will appear here" />
            </section>
          </main>

          <aside className="rounded-2xl border border-border bg-white p-5 h-fit xl:sticky xl:top-32">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">ATS Insights</p>
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-semibold">Match score</p>
              <p className="mt-2 text-3xl font-bold">{atsScore}%</p>
              <div className="mt-3 h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${atsScore}%` }} />
              </div>
            </div>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Target className="h-4 w-4" />Matched keywords: {keywordCount}</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Role targeting active</p>
            </div>
            <div className="mt-4 min-h-[320px] whitespace-pre-wrap rounded-xl border border-border bg-background p-3 text-sm">
              {analysis || 'ATS analysis output appears here.'}
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
