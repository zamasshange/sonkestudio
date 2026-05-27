"use client"

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BadgeCheck, Brain, Calculator, Clock3, ListChecks, Play, Sparkles, Target } from 'lucide-react'
import { educationLevels, southAfricanLanguages, southAfricanSubjects } from '@/lib/context-options'

type QuizQuestion = {
  question: string
  options: string[]
  answerIndex: number
  explanation?: string
}

function safeParseQuiz(raw: string): QuizQuestion[] {
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
    if (Array.isArray(parsed.questions)) return parsed.questions
  } catch {
    // fallback below
  }

  const lines = raw.split('\n').filter(Boolean)
  const result: QuizQuestion[] = []
  for (const line of lines.slice(0, 6)) {
    result.push({
      question: line.replace(/^[-*\d.\s]+/, ''),
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answerIndex: 0,
    })
  }
  return result
}

export function QuizArenaLayout({ tool }: { tool: Tool }) {
  const [grade, setGrade] = useState('Grade 10')
  const [subject, setSubject] = useState('Mathematics')
  const [language, setLanguage] = useState('English')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [count, setCount] = useState(8)
  const [minutes, setMinutes] = useState(10)
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  useEffect(() => {
    if (!started || timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [started, timeLeft])

  const current = questions[index]

  const score = useMemo(() => {
    let value = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.answerIndex) value += 1
    })
    return value
  }, [answers, questions])

  const finished = started && (index >= questions.length || timeLeft <= 0)

  const generateQuiz = async () => {
    if (!topic.trim()) return
    setLoading(true)
    try {
      const prompt = `Create a CAPS-aligned quiz in ${language}.
Grade: ${grade}
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Questions: ${count}

Return strict JSON array with fields:
question, options (4), answerIndex (0-3), explanation`
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: tool.id, text: prompt }),
      })
      const data = await res.json()
      const content = data.result || data.choices?.[0]?.message?.content || '[]'
      const generated = safeParseQuiz(content)
      setQuestions(generated)
      setAnswers(Array(generated.length).fill(-1))
      setIndex(0)
      setTimeLeft(minutes * 60)
      setStarted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Quiz Arena" eyebrow="STUDENT" statusTitle={`${subject} / ${difficulty}`} statusText="Timed quiz sessions with scoring, difficulty control, and answer review for focused study loops." />
      <div className="mx-auto max-w-[1700px] px-5 pb-10 sm:px-8">
        <div className="grid gap-5 xl:grid-cols-[330px_minmax(0,1fr)_320px]">
          <aside className="rounded-2xl border border-border bg-white p-4">
            <p className="mb-3 text-sm font-semibold">Quiz Setup</p>
            <div className="grid gap-2 text-sm">
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{educationLevels.map((v) => <option key={v}>{v}</option>)}</select>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{southAfricanSubjects.map((v) => <option key={v}>{v}</option>)}</select>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{southAfricanLanguages.map((v) => <option key={v}>{v}</option>)}</select>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2"><option>Easy</option><option>Medium</option><option>Hard</option></select>
              <Input type="number" value={count} onChange={(e) => setCount(Number(e.target.value) || 8)} />
              <Input type="number" value={minutes} onChange={(e) => setMinutes(Number(e.target.value) || 10)} />
              <Textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic/chapter" className="min-h-[90px]" />
              <Button onClick={generateQuiz} disabled={loading || !topic.trim()}>{loading ? 'Generating...' : 'Start Quiz Session'}</Button>
            </div>
          </aside>

          <main className="rounded-2xl border border-border bg-white p-5">
            {!started && <p className="text-sm text-muted-foreground">Configure your quiz session and start.</p>}
            {started && !finished && current && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Question {index + 1} of {questions.length}</p>
                <h2 className="mt-2 text-xl font-semibold">{current.question}</h2>
                <div className="mt-4 grid gap-2">
                  {current.options.map((option, i) => (
                    <button key={option + i} onClick={() => setAnswers((a) => { const next = [...a]; next[index] = i; return next })} className={`rounded-lg border p-3 text-left ${answers[index] === i ? 'border-foreground bg-foreground text-background' : 'border-border bg-background'}`}>
                      {option}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>Back</Button>
                  <Button onClick={() => setIndex((i) => i + 1)}>{index === questions.length - 1 ? 'Finish' : 'Next'}</Button>
                </div>
              </div>
            )}
            {finished && (
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">Session Complete</h2>
                <p className="text-sm text-muted-foreground">Score: {score}/{questions.length}</p>
                <div className="grid gap-2">
                  {questions.map((q, i) => (
                    <div key={q.question + i} className="rounded-lg border border-border bg-background p-3 text-sm">
                      <p className="font-medium">{q.question}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Your answer: {answers[i] >= 0 ? q.options[answers[i]] : 'Not answered'} | Correct: {q.options[q.answerIndex]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          <aside className="rounded-2xl border border-border bg-white p-4">
            <p className="mb-3 text-sm font-semibold">Session HUD</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> {Math.max(0, Math.floor(timeLeft / 60))}:{String(Math.max(0, timeLeft % 60)).padStart(2, '0')}</p>
              <p className="flex items-center gap-2"><Target className="h-4 w-4" /> Score {score}/{questions.length || 0}</p>
              <p className="flex items-center gap-2"><Brain className="h-4 w-4" /> Difficulty {difficulty}</p>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

export function MathSolverStudioLayout({ tool }: { tool: Tool }) {
  const [grade, setGrade] = useState('Grade 10')
  const [language, setLanguage] = useState('English')
  const [problem, setProblem] = useState('')
  const [steps, setSteps] = useState('')
  const [hint, setHint] = useState('')
  const [loading, setLoading] = useState(false)

  const run = async (mode: 'solve' | 'hint' | 'practice') => {
    if (!problem.trim()) return
    setLoading(true)
    try {
      const prompt = `You are a CAPS math tutor.
Grade: ${grade}
Language: ${language}
Mode: ${mode}
Problem: ${problem}

If mode=solve return step-by-step solution with final answer.
If mode=hint return 2 hints only.
If mode=practice return 2 similar practice questions with answers.`
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: tool.id, text: prompt }),
      })
      const data = await res.json()
      const content = data.result || data.choices?.[0]?.message?.content || ''
      if (mode === 'hint') setHint(content)
      else setSteps(content)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Math Solver Studio" eyebrow="MATH" statusTitle={grade} statusText="Step-by-step solving workflow with hint lane and practice generation, built for learning not one-shot answers." />
      <div className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-white p-4">
            <p className="mb-3 text-sm font-semibold">Context</p>
            <div className="grid gap-2">
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{educationLevels.map((v) => <option key={v}>{v}</option>)}</select>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{southAfricanLanguages.map((v) => <option key={v}>{v}</option>)}</select>
            </div>
            <div className="mt-4 grid gap-2">
              <Button onClick={() => run('solve')} disabled={loading || !problem.trim()}><Calculator className="mr-2 h-4 w-4" />Solve Step-by-Step</Button>
              <Button variant="outline" onClick={() => run('hint')} disabled={loading || !problem.trim()}><Sparkles className="mr-2 h-4 w-4" />Give Hint</Button>
              <Button variant="outline" onClick={() => run('practice')} disabled={loading || !problem.trim()}><Play className="mr-2 h-4 w-4" />Practice Variants</Button>
            </div>
          </aside>
          <main className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-2 text-sm font-semibold">Problem Input</p>
              <Textarea value={problem} onChange={(e) => setProblem(e.target.value)} className="min-h-[120px]" placeholder="Paste equation, word problem, or algebra/calculus question..." />
            </section>
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-2 text-sm font-semibold">Hint Panel</p>
              <div className="min-h-[80px] whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm">{hint || 'Hints will appear here when requested.'}</div>
            </section>
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-2 text-sm font-semibold">Solution Workspace</p>
              <div className="min-h-[260px] whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm">{steps || 'Step-by-step solution and practice output will appear here.'}</div>
            </section>
          </main>
        </div>
      </div>
    </motion.div>
  )
}

export function NotesSummaryStudyLayout({ tool }: { tool: Tool }) {
  const [notes, setNotes] = useState('')
  const [grade, setGrade] = useState('Grade 11')
  const [subject, setSubject] = useState('Physical Sciences')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('Key points')

  const run = async (nextMode: string) => {
    if (!notes.trim()) return
    setMode(nextMode)
    const prompt = `Convert notes into study material.
Grade: ${grade}
Subject: ${subject}
Mode: ${nextMode}

Notes:
${notes}

If mode is key points -> concise summary.
If flashcards -> Q/A flashcards.
If exam prep -> likely exam questions.
If explain hard parts -> simple explanations.`
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: tool.id, text: prompt }),
    })
    const data = await res.json()
    setOutput(data.result || data.choices?.[0]?.message?.content || '')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Study Notes Lab" eyebrow="NOTES" statusTitle={mode} statusText="Transform messy notes into key points, flashcards, and exam prep outputs with study-oriented modes." />
      <div className="mx-auto max-w-[1650px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <aside className="rounded-2xl border border-border bg-white p-4">
            <p className="mb-2 text-sm font-semibold">Study Context</p>
            <div className="grid gap-2">
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{educationLevels.map((v) => <option key={v}>{v}</option>)}</select>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{southAfricanSubjects.map((v) => <option key={v}>{v}</option>)}</select>
            </div>
            <div className="mt-4 grid gap-2">
              {['Key points', 'Flashcards', 'Exam prep', 'Explain hard parts'].map((item) => <Button key={item} variant={mode === item ? 'default' : 'outline'} onClick={() => run(item)}>{item}</Button>)}
            </div>
          </aside>
          <main className="rounded-2xl border border-border bg-white p-4">
            <p className="mb-2 text-sm font-semibold">Notes Input</p>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[260px]" placeholder="Paste lecture notes, textbook excerpts, or rough points..." />
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="mb-2 text-sm font-semibold">Output: {mode}</p>
              <div className="min-h-[240px] whitespace-pre-wrap text-sm">{output || 'Choose a mode to generate study-ready material.'}</div>
            </div>
          </main>
          <aside className="rounded-2xl border border-border bg-white p-4">
            <p className="mb-2 text-sm font-semibold">Study Signals</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><ListChecks className="h-4 w-4" /> Coverage-ready summary</p>
              <p className="flex items-center gap-2"><BadgeCheck className="h-4 w-4" /> Exam-focused extraction</p>
              <p className="flex items-center gap-2"><Brain className="h-4 w-4" /> Memory-ready output</p>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

export function StudyPlannerCalendarLayout({ tool }: { tool: Tool }) {
  const [goal, setGoal] = useState('')
  const [weekPlan, setWeekPlan] = useState('')
  const [examDate, setExamDate] = useState('')
  const [hoursPerDay, setHoursPerDay] = useState(2)

  const generate = async () => {
    if (!goal.trim()) return
    const prompt = `Build a student study schedule.
Goal: ${goal}
Exam date: ${examDate || 'not set'}
Study hours/day: ${hoursPerDay}

Return a Monday-Sunday plan with topics, review blocks, and break recommendations.`
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: tool.id, text: prompt }),
    })
    const data = await res.json()
    setWeekPlan(data.result || data.choices?.[0]?.message?.content || '')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Study Planner" eyebrow="PLAN" statusTitle="Weekly Sprint" statusText="Calendar-first planning workflow for revision scheduling, exam countdown, and progress-focused study pacing." />
      <div className="mx-auto max-w-[1550px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-white p-4">
            <p className="mb-2 text-sm font-semibold">Planning Inputs</p>
            <div className="grid gap-2">
              <Textarea value={goal} onChange={(e) => setGoal(e.target.value)} className="min-h-[130px]" placeholder="Subjects, weak areas, deadlines, goals..." />
              <Input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
              <Input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value) || 2)} />
              <Button onClick={generate}>Generate Weekly Plan</Button>
            </div>
          </aside>
          <main className="rounded-2xl border border-border bg-white p-4">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="rounded-lg border border-border bg-background p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{day}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Session blocks auto-generated from your plan.</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="mb-2 text-sm font-semibold">AI Weekly Plan</p>
              <div className="min-h-[280px] whitespace-pre-wrap text-sm">{weekPlan || 'Generate a plan to populate your study week.'}</div>
            </div>
          </main>
        </div>
      </div>
    </motion.div>
  )
}

