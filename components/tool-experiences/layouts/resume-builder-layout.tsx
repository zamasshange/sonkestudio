"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Download, Copy, Plus, Trash2, GripVertical, Eye, EyeOff, Settings,
  Sparkles, Wand2, FileDown, FileJson2, Loader2, Check, AlertCircle, ZoomIn, ZoomOut,
  Palette, Type, Layout, Star, Zap, Lock, Send, Upload, Image as ImageIcon
} from 'lucide-react'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'

interface ResumeBuilderLayoutProps {
  tool: Tool
}

interface ResumeSection {
  id: string
  name: string
  type: 'text' | 'list' | 'structured'
  content: Record<string, any>
  visible: boolean
}

interface TemplateStyle {
  id: string
  name: string
  colors: { primary: string; accent: string; text: string; bg: string }
  fonts: { heading: string; body: string }
  layout: 'traditional' | 'modern' | 'minimal' | 'creative'
}

const templates: TemplateStyle[] = [
  {
    id: 'modern',
    name: 'Modern',
    colors: { primary: '#2563eb', accent: '#60a5fa', text: '#1f2937', bg: '#ffffff' },
    fonts: { heading: 'sans-serif', body: 'sans-serif' },
    layout: 'modern',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    colors: { primary: '#000000', accent: '#6b7280', text: '#111827', bg: '#ffffff' },
    fonts: { heading: 'sans-serif', body: 'sans-serif' },
    layout: 'minimal',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    colors: { primary: '#7c3aed', accent: '#a78bfa', text: '#1f1f1f', bg: '#fafafa' },
    fonts: { heading: 'serif', body: 'sans-serif' },
    layout: 'traditional',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    colors: { primary: '#1e40af', accent: '#3b82f6', text: '#1e293b', bg: '#ffffff' },
    fonts: { heading: 'sans-serif', body: 'sans-serif' },
    layout: 'traditional',
  },
  {
    id: 'creative',
    name: 'Creative',
    colors: { primary: '#dc2626', accent: '#f97316', text: '#0f172a', bg: '#fafafa' },
    fonts: { heading: 'sans-serif', body: 'sans-serif' },
    layout: 'modern',
  },
]

const defaultSections: ResumeSection[] = [
  { id: '1', name: 'Personal Details', type: 'structured', content: {}, visible: true },
  { id: '2', name: 'Professional Summary', type: 'text', content: {}, visible: true },
  { id: '3', name: 'Experience', type: 'list', content: {}, visible: true },
  { id: '4', name: 'Education', type: 'list', content: {}, visible: true },
  { id: '5', name: 'Skills', type: 'list', content: {}, visible: true },
  { id: '6', name: 'Certifications', type: 'list', content: {}, visible: false },
  { id: '7', name: 'Projects', type: 'list', content: {}, visible: false },
  { id: '8', name: 'Languages', type: 'list', content: {}, visible: false },
]

