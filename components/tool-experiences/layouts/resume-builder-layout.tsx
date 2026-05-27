"use client"

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Download, FileJson2, Loader2, Sparkles } from 'lucide-react'

type ResumeSection = {
  id: string
  title: string
  content: string
}

interface ResumeBuilderLayoutProps {
  tool: Tool
}

const templates = [
  { id: 'modern', name: 'Modern', color: '#2563eb' },
  { id: 'minimal', name: 'Minimal', color: '#111827' },
  { id: 'corporate', name: 'Corporate', color: '#1e40af' },
  { id: 'creative', name: 'Creative', color: '#dc2626' },
]

export function ResumeBuilderLayout({ tool }: ResumeBuilderLayoutProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<'generate' | 'edit'>('generate')
  const [loading, setLoading] = useState(false)
  const [templateId, setTemplateId] = useState('modern')

  const [targetRole, setTargetRole] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('Mid-level')
  const [tone, setTone] = useState('Professional')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [skills, setSkills] = useState('')
  const [experience, setExperience] = useState('')
  const [education, setEducation] = useState('')

  const [sections, setSections] = useState<ResumeSection[]>([
    { id: 'summary', title: 'Professional Summary', content: '' },
    { id: 'experience', title: 'Experience', content: '' },
    { id: 'education', title: 'Education', content: '' },
    { id: 'skills', title: 'Skills', content: '' },
  ])

  const selectedTemplate = templates.find((t) => t.id === templateId) || templates[0]

  const fullResumeText = useMemo(() => {
    return sections.map((s) => `${s.title}\n${s.content}`).join('\n\n').trim()
  }, [sections])

  const updateSection = (id: string, content: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, content } : s)))
  }

  const generateWithAi = async () => {
    if (!targetRole.trim()) return
    setLoading(true)
    try {
      const prompt = `Generate a complete ATS-friendly CV.
Target role: ${targetRole}
Experience level: ${experienceLevel}
Tone: ${tone}
Name: ${name}
Email: ${email}
Phone: ${phone}
Location: ${location}
Skills input: ${skills}
Experience input: ${experience}
Education input: ${education}

Return exactly in this structure with headings:
Professional Summary:
...
Experience:
...
Education:
...
Skills:
...`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: tool.id, text: prompt }),
      })
      const data = await response.json()
      const content = data.result || data.choices?.[0]?.message?.content || ''

      const summary = content.match(/Professional Summary:\s*([\s\S]*?)\n\s*Experience:/i)?.[1]?.trim() || ''
      const exp = content.match(/Experience:\s*([\s\S]*?)\n\s*Education:/i)?.[1]?.trim() || ''
      const edu = content.match(/Education:\s*([\s\S]*?)\n\s*Skills:/i)?.[1]?.trim() || ''
      const sk = content.match(/Skills:\s*([\s\S]*)/i)?.[1]?.trim() || ''

      setSections([
        { id: 'summary', title: 'Professional Summary', content: summary || 'No summary generated yet.' },
        { id: 'experience', title: 'Experience', content: exp || experience || 'No experience generated yet.' },
        { id: 'education', title: 'Education', content: edu || education || 'No education generated yet.' },
        { id: 'skills', title: 'Skills', content: sk || skills || 'No skills generated yet.' },
      ])

      setMode('edit')
    } finally {
      setLoading(false)
    }
  }

  const exportPDF = () => {
    const preview = previewRef.current
    if (!preview) return
    const printWindow = window.open('', '_blank', 'width=1200,height=900')
    if (!printWindow) return
    printWindow.document.write(`
      <html>
        <head>
          <title>CV Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #111827; }
            .a4 { width: 794px; min-height: 1123px; margin: 0 auto; }
          </style>
        </head>
        <body><div class="a4">${preview.innerHTML}</div></body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const exportDOCX = () => {
    const blob = new Blob([
      `${name}\n${email} | ${phone} | ${location}\n\n${fullResumeText}`,
    ], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'cv.doc'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="AI CV Generator"
        eyebrow="CV"
        statusTitle={mode === 'generate' ? 'AI Generation' : 'Manual Editing'}
        statusText="Generate a complete CV with AI first, then fine-tune manually with full A4 preview and export."
      />

      <div className="mx-auto max-w-[1750px] px-5 pb-10 sm:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Button variant={mode === 'generate' ? 'default' : 'outline'} onClick={() => setMode('generate')}>AI Generator</Button>
          <Button variant={mode === 'edit' ? 'default' : 'outline'} onClick={() => setMode('edit')}>Manual Edit + Preview</Button>
          <div className="ml-auto flex gap-2">
            <Button onClick={exportPDF} className="gap-2"><Download className="h-4 w-4" />PDF</Button>
            <Button onClick={exportDOCX} variant="outline" className="gap-2"><FileJson2 className="h-4 w-4" />DOC</Button>
          </div>
        </div>

        {mode === 'generate' ? (
          <div className="grid gap-5 xl:grid-cols-[430px_minmax(0,1fr)]">
            <section className="rounded-2xl border border-border bg-white p-5 space-y-3">
              <h2 className="text-xl font-semibold">Generate Your CV with AI</h2>
              <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Target role (required)" />
              <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm">
                <option>Entry-level</option>
                <option>Mid-level</option>
                <option>Senior</option>
                <option>Executive</option>
              </select>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm">
                <option>Professional</option>
                <option>Modern</option>
                <option>Confident</option>
                <option>Concise</option>
              </select>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
              <Textarea value={skills} onChange={(e) => setSkills(e.target.value)} className="min-h-[100px]" placeholder="Key skills" />
              <Textarea value={experience} onChange={(e) => setExperience(e.target.value)} className="min-h-[120px]" placeholder="Work experience notes" />
              <Textarea value={education} onChange={(e) => setEducation(e.target.value)} className="min-h-[90px]" placeholder="Education details" />
              <Button onClick={generateWithAi} disabled={loading || !targetRole.trim()} className="w-full gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate CV
              </Button>
            </section>

            <section className="rounded-2xl border border-border bg-white p-5">
              <h3 className="mb-3 text-lg font-semibold">Template</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {templates.map((t) => (
                  <button key={t.id} onClick={() => setTemplateId(t.id)} className={`rounded-md border p-3 text-left ${templateId === t.id ? 'border-foreground bg-foreground text-background' : 'border-border bg-background'}`}>
                    <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: t.color }} />
                    <p className="mt-2 text-sm font-semibold">{t.name}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
            <section className="rounded-2xl border border-border bg-white p-5 space-y-4">
              <h2 className="text-xl font-semibold">Manual Editing</h2>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
              {sections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <p className="text-sm font-semibold">{section.title}</p>
                  <Textarea value={section.content} onChange={(e) => updateSection(section.id, e.target.value)} className="min-h-[120px]" />
                </div>
              ))}
            </section>

            <section className="rounded-2xl border border-border bg-white p-5">
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">A4 CV Preview</p>
              <div className="overflow-auto rounded-xl border border-border bg-muted p-4">
                <div ref={previewRef} className="mx-auto w-[794px] min-h-[1123px] bg-white p-12 shadow-sm">
                  <h1 className="text-4xl font-bold" style={{ color: selectedTemplate.color }}>{name || 'Your Name'}</h1>
                  <p className="mt-2 text-sm text-muted-foreground">{email || 'email@example.com'} | {phone || '+27 ...'} | {location || 'Location'}</p>
                  {sections.map((section) => (
                    <div key={section.id} className="mt-8">
                      <h2 className="text-2xl font-semibold" style={{ color: selectedTemplate.color }}>{section.title}</h2>
                      <div className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">{section.content || 'No content yet.'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </motion.div>
  )
}