export function HomeworkCoachLayout({ tool }: { tool: Tool }) {
  const [grade, setGrade] = useState('Grade 9')
  const [subject, setSubject] = useState('Mathematics')
  const [language, setLanguage] = useState('English')
  const [question, setQuestion] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('Hint first')

  const run = async (nextMode: string) => {
    if (!question.trim()) return
    setMode(nextMode)
    const prompt = `You are a CAPS homework coach.
Grade: ${grade}
Subject: ${subject}
Language: ${language}
Mode: ${nextMode}
Question:
${question}

If mode=Hint first, provide hints only.
If mode=Step-by-step, show full working.
If mode=Check my attempt, ask for and compare learner answer structure.
If mode=Teach concept, explain underlying concept with example.`
    const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: tool.id, text: prompt }) })
    const data = await res.json()
    setOutput(data.result || data.choices?.[0]?.message?.content || '')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Homework Coach" eyebrow="COACH" statusTitle={`${subject} / ${mode}`} statusText="Guided homework assistance focused on teaching flow: hinting, working, checking, and concept reinforcement." />
      <div className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-white p-4">
            <p className="mb-2 text-sm font-semibold">Learning Context</p>
            <div className="grid gap-2">
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{educationLevels.map((v) => <option key={v}>{v}</option>)}</select>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{southAfricanSubjects.map((v) => <option key={v}>{v}</option>)}</select>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{southAfricanLanguages.map((v) => <option key={v}>{v}</option>)}</select>
            </div>
            <div className="mt-4 grid gap-2">
              {['Hint first', 'Step-by-step', 'Teach concept', 'Check my attempt'].map((item) => <Button key={item} variant={mode === item ? 'default' : 'outline'} onClick={() => run(item)}>{item}</Button>)}
            </div>
          </aside>
          <main className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-2 text-sm font-semibold">Homework Question</p>
              <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="min-h-[130px]" placeholder="Paste question, your attempt, and where you got stuck..." />
            </section>
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-2 text-sm font-semibold">Coach Output</p>
              <div className="min-h-[280px] whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm">{output || 'Select a coaching mode to begin.'}</div>
            </section>
          </main>
        </div>
      </div>
    </motion.div>
  )
}

