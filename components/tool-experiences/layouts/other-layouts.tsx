"use client"

import { useState } from 'react'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Send, Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import {
  SiCplusplus,
  SiDocker,
  SiGithub,
  SiGo,
  SiJavascript,
  SiKotlin,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRust,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa6'
import { TbSql } from 'react-icons/tb'
import {
  developerFrameworks,
  developerLanguages,
  developerWorkflows,
  educationLevels,
  learningModes,
  southAfricanLanguages,
  southAfricanSubjects,
} from '@/lib/context-options'

const difficulties = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting out' },
  { id: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { id: 'advanced', label: 'Advanced', description: 'Expert level' },
]

const developerEcosystem = [
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#111111' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
  { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'GitHub', icon: SiGithub, color: '#111111' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'Rust', icon: SiRust, color: '#111111' },
  { name: 'Go', icon: SiGo, color: '#00ADD8' },
  { name: 'Java', icon: FaJava, color: '#f89820' },
  { name: 'PHP', icon: SiPhp, color: '#777BB4' },
  { name: 'Swift', icon: SiSwift, color: '#F05138' },
  { name: 'Kotlin', icon: SiKotlin, color: '#A97BFF' },
  { name: 'C++', icon: SiCplusplus, color: '#00599C' },
  { name: 'SQL', icon: TbSql, color: '#22d3ee' },
]

export function TutorChatLayout({ tool }: { tool: Tool }) {
  const [grade, setGrade] = useState('Grade 10')
  const [subject, setSubject] = useState('Mathematics')
  const [language, setLanguage] = useState('English')
  const [mode, setMode] = useState('Homework help')
  const [difficulty, setDifficulty] = useState('beginner')
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'tutor', text: 'Hi! I am your SONKE AI tutor. Choose your grade, CAPS subject, and language, then ask me anything.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const context = `${grade} ${subject} | ${language} | ${mode} | ${difficulty}`
    setMessages([...messages, { role: 'user', text: input }])
    setInput('')
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'tutor', text: `Great question. I will answer as a ${context} tutor with CAPS-aligned examples, simple steps, and checks for understanding.` }
      ])
      setLoading(false)
    }, 1000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero
        tool={tool}
        label="Student workspace"
        eyebrow="ST"
        statusTitle={`${subject} / ${grade}`}
        statusText="Set grade, subject, language, and learning mode before starting a focused tutoring chat."
      />

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Sidebar Controls */}
          <div className="space-y-6">
            {/* Learning Context */}
            <div className="rounded-none border border-border bg-white p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Learning context</h3>
              <select value={grade} onChange={(event) => setGrade(event.target.value)} className="w-full rounded-none border border-border bg-white px-3 py-2 text-sm mb-3">
                {educationLevels.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
              <select value={subject} onChange={(event) => setSubject(event.target.value)} className="w-full rounded-none border border-border bg-white px-3 py-2 text-sm mb-3">
                {southAfricanSubjects.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="w-full rounded-none border border-border bg-white px-3 py-2 text-sm mb-3">
                {southAfricanLanguages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select value={mode} onChange={(event) => setMode(event.target.value)} className="w-full rounded-none border border-border bg-white px-3 py-2 text-sm">
                {learningModes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Selector */}
            <div className="rounded-none border border-border bg-white p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Difficulty</h3>
              <div className="space-y-2">
                {difficulties.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`w-full text-left rounded-none border px-3 py-2 text-sm transition ${
                      difficulty === d.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="font-medium">{d.label}</div>
                    <div className="text-xs text-muted-foreground">{d.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Tips */}
            <div className="rounded-none border border-border bg-blue-50 border-blue-200 p-6">
              <div className="flex gap-2 items-start">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                <div className="font-semibold mb-2">Pro Tip</div>
                  <p>{grade} answers use {subject} examples in {language} and adapt to {mode.toLowerCase()}.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 rounded-none border border-border bg-white flex flex-col h-[600px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border border-border'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                </motion.div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-border p-6">
              <div className="flex gap-3">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask your question..."
                  className="resize-none min-h-12 bg-muted border-none"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="rounded-none h-12 w-12 p-0 bg-primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function DocumentAnalyzerLayout({ tool }: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<{ clause: string; risk: string }[]>([])
  const [selectedClause, setSelectedClause] = useState<number | null>(null)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero
        tool={tool}
        label="Document workspace"
        eyebrow="DOC"
        statusTitle="Analyze clauses"
        statusText="Upload or inspect document sections with risk notes, questions, and focused review panels."
      />

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Document Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 rounded-none border border-border bg-white p-8"
          >
            {!file ? (
              <div
                className="border-2 border-dashed border-border rounded-sm p-12 text-center cursor-pointer hover:border-primary/40 transition"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('border-primary')
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-primary')
                }}
              >
                <p className="text-lg font-semibold text-foreground mb-2">Drop your document here</p>
                <p className="text-sm text-muted-foreground">Supports PDF, DOCX, and TXT files</p>
              </div>
            ) : (
              <div className="space-y-4 text-sm leading-relaxed">
                <div className="mb-4 p-3 rounded-sm bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                  <strong>Key Terms Found:</strong> Liability, Indemnification, Termination, Payment Terms
                </div>
                <p>
                  <span className="bg-yellow-200">Liability Clause:</span> The service provider shall not be liable for any indirect or consequential damages.
                </p>
                <p>
                  <span className="bg-red-200">Termination Rights:</span> Either party may terminate this agreement with 30 days written notice.
                </p>
                <p>
                  <span className="bg-orange-200">Payment Terms:</span> Payment is due within 30 days of invoice date.
                </p>
              </div>
            )}
          </motion.div>

          {/* Analysis Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Risk Summary */}
            <div className="rounded-none border border-border bg-white p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Risk Summary</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2 pb-3 border-b border-border">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-red-900">High Risk</div>
                    <div className="text-xs text-muted-foreground">2 critical clauses</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 pb-3 border-b border-border">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-orange-900">Medium Risk</div>
                    <div className="text-xs text-muted-foreground">4 items to review</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-green-900">Low Risk</div>
                    <div className="text-xs text-muted-foreground">Standard terms</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Questions */}
            <div className="rounded-none border border-border bg-white p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Important Questions</h3>
              <div className="space-y-2 text-xs">
                <button className="w-full text-left p-2 rounded-sm hover:bg-muted transition border border-border">
                  What should I worry about?
                </button>
                <button className="w-full text-left p-2 rounded-sm hover:bg-muted transition border border-border">
                  When can this be terminated?
                </button>
                <button className="w-full text-left p-2 rounded-sm hover:bg-muted transition border border-border">
                  What are my obligations?
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export function DeveloperCodeLayout({ tool }: { tool: Tool }) {
  const [code, setCode] = useState('function hello() {\n  console.log("Hello, World!");\n}')
  const [language, setLanguage] = useState('JavaScript')
  const [framework, setFramework] = useState('None')
  const [workflow, setWorkflow] = useState('Format code')
  const [level, setLevel] = useState('Intermediate')
  const [targetLanguage, setTargetLanguage] = useState('TypeScript')
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-screen flex-col bg-background">
      <ToolWorkspaceHero
        tool={tool}
        label="Developer workspace"
        eyebrow="DEV"
        statusTitle={`${workflow} / ${language}`}
        statusText="Choose language, framework, workflow, and target output before working in the code panel."
      />

      <div className="flex flex-1">
        <div className="mx-auto w-full max-w-[1720px] px-5 py-8 sm:px-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Developer Context */}
            <div className="h-fit rounded-md border border-border bg-white p-6">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Developer ecosystem</h3>
              <div className="mb-5 grid grid-cols-3 gap-2">
                {developerEcosystem.map((item) => {
                  const EcosystemIcon = item.icon
                  const active = language === item.name || framework === item.name || targetLanguage === item.name
                  const iconColor = active && item.color === '#111111' ? '#ffffff' : item.color
                  return (
                    <button
                      key={item.name}
                      onClick={() => setLanguage(item.name)}
                      className={`flex h-16 flex-col items-center justify-center gap-1 rounded-sm border text-[10px] transition hover:-translate-y-1 ${
                        active ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:border-foreground/30'
                      }`}
                    >
                      <EcosystemIcon className="h-5 w-5" style={{ color: iconColor }} />
                      <span className={active ? 'text-background/80' : 'text-muted-foreground'}>{item.name}</span>
                    </button>
                  )
                })}
              </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
                className="mb-3 w-full rounded-sm border border-border bg-white px-3 py-2 text-sm text-foreground"
            >
                {developerLanguages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
            </select>
              <select value={framework} onChange={(event) => setFramework(event.target.value)} className="mb-3 w-full rounded-sm border border-border bg-white px-3 py-2 text-sm text-foreground">
                {developerFrameworks.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select value={workflow} onChange={(event) => setWorkflow(event.target.value)} className="mb-3 w-full rounded-sm border border-border bg-white px-3 py-2 text-sm text-foreground">
                {developerWorkflows.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select value={level} onChange={(event) => setLevel(event.target.value)} className="mb-3 w-full rounded-sm border border-border bg-white px-3 py-2 text-sm text-foreground">
                {['Beginner', 'Intermediate', 'Advanced'].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)} className="mb-6 w-full rounded-sm border border-border bg-white px-3 py-2 text-sm text-foreground">
                {developerLanguages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full rounded-none h-10 text-sm bg-primary" onClick={copyCode}>
                {copied ? '✓ Copied' : 'Copy'}
              </Button>
              <Button variant="outline" className="w-full rounded-none h-10 text-sm">
                Format
              </Button>
              <Button variant="outline" className="w-full rounded-none h-10 text-sm">
                Minify
              </Button>
                <Button variant="outline" className="w-full rounded-none h-10 text-sm">
                  Explain
                </Button>
                <Button variant="outline" className="w-full rounded-none h-10 text-sm">
                  Debug
                </Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-3 rounded-none border border-border bg-zinc-900 overflow-hidden">
            <div className="bg-zinc-800 px-4 py-3 border-b border-zinc-700 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Code Editor</span>
              <span className="text-xs text-zinc-500">{language} / {framework}</span>
            </div>
            <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 grid gap-2 text-xs text-zinc-400 sm:grid-cols-4">
              <span>Workflow: {workflow}</span>
              <span>Level: {level}</span>
              <span>Convert to: {targetLanguage}</span>
              <span>Output: preview, diff, download</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="font-mono text-sm text-zinc-100 leading-relaxed">
                <code>
                  {code.split('\n').map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="text-zinc-600 w-12 text-right pr-4 select-none">{idx + 1}</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ExplainerLayout({ tool }: { tool: Tool }) {
  const [expanded, setExpanded] = useState<number | null>(null)

  const explanations = [
    { severity: 'high', title: 'Database Connection Error', desc: 'Your app failed to connect to the database server' },
    { severity: 'medium', title: 'Memory Leak Detected', desc: 'The process is consuming increasing memory' },
    { severity: 'low', title: 'Deprecated Function', desc: 'You\'re using an outdated API method' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero
        tool={tool}
        label="Explain workspace"
        eyebrow="WHY"
        statusTitle="Issue breakdown"
        statusText="Review likely causes, fixes, related issues, and follow-up actions in one focused explainer."
      />

      <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
        <div className="space-y-4 mb-12">
          {explanations.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-none border border-border bg-white overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                className="w-full p-6 text-left flex items-start justify-between hover:bg-muted/50 transition"
              >
                <div className="flex gap-4 flex-1">
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      exp.severity === 'high'
                        ? 'bg-red-500'
                        : exp.severity === 'medium'
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                    }`}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{exp.desc}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground capitalize ml-4">
                  {expanded === idx ? '−' : '+'}
                </div>
              </button>

              {expanded === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-border bg-muted/30 p-6"
                >
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">What This Means</h4>
                      <p className="text-muted-foreground">
                        This error occurs when your application cannot establish a connection to the database server. This typically happens due to network issues, server downtime, or incorrect connection credentials.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">How to Fix It</h4>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        <li>Check your database connection string</li>
                        <li>Verify the server is running</li>
                        <li>Check your firewall settings</li>
                        <li>Review your credentials</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Similar Issues</h4>
                      <div className="flex gap-2 flex-wrap">
                        <button className="rounded-sm border border-border bg-white px-3 py-1 text-xs hover:border-primary/40">
                          Connection Timeout
                        </button>
                        <button className="rounded-sm border border-border bg-white px-3 py-1 text-xs hover:border-primary/40">
                          Authentication Failed
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Ask Follow-up */}
        <div className="rounded-none border border-border bg-white p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Still confused?</h3>
          <Button className="w-full rounded-none h-10 bg-primary">Start AI Chat to Learn More</Button>
        </div>
      </div>
    </motion.div>
  )
}