export function ResumeBuilderLayout({ tool }: ResumeBuilderLayoutProps) {
  const [sections, setSections] = useState<ResumeSection[]>(defaultSections)
  const [selectedSectionId, setSelectedSectionId] = useState('1')
  const [template, setTemplate] = useState<TemplateStyle>(templates[0])
  const [zoom, setZoom] = useState(100)
  const [atsScore, setAtsScore] = useState(82)
  const [aiLoading, setAiLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [targetRole, setTargetRole] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)

  const selectedSection = sections.find(s => s.id === selectedSectionId)

  const updateSectionContent = useCallback((sectionId: string, content: any) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, content } : s
    ))
  }, [])

  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    ))
  }, [])

  const deleteSection = useCallback((sectionId: string) => {
    setSections(prev => {
      const nextSections = prev.filter(s => s.id !== sectionId)
      if (selectedSectionId === sectionId) {
        setSelectedSectionId(nextSections[0]?.id || '')
      }
      return nextSections
    })
  }, [selectedSectionId])

  const addSection = useCallback(() => {
    const newSection: ResumeSection = {
      id: Date.now().toString(),
      name: 'New Section',
      type: 'text',
      content: {},
      visible: true,
    }
    setSections(prev => [...prev, newSection])
  }, [])

  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return
    
    const draggedIndex = sections.findIndex(s => s.id === draggedId)
    const targetIndex = sections.findIndex(s => s.id === targetId)
    
    const newSections = [...sections]
    ;[newSections[draggedIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[draggedIndex]]
    setSections(newSections)
    setDraggedId(null)
  }

  const generateAIContent = async () => {
    if (!selectedSection) return
    setAiLoading(true)
    try {
      const personal = sections.find((s) => s.name === 'Personal Details')?.content || {}
      const prompt = `Build strong resume content for section: ${selectedSection.name}.
Target role: ${targetRole || 'Not specified'}
Current section content: ${JSON.stringify(selectedSection.content)}
Candidate context: ${JSON.stringify(personal)}

Return practical, recruiter-ready content for this section only.`
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: tool.id, text: prompt }),
      })
      const data = await response.json()
      const content = data.result || data.choices?.[0]?.message?.content || ''

      if (selectedSection.type === 'list') {
        const items = content.split('\n').map((line: string) => line.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
        updateSectionContent(selectedSection.id, { items })
      } else if (selectedSection.type === 'structured') {
        const [fullName, email, phone, location] = content.split('\n').map((x: string) => x.trim())
        updateSectionContent(selectedSection.id, {
          ...selectedSection.content,
          fullName: fullName || selectedSection.content.fullName,
          email: email || selectedSection.content.email,
          phone: phone || selectedSection.content.phone,
          location: location || selectedSection.content.location,
        })
      } else {
        updateSectionContent(selectedSection.id, {
          text: content || selectedSection.content.text || '',
        })
      }
    } finally {
      setAiLoading(false)
    }
  }

  const getResumeText = () => {
    const lines: string[] = []
    sections.filter((s) => s.visible).forEach((section) => {
      lines.push(section.name.toUpperCase())
      if (section.type === 'structured') {
        const c = section.content || {}
        lines.push(c.fullName || '')
        lines.push(c.email || '')
        lines.push(c.phone || '')
        lines.push(c.location || '')
      } else if (section.type === 'list') {
        const items = section.content.items || []
        items.forEach((item: string) => lines.push(`- ${item}`))
      } else {
        lines.push(section.content.text || '')
      }
      lines.push('')
    })
    return lines.join('\n').trim()
  }

  const exportPDF = () => {
    const preview = previewRef.current
    if (!preview) return
    const printWindow = window.open('', '_blank', 'width=1024,height=768')
    if (!printWindow) return
    printWindow.document.write(`
      <html>
        <head>
          <title>CV Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
            .page { width: 794px; min-height: 1123px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="page">${preview.innerHTML}</div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const exportDOCX = () => {
    const text = getResumeText()
    const blob = new Blob([text], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'resume.doc'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Business workspace"
        eyebrow="BIZ"
        statusTitle={`${template.name} / ATS ${atsScore}`}
        statusText="Edit sections, tune the template, preview the resume, and export from the same focused builder."
      />

      <div className="mx-auto flex max-w-[1720px] justify-end gap-2 px-5 sm:px-8">
        <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Target role (e.g. Product Manager)" className="max-w-[320px] rounded-none bg-white" />
        <Button onClick={exportPDF} className="rounded-none bg-primary text-primary-foreground gap-2">
          <Download className="w-4 h-4" />
          PDF
        </Button>
        <Button onClick={exportDOCX} variant="outline" className="rounded-none gap-2 bg-white">
          <FileJson2 className="w-4 h-4" />
          DOCX
        </Button>
      </div>

      {/* Main Layout */}
      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
          {/* LEFT SIDEBAR: CV Sections */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-border bg-white overflow-hidden flex flex-col h-fit xl:sticky xl:top-44"
          >
            <div className="p-5 border-b border-border">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">CV outline</p>
              <h2 className="mt-2 text-lg font-semibold text-foreground">Sections</h2>
              <Button
                onClick={addSection}
                variant="outline"
                className="mt-4 w-full rounded-none bg-white gap-2 h-9 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add section
              </Button>
            </div>
            
            <div className="space-y-1 p-3">
              <AnimatePresence>
                {sections.map((section) => (
                  <motion.div
                    key={section.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    draggable
                    onDragStart={() => handleDragStart(section.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(section.id)}
                    className={`group flex items-center gap-2 border px-3 py-2 cursor-move transition-all ${
                      selectedSectionId === section.id
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border bg-white text-foreground hover:border-foreground/30'
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <button
                      onClick={() => setSelectedSectionId(section.id)}
                      className="flex-1 text-left text-sm truncate"
                    >
                      {section.name}
                    </button>
                    <button
                      onClick={() => toggleSectionVisibility(section.id)}
                      className="text-muted-foreground hover:text-foreground transition"
                      title={section.visible ? 'Hide' : 'Show'}
                    >
                      {section.visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    {section.id !== '1' && (
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="text-muted-foreground hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CENTER: Editor + Preview */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Editor Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border bg-white p-6 flex flex-col"
            >
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Edit content</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground mb-5">{selectedSection?.name}</h3>
                {selectedSection?.type === 'text' && (
                  <Textarea
                    value={selectedSection.content.text || ''}
                    onChange={(e) => updateSectionContent(selectedSectionId, { text: e.target.value })}
                    placeholder="Enter your content here..."
                    className="min-h-[360px] resize-none rounded-none border border-border bg-muted p-4 text-sm"
                  />
                )}
                {selectedSection?.type === 'list' && (
                  <Textarea
                    value={selectedSection.content.items?.join('\n') || ''}
                    onChange={(e) => updateSectionContent(selectedSectionId, { items: e.target.value.split('\n') })}
                    placeholder="One item per line..."
                    className="min-h-[360px] resize-none rounded-none border border-border bg-muted p-4 text-sm"
                  />
                )}
                {selectedSection?.type === 'structured' && (
                  <div className="space-y-3">
                    <Input
                      value={selectedSection.content.fullName || ''}
                      onChange={(e) => updateSectionContent(selectedSectionId, { ...selectedSection.content, fullName: e.target.value })}
                      placeholder="Full Name"
                      className="rounded-none border-border bg-white h-11 text-sm"
                    />
                    <Input
                      value={selectedSection.content.email || ''}
                      onChange={(e) => updateSectionContent(selectedSectionId, { ...selectedSection.content, email: e.target.value })}
                      placeholder="Email"
                      className="rounded-none border-border bg-white h-11 text-sm"
                    />
                    <Input
                      value={selectedSection.content.phone || ''}
                      onChange={(e) => updateSectionContent(selectedSectionId, { ...selectedSection.content, phone: e.target.value })}
                      placeholder="Phone"
                      className="rounded-none border-border bg-white h-11 text-sm"
                    />
                    <Input
                      value={selectedSection.content.location || ''}
                      onChange={(e) => updateSectionContent(selectedSectionId, { ...selectedSection.content, location: e.target.value })}
                      placeholder="Location"
                      className="rounded-none border-border bg-white h-11 text-sm"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-auto">
                <Button
                  onClick={generateAIContent}
                  disabled={aiLoading}
                  className="flex-1 rounded-none bg-primary text-primary-foreground gap-2 h-10 text-sm"
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  AI Improve
                </Button>
              </div>
            </motion.div>

            {/* Live Preview Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border bg-white p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Preview</p>
                  <h3 className="mt-2 text-xl font-semibold text-foreground">Live CV</h3>
                </div>
                <div className="flex gap-2 items-center">
                  <Button
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                    variant="outline"
                    className="h-9 w-9 p-0 rounded-none bg-white"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground w-12 text-center">{zoom}%</span>
                  <Button
                    onClick={() => setZoom(Math.min(150, zoom + 10))}
                    variant="outline"
                    className="h-9 w-9 p-0 rounded-none bg-white"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div 
                ref={previewRef}
                className="min-h-[520px] bg-muted overflow-auto border border-border p-5"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              >
                <div className="w-[794px] min-h-[1123px] mx-auto bg-white p-12 shadow-sm">
                  {/* Personal Details Preview */}
                  {sections[0]?.visible && (
                    <div className="mb-6 border-b-2 pb-4" style={{ borderColor: template.colors.primary }}>
                      <h1 className="text-3xl font-bold" style={{ color: template.colors.primary }}>
                        {sections[0].content.fullName || 'Your Name'}
                      </h1>
                      <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        {sections[0].content.email && <p>{sections[0].content.email}</p>}
                        {sections[0].content.phone && <p>{sections[0].content.phone}</p>}
                        {sections[0].content.location && <p>{sections[0].content.location}</p>}
                      </div>
                    </div>
                  )}

                  {/* Other Sections Preview */}
                  {sections.slice(1).map((section) => section.visible && (
                    <div key={section.id} className="mb-6">
                      <h2 className="text-lg font-bold mb-2" style={{ color: template.colors.primary }}>
                        {section.name}
                      </h2>
                      {section.type === 'text' && (
                        <p className="text-sm leading-6 text-muted-foreground">{section.content.text || 'No content yet.'}</p>
                      )}
                      {section.type === 'list' && (
                        <ul className="text-sm leading-6 text-muted-foreground space-y-1">
                          {section.content.items?.map((item: string, idx: number) => (
                            <li key={idx} className="ml-4">• {item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR: Design & AI Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-border bg-white flex flex-col overflow-hidden h-fit xl:sticky xl:top-44"
          >
            <Tabs defaultValue="design" className="flex flex-col flex-1">
              <TabsList className="grid w-full grid-cols-3 bg-white border-b border-border rounded-none p-1 h-11">
                <TabsTrigger value="design" className="text-xs rounded-none">Design</TabsTrigger>
                <TabsTrigger value="ats" className="text-xs rounded-none">ATS</TabsTrigger>
                <TabsTrigger value="ai" className="text-xs rounded-none">AI</TabsTrigger>
              </TabsList>

              {/* Design Panel */}
              <TabsContent value="design" className="m-0 flex-1 overflow-y-auto p-5 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">Template</label>
                  <div className="space-y-2">
                    {templates.map((t) => (
                      <motion.button
                        key={t.id}
                        onClick={() => setTemplate(t)}
                        className={`w-full text-left px-3 py-2 rounded-none text-sm transition ${
                          template.id === t.id
                            ? 'bg-foreground text-background border border-foreground'
                            : 'border border-border bg-white text-foreground hover:border-foreground/30'
                        }`}
                      >
                        <div className="font-medium flex items-center gap-2">
                          <div 
                            className="w-3 h-3 border border-border"
                            style={{ backgroundColor: t.colors.primary }}
                          />
                          {t.name}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Colors
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['#2563eb', '#7c3aed', '#dc2626', '#059669'].map((color) => (
                      <button
                        key={color}
                        className="w-full aspect-square rounded-none border-2 transition"
                        style={{
                          backgroundColor: color,
                          borderColor: template.colors.primary === color ? '#0d0d0d' : '#e5e7eb',
                        }}
                        onClick={() => setTemplate({ ...template, colors: { ...template.colors, primary: color } })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Font
                  </label>
                  <select 
                    value={template.fonts.body}
                    onChange={(e) => setTemplate({ ...template, fonts: { ...template.fonts, body: e.target.value } })}
                    className="w-full bg-white border border-border text-foreground text-sm rounded-none px-3 py-2"
                  >
                    <option value="sans-serif">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Layout
                  </label>
                  <select 
                    value={template.layout}
                    onChange={(e) => setTemplate({ ...template, layout: e.target.value as any })}
                    className="w-full bg-white border border-border text-foreground text-sm rounded-none px-3 py-2"
                  >
                    <option value="modern">Modern</option>
                    <option value="traditional">Traditional</option>
                    <option value="minimal">Minimal</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
              </TabsContent>

              {/* ATS Panel */}
              <TabsContent value="ats" className="m-0 flex-1 overflow-y-auto p-5 space-y-5">
                <div className="bg-muted border border-border rounded-none p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">ATS Score</span>
                    <span className="text-2xl font-semibold text-foreground">{atsScore}%</span>
                  </div>
                  <div className="w-full bg-white rounded-none h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${atsScore}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Your CV is well-optimized for applicant tracking systems
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-foreground" />
                    Keywords optimized
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-foreground" />
                    Proper formatting
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4 text-foreground" />
                    Add more specific skills
                  </div>
                </div>

                <Button className="w-full bg-primary text-primary-foreground gap-2 rounded-none h-9 text-sm">
                  <Zap className="w-4 h-4" />
                  Get suggestions
                </Button>
              </TabsContent>

              {/* AI Panel */}
              <TabsContent value="ai" className="m-0 flex-1 overflow-y-auto p-5 space-y-3">
                <div className="space-y-3">
                  <Button className="w-full bg-primary text-primary-foreground gap-2 rounded-none h-9 text-sm justify-start">
                    <Wand2 className="w-4 h-4" />
                    Generate CV
                  </Button>
                  <Button variant="outline" className="w-full bg-white gap-2 rounded-none h-9 text-sm justify-start">
                    <Sparkles className="w-4 h-4" />
                    Rewrite content
                  </Button>
                  <Button variant="outline" className="w-full bg-white gap-2 rounded-none h-9 text-sm justify-start">
                    <Zap className="w-4 h-4" />
                    Optimize for job description
                  </Button>
                </div>

                <div className="bg-muted rounded-none p-3 border border-border">
                  <p className="text-xs text-muted-foreground leading-5">
                    Tip: paste a job description into the relevant section, then optimize your CV around it.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