export function CitationWorkbenchLayout({ tool }: { tool: Tool }) {
  const [style, setStyle] = useState('APA 7')
  const [source, setSource] = useState('')
  const [citation, setCitation] = useState('')
  const [inText, setInText] = useState('')

  const generate = async () => {
    if (!source.trim()) return
    const prompt = `Generate citations.
Style: ${style}
Source details:
${source}

Return:
1) Full bibliography citation
2) In-text citation
3) Missing fields checklist`
    const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: tool.id, text: prompt }) })
    const data = await res.json()
    const content = data.result || data.choices?.[0]?.message?.content || ''
    const parts = content.split('\n2)')
    setCitation(parts[0]?.replace(/^1\)\s*/, '').trim() || content)
    const tail = parts[1] || ''
    setInText(tail.replace(/^In-text citation[:\s-]*/i, '').trim())
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Citation Workbench" eyebrow="CITE" statusTitle={style} statusText="Reference-focused workflow with citation style controls, bibliography output, and in-text generation." />
      <div className="mx-auto max-w-[1500px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-white p-4">
            <p className="mb-2 text-sm font-semibold">Style + Source Type</p>
            <select value={style} onChange={(e) => setStyle(e.target.value)} className="h-9 w-full rounded-sm border border-border bg-background px-2">
              {['APA 7', 'MLA 9', 'Harvard', 'Chicago', 'IEEE'].map((v) => <option key={v}>{v}</option>)}
            </select>
            <Button className="mt-3 w-full" onClick={generate}>Generate Citation</Button>
          </aside>
          <main className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-2 text-sm font-semibold">Source Details</p>
              <Textarea value={source} onChange={(e) => setSource(e.target.value)} className="min-h-[140px]" placeholder="Author, title, year, publisher, URL, DOI, accessed date..." />
            </section>
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-2 text-sm font-semibold">Bibliography Citation</p>
              <div className="min-h-[90px] whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm">{citation || 'Citation appears here.'}</div>
            </section>
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-2 text-sm font-semibold">In-text Citation</p>
              <div className="min-h-[90px] whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm">{inText || 'In-text citation appears here.'}</div>
            </section>
          </main>
        </div>
      </div>
    </motion.div>
  )
}

