"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Copy, Loader2, RefreshCw, Sparkles, Wand2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import {
  educationLevels,
  learningModes,
  southAfricanLanguages,
  southAfricanSubjects,
} from '@/lib/context-options'

interface GenericToolLayoutProps {
  tool: Tool
}

const workspaceModes = ['Fast draft', 'Polished output', 'Step-by-step', 'Creative options']
const qualityChecks = ['Clear structure', 'Specific details', 'Ready to copy', 'Actionable next step']

type ToolWorkspaceProfile = {
  label: string
  inputTitle: string
  outputTitle: string
  placeholder: string
  modes: string[]
  checks: string[]
  helper: string
}

const categoryProfiles: Record<string, ToolWorkspaceProfile> = {
  student: {
    label: 'Study desk',
    inputTitle: 'Add the study material or question',
    outputTitle: 'Learning plan',
    placeholder: 'Paste the question, notes, textbook extract, topic, grade level, marking rubric, or the part you are stuck on...',
    modes: ['Explain simply', 'Practice questions', 'Exam ready', 'Step-by-step'],
    checks: ['Matches level', 'Shows working', 'Uses examples', 'Ends with practice'],
    helper: 'The response should teach the concept, not just give an answer.',
  },
  creator: {
    label: 'Creator studio',
    inputTitle: 'Describe the content goal',
    outputTitle: 'Content assets',
    placeholder: 'Add your niche, platform, audience, topic, offer, tone, hook angle, and any examples you want matched...',
    modes: ['Viral hooks', 'Caption pack', 'Platform native', 'Idea bank'],
    checks: ['Strong opening', 'Platform fit', 'Clear audience', 'Reusable variants'],
    helper: 'The output should feel ready for a social platform, with options and angles.',
  },
  business: {
    label: 'Business workspace',
    inputTitle: 'Add the business context',
    outputTitle: 'Business output',
    placeholder: 'Add the company, audience, goal, market, constraints, existing notes, and what decision this output should support...',
    modes: ['Executive polish', 'Strategic options', 'Investor ready', 'Action plan'],
    checks: ['Business specific', 'Decision useful', 'Clear next steps', 'No vague filler'],
    helper: 'The result should be practical enough to use in a real business workflow.',
  },
  everyday: {
    label: 'Utility bench',
    inputTitle: 'Enter the item to process',
    outputTitle: 'Processed result',
    placeholder: 'Paste or type the text, values, links, data, or options this utility should process...',
    modes: ['Quick result', 'Detailed view', 'Clean format', 'Batch friendly'],
    checks: ['Accurate result', 'Easy to scan', 'Copy ready', 'Includes edge cases'],
    helper: 'The output should behave like a utility: fast, precise, and uncluttered.',
  },
}

