"use client"

import { useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { Button } from '@/components/ui/button'
import { Bot, Copy, Loader2, Play, Sparkles } from 'lucide-react'
import prettier from 'prettier/standalone'
import parserBabel from 'prettier/plugins/babel'
import parserEstree from 'prettier/plugins/estree'
import parserHtml from 'prettier/plugins/html'
import parserPostcss from 'prettier/plugins/postcss'
import parserTypescript from 'prettier/plugins/typescript'

interface Props {
  tool: Tool
}

const defaultFiles: Record<string, string> = {
  html: `<main class="card">\n  <h1>SONKE Workspace</h1>\n  <p>Edit HTML/CSS/JS and see live preview.</p>\n  <button onclick="document.body.classList.toggle('night')">Toggle</button>\n</main>`,
  css: `:root { font-family: Inter, system-ui, sans-serif; }\nbody { margin: 0; padding: 2rem; background: #f3efe7; color: #1f1810; }\n.card { max-width: 680px; padding: 2rem; border: 1px solid #d8cdb8; background: #fff; border-radius: 14px; }\n.night { background: #141414; color: #f5f5f5; }`,
  javascript: `console.log('SONKE dev workspace ready')`,
}

export function DeveloperMonacoWorkspaceLayout({ tool }: Props) {
  const [files, setFiles] = useState(defaultFiles)
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'javascript'>('html')
  const [language, setLanguage] = useState('JavaScript')
  const [framework, setFramework] = useState('Vanilla')
  const [syntaxTarget, setSyntaxTarget] = useState('ESNext')
  const [aiLoading, setAiLoading] = useState(false)

  const preview = useMemo(
    () => `<!doctype html><html><head><style>${files.css}</style></head><body>${files.html}<script>${files.javascript}</script></body></html>`,
    [files],
  )

  const formatCurrent = async () => {
    const parserMap = { html: 'html', css: 'css', javascript: 'babel' } as const
    const parser = parserMap[activeTab]
    const formatted = await prettier.format(files[activeTab], {
      parser,
      plugins: [parserBabel, parserEstree, parserHtml, parserPostcss, parserTypescript],
    })
    setFiles((prev) => ({ ...prev, [activeTab]: formatted }))
  }

  const runAiAction = async (action: string) => {
    setAiLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: tool.id,
          text: `You are a senior engineer. ${action}. Return code only for this ${activeTab} file.\n\n${files[activeTab]}`,
          tone: 'technical',
          mode: 'enhance',
        }),
      })
      const data = await response.json()
      const content = data.result || data.choices?.[0]?.message?.content
      if (response.ok && content) {
        setFiles((prev) => ({ ...prev, [activeTab]: content.trim() }))
      }
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero
        tool={tool}
        label="Developer workspace"
        eyebrow="DEV"
        statusTitle="Monaco + Live Preview"
        statusText="Edit in Monaco, preview in real time, and iterate with AI actions."
      />

      <div className="mx-auto grid max-w-[1720px] gap-5 px-5 pb-10 sm:px-8 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-md border border-border bg-white p-4">
          <p className="mb-3 text-sm font-semibold">Workspace Actions</p>
          <div className="mb-4 grid gap-2">
            <label className="text-xs text-muted-foreground">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2 text-sm">
              {['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS', 'JSON', 'Markdown'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <label className="text-xs text-muted-foreground">Framework</label>
            <select value={framework} onChange={(e) => setFramework(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2 text-sm">
              {['Vanilla', 'React', 'Next.js', 'Node.js', 'Tailwind', 'Express'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <label className="text-xs text-muted-foreground">Syntax Target</label>
            <select value={syntaxTarget} onChange={(e) => setSyntaxTarget(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2 text-sm">
              {['ES5', 'ES2015', 'ESNext', 'CommonJS', 'Module'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <Button variant="outline" onClick={formatCurrent}>Format current file</Button>
            <Button variant="outline" onClick={() => runAiAction('Explain this code and improve readability with comments') } disabled={aiLoading}><Bot className="mr-2 h-4 w-4" />Explain + comment</Button>
            <Button variant="outline" onClick={() => runAiAction('Refactor for maintainability and performance') } disabled={aiLoading}><Sparkles className="mr-2 h-4 w-4" />Refactor</Button>
            <Button variant="outline" onClick={() => runAiAction('Debug likely issues and return fixed code') } disabled={aiLoading}>{aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}Debug</Button>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(files[activeTab])}><Copy className="mr-2 h-4 w-4" />Copy file</Button>
          </div>
        </aside>

        <section className="rounded-md border border-border bg-white p-4">
          <div className="mb-3 grid gap-2 rounded-sm border border-border bg-background p-2 text-xs text-muted-foreground sm:grid-cols-3">
            <span>Language: {language}</span>
            <span>Framework: {framework}</span>
            <span>Target: {syntaxTarget}</span>
          </div>
          <div className="mb-3 flex gap-2">
            {(['html', 'css', 'javascript'] as const).map((tab) => (
              <Button key={tab} variant={activeTab === tab ? 'default' : 'outline'} onClick={() => setActiveTab(tab)}>{tab.toUpperCase()}</Button>
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="overflow-hidden rounded-sm border border-border">
              <Editor
                height="560px"
                language={activeTab === 'javascript' ? 'javascript' : activeTab}
                value={files[activeTab]}
                theme="vs-dark"
                onChange={(value) => setFiles((prev) => ({ ...prev, [activeTab]: value || '' }))}
                options={{ minimap: { enabled: true }, fontSize: 14, automaticLayout: true, wordWrap: 'on' }}
              />
            </div>
            <div className="overflow-hidden rounded-sm border border-border bg-white">
              <div className="flex h-10 items-center border-b border-border px-3 text-xs text-muted-foreground">Live Preview</div>
              <iframe title="preview" srcDoc={preview} className="h-[520px] w-full bg-white" sandbox="allow-scripts" />
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