export function ExamPrepSprintLayout({ tool }: { tool: Tool }) {
  const [subject, setSubject] = useState('Life Sciences')
  const [grade, setGrade] = useState('Grade 12')
  const [topic, setTopic] = useState('')
  const [plan, setPlan] = useState('')
  const [sprintDays, setSprintDays] = useState(7)

  const build = async () => {
    if (!topic.trim()) return
    const prompt = `Create an exam prep sprint.
Grade: ${grade}
Subject: ${subject}
Topic: ${topic}
Duration days: ${sprintDays}

Return:
- day-by-day revision plan
- high-yield topic ranking
- practice question checklist
- last-day cram strategy`
    const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: tool.id, text: prompt }) })
    const data = await res.json()
    setPlan(data.result || data.choices?.[0]?.message?.content || '')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Exam Prep Sprint" eyebrow="EXAM" statusTitle={`${sprintDays}-Day Plan`} statusText="Countdown-style prep workflow with day-by-day revision, high-yield prioritization, and practice checklists." />
      <div className="mx-auto max-w-[1500px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-white p-4">
            <div className="grid gap-2">
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{educationLevels.map((v) => <option key={v}>{v}</option>)}</select>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2">{southAfricanSubjects.map((v) => <option key={v}>{v}</option>)}</select>
              <Input type="number" value={sprintDays} onChange={(e) => setSprintDays(Number(e.target.value) || 7)} />
              <Textarea value={topic} onChange={(e) => setTopic(e.target.value)} className="min-h-[120px]" placeholder="Syllabus topics + weak areas..." />
              <Button onClick={build}>Build Sprint Plan</Button>
            </div>
          </aside>
          <main className="rounded-2xl border border-border bg-white p-4">
            <div className="min-h-[420px] whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm">{plan || 'Generate your exam sprint plan to begin.'}</div>
          </main>
        </div>
      </div>
    </motion.div>
  )
}