const toolProfiles: Record<string, Partial<ToolWorkspaceProfile>> = {
  'homework-explainer': {
    inputTitle: 'Paste the homework question',
    outputTitle: 'Worked explanation',
    placeholder: 'Paste the full homework question, your grade, subject, what you tried, and where you got stuck...',
    modes: ['Hint first', 'Full solution', 'Teach the method', 'Check my work'],
    checks: ['Shows steps', 'Explains why', 'Grade appropriate', 'Practice follow-up'],
  },
  'math-solver': {
    inputTitle: 'Enter the math problem',
    outputTitle: 'Solution steps',
    placeholder: 'Type the equation, word problem, or expression. Include any required method, grade level, or calculator restrictions...',
    modes: ['Solve', 'Show working', 'Graph insight', 'Similar examples'],
    checks: ['Correct notation', 'Step-by-step', 'Final answer clear', 'Checks the result'],
  },
  'citation-generator': {
    inputTitle: 'Add source details',
    outputTitle: 'Formatted citation',
    placeholder: 'Add author, title, year, publisher, URL, DOI, access date, and the citation style you need...',
    modes: ['APA', 'MLA', 'Chicago', 'Harvard'],
    checks: ['Style accurate', 'All fields used', 'In-text citation', 'Bibliography ready'],
  },
  'quiz-generator': {
    inputTitle: 'Paste study content',
    outputTitle: 'Quiz set',
    placeholder: 'Paste notes, a topic, or a chapter summary. Mention grade level, question count, and difficulty...',
    modes: ['Multiple choice', 'Mixed quiz', 'Exam style', 'Answer key'],
    checks: ['Balanced difficulty', 'Covers key facts', 'Includes answers', 'No trick wording'],
  },
  'study-planner': {
    inputTitle: 'Add your study load',
    outputTitle: 'Study schedule',
    placeholder: 'Add subjects, deadlines, exam dates, weak topics, available hours, and rest days...',
    modes: ['Weekly plan', 'Exam countdown', 'Catch-up plan', 'Balanced routine'],
    checks: ['Realistic timing', 'Priority order', 'Breaks included', 'Review slots'],
  },
  'tiktok-hook': {
    inputTitle: 'Describe the video idea',
    outputTitle: 'TikTok hooks',
    placeholder: 'Add the topic, audience, promise, emotion, niche, and any hook style you like...',
    modes: ['Curiosity hooks', 'Problem hooks', 'Story hooks', 'Contrarian hooks'],
    checks: ['First 2 seconds strong', 'Specific audience', 'Native TikTok tone', 'Multiple options'],
  },
  'hashtag-generator': {
    inputTitle: 'Describe the post',
    outputTitle: 'Hashtag groups',
    placeholder: 'Add the platform, topic, niche, location, audience, and whether you want broad or targeted reach...',
    modes: ['Instagram', 'TikTok', 'LinkedIn', 'Niche clusters'],
    checks: ['Relevant tags', 'Mixed reach sizes', 'No spam', 'Grouped by use'],
  },
  'youtube-title': {
    inputTitle: 'Describe the video',
    outputTitle: 'Title options',
    placeholder: 'Add your video topic, audience, angle, promise, length, and any keywords you want included...',
    modes: ['High CTR', 'Search focused', 'Curiosity', 'Educational'],
    checks: ['Clear promise', 'Keyword fit', 'No clickbait gap', 'Variant options'],
  },
  'cover-letter': {
    inputTitle: 'Add job and candidate details',
    outputTitle: 'Cover letter draft',
    placeholder: 'Paste the job description, company name, role, your experience, achievements, and preferred tone...',
    modes: ['Professional', 'Warm', 'Concise', 'Achievement led'],
    checks: ['Role specific', 'Uses evidence', 'Strong opening', 'Clear close'],
  },
  'startup-idea': {
    inputTitle: 'Set the startup constraints',
    outputTitle: 'Startup concepts',
    placeholder: 'Add your skills, industry, target customers, budget, geography, and problems you care about...',
    modes: ['Bootstrapped', 'SaaS', 'Local business', 'AI enabled'],
    checks: ['Customer pain', 'Revenue model', 'Differentiation', 'First MVP'],
  },
  'swot-generator': {
    inputTitle: 'Add company or idea context',
    outputTitle: 'SWOT analysis',
    placeholder: 'Describe the business, market, competitors, current challenge, and decision you need to make...',
    modes: ['Classic SWOT', 'Competitor lens', 'Launch planning', 'Risk review'],
    checks: ['Specific factors', 'Balanced view', 'Actionable insights', 'Next moves'],
  },
  'pitch-deck': {
    inputTitle: 'Add venture details',
    outputTitle: 'Pitch deck outline',
    placeholder: 'Add product, customer, market size, traction, business model, team, ask, and deck length...',
    modes: ['Investor deck', 'Demo day', 'Sales deck', 'Narrative polish'],
    checks: ['Slide flow', 'Investor clarity', 'Proof points', 'Strong ask'],
  },
  'qr-generator': {
    inputTitle: 'Enter QR destination',
    outputTitle: 'QR setup',
    placeholder: 'Paste the URL, text, email, phone number, Wi-Fi details, or contact data you want encoded...',
    modes: ['URL', 'Contact', 'Wi-Fi', 'Plain text'],
    checks: ['Valid payload', 'Short label', 'Scan context', 'Error-safe'],
  },
  'word-counter': {
    inputTitle: 'Paste text to count',
    outputTitle: 'Writing stats',
    placeholder: 'Paste the text you want measured for words, characters, reading time, density, or length limits...',
    modes: ['Word count', 'Reading time', 'SEO length', 'Social limits'],
    checks: ['Word total', 'Character total', 'Reading estimate', 'Limit notes'],
  },
  'text-compare': {
    inputTitle: 'Paste both versions',
    outputTitle: 'Difference summary',
    placeholder: 'Paste version A and version B, separated clearly, and mention whether you care about wording, meaning, or formatting...',
    modes: ['Meaning changes', 'Line diff', 'Copy edit', 'Risk review'],
    checks: ['Changed sections', 'Added content', 'Removed content', 'Impact summary'],
  },
  'uuid-generator': {
    inputTitle: 'Set ID requirements',
    outputTitle: 'Generated IDs',
    placeholder: 'Add how many IDs you need, preferred version or prefix, and where they will be used...',
    modes: ['UUID v4', 'Batch IDs', 'Readable IDs', 'Database keys'],
    checks: ['Unique values', 'Clean format', 'Batch ready', 'Usage note'],
  },
}

function getProfile(tool: Tool): ToolWorkspaceProfile {
  const base = categoryProfiles[tool.category] || {
    label: 'Smart workspace',
    inputTitle: 'Tell the tool what to make',
    outputTitle: 'Studio output',
    placeholder: `Describe what you want from ${tool.name}. Include audience, format, tone, constraints, or examples...`,
    modes: workspaceModes,
    checks: qualityChecks,
    helper: 'Return a polished, practical result with useful structure and no filler.',
  }
  const override = toolProfiles[tool.id] || {}

  return {
    ...base,
    ...override,
    modes: override.modes || base.modes,
    checks: override.checks || base.checks,
    placeholder: override.placeholder || base.placeholder.replace('${tool.name}', tool.name),
  }
}