export function ResearchSimplifierLayout({ tool }: { tool: Tool }) {
  const [paperText, setPaperText] = useState('')
  const [simplified, setSimplified] = useState('')
  const [mode, setMode] = useState('Plain language')

  const run = async (nextMode: string) => {
    if (!paperText.trim()) return
    setMode(nextMode)
    const prompt = `Simplify research content.
Mode: ${nextMode}
Text:
${paperText}

If plain language: simplify.
If key findings: extract findings.
If study guide: convert into testable notes.
If critique: provide limitations and questions.`
    const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: tool.id, text: prompt }) })
    const data = await res.json()
    setSimplified(data.result || data.choices?.[0]?.message?.content || '')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Research Simplifier" eyebrow="RESEARCH" statusTitle={mode} statusText="Academic comprehension workflow for simplifying papers, extracting findings, and building study-ready takeaways." />
      <div className="mx-auto max-w-[1650px] px-5 pb-10 sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-white p-4">
            <p className="mb-2 text-sm font-semibold">Simplification Modes</p>
            <div className="grid gap-2">
              {['Plain language', 'Key findings', 'Study guide', 'Critique mode'].map((item) => <Button key={item} variant={mode === item ? 'default' : 'outline'} onClick={() => run(item)}>{item}</Button>)}
            </div>
          </aside>
          <main className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-4">
              <Textarea value={paperText} onChange={(e) => setPaperText(e.target.value)} className="min-h-[190px]" placeholder="Paste abstract, section, or full research text..." />
            </section>
            <section className="rounded-2xl border border-border bg-white p-4">
              <div className="min-h-[260px] whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm">{simplified || 'Run a mode to simplify and analyze.'}</div>
            </section>
          </main>
        </div>
      </div>
    </motion.div>
  )
}