export function GenericToolLayout({ tool }: GenericToolLayoutProps) {
  const profile = useMemo(() => getProfile(tool), [tool])
  const [brief, setBrief] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState(profile.modes[0])
  const [grade, setGrade] = useState('Grade 10')
  const [subject, setSubject] = useState('Mathematics')
  const [language, setLanguage] = useState('English')
  const [learningMode, setLearningMode] = useState('Homework help')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const isStudentTool = tool.category === 'student'

  const briefPrompt = useMemo(() => {
    return `Tool: ${tool.name}
Tool purpose: ${tool.description}
Mode: ${mode}
Workspace: ${profile.label}
${isStudentTool ? `South African CAPS context: ${grade} | ${subject} | ${language} | ${learningMode}` : ''}
Quality checks: ${profile.checks.join(', ')}

User brief:
${brief}

${profile.helper}`
  }, [brief, grade, isStudentTool, language, learningMode, mode, profile, subject, tool.description, tool.name])

  const processInput = async () => {
    if (!brief.trim()) return

    setLoading(true)
    setError('')
    setOutput('')

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: tool.id,
          text: briefPrompt,
          toolTitle: tool.name,
          toolDescription: tool.description,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to process request')

      const content = data.result || data.choices?.[0]?.message?.content
      if (content) {
        setOutput(content)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label={profile.label}
        eyebrow={tool.category}
        statusTitle={isStudentTool ? `${subject} / ${grade}` : mode}
        statusText={isStudentTool ? `CAPS-aware support in ${language}, tuned for ${learningMode.toLowerCase()}.` : profile.helper}
      />

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_380px]">
          <aside className="h-fit rounded-md border border-border bg-white p-6 xl:sticky xl:top-28">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">{profile.label}</p>
            {isStudentTool && (
              <div className="mt-5 rounded-md border border-border bg-background p-4">
                <p className="mb-3 text-sm font-semibold text-foreground">South African study context</p>
                <div className="grid gap-3">
                  <label className="grid gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                    Grade
                    <select value={grade} onChange={(event) => setGrade(event.target.value)} className="rounded-sm border border-border bg-white px-3 py-2 text-sm font-normal normal-case text-foreground">
                      {educationLevels.map((level) => (
                        <option key={level}>{level}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                    CAPS subject
                    <select value={subject} onChange={(event) => setSubject(event.target.value)} className="rounded-sm border border-border bg-white px-3 py-2 text-sm font-normal normal-case text-foreground">
                      {southAfricanSubjects.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                    Language
                    <select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-sm border border-border bg-white px-3 py-2 text-sm font-normal normal-case text-foreground">
                      {southAfricanLanguages.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-xs font-semibold uppercase text-muted-foreground">
                    Learning mode
                    <select value={learningMode} onChange={(event) => setLearningMode(event.target.value)} className="rounded-sm border border-border bg-white px-3 py-2 text-sm font-normal normal-case text-foreground">
                      {learningModes.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            )}
            <div className="mt-5 grid gap-2">
              {profile.modes.map((item) => (
                <button
                  key={item}
                  onClick={() => setMode(item)}
                  className={`group flex items-center justify-between rounded-sm border px-4 py-3 text-left text-sm transition ${
                    mode === item ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                  }`}
                >
                  {item}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-md border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">Operating checks</p>
              <div className="mt-3 space-y-2">
                {profile.checks.map((check) => (
                  <div key={check} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-foreground" />
                    {check}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <section className="rounded-md border border-border bg-white p-6 avoora-soft-shadow">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Command canvas</p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">{profile.inputTitle}</h2>
                </div>
                <Sparkles className="h-5 w-5 text-muted-foreground" />
              </div>
              <Textarea
                value={brief}
                onChange={(event) => setBrief(event.target.value)}
                placeholder={profile.placeholder}
                className="mt-5 min-h-[260px] resize-none rounded-sm border border-border bg-background p-5 text-sm leading-6"
              />
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">{brief.length} characters</span>
                <Button onClick={processInput} disabled={!brief.trim() || loading} className="rounded-sm bg-primary text-primary-foreground gap-2 px-6">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  Run workspace
                </Button>
              </div>
              {error && <div className="mt-4 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            </section>
          </main>

          <aside className="h-fit rounded-md border border-border bg-white p-6 xl:sticky xl:top-28">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">{profile.outputTitle}</p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">{mode}</h2>
              </div>
              {output && (
                <Button onClick={copyToClipboard} variant="outline" className="rounded-sm bg-white gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </div>

            <div className="mt-5 min-h-[360px] rounded-sm border border-border bg-background p-5 text-sm leading-7 whitespace-pre-wrap">
              {output || `The ${profile.outputTitle.toLowerCase()} workspace will render here with structure, detail, and ready-to-use actions.`}
            </div>

            {output && (
              <Button onClick={processInput} disabled={loading} variant="outline" className="mt-4 w-full rounded-sm bg-white gap-2">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            )}
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
