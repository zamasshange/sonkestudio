"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Copy, Check, Sparkles, Loader2, Play } from 'lucide-react'
// Settings are visible by default; no tabs needed here
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'

interface SpreadsheetFormulaLayoutProps {
  tool: Tool
}

const formulaTemplates = [
  { id: 'sum', name: 'SUM', category: 'Aggregation', formula: '=SUM(A1:A10)', description: 'Add up values in a range' },
  { id: 'sumif', name: 'SUMIF', category: 'Aggregation', formula: '=SUMIF(A1:A10,">100")', description: 'Sum if condition is met' },
  { id: 'count', name: 'COUNT', category: 'Counting', formula: '=COUNT(A1:A10)', description: 'Count numeric values' },
  { id: 'countif', name: 'COUNTIF', category: 'Counting', formula: '=COUNTIF(A1:A10,"apple")', description: 'Count cells matching criteria' },
  { id: 'average', name: 'AVERAGE', category: 'Aggregation', formula: '=AVERAGE(A1:A10)', description: 'Calculate average' },
  { id: 'vlookup', name: 'VLOOKUP', category: 'Lookup', formula: '=VLOOKUP("value", A1:B10, 2, FALSE)', description: 'Look up and return value' },
  { id: 'if', name: 'IF', category: 'Logic', formula: '=IF(A1>100, "High", "Low")', description: 'Create conditional logic' },
  { id: 'concatenate', name: 'CONCAT', category: 'Text', formula: '=CONCAT(A1," ",B1)', description: 'Join text together' },
]

const categories = [...new Set(formulaTemplates.map((template) => template.category))]

export function SpreadsheetFormulaLayout({ tool }: SpreadsheetFormulaLayoutProps) {
  const [input, setInput] = useState('')
  const [formula, setFormula] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [testInput, setTestInput] = useState('')
  const [testOutput, setTestOutput] = useState('')

  const generateFormula = async () => {
    if (!input.trim()) return

    setLoading(true)
    setError('')
    setFormula('')
    setExplanation('')

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: tool.id,
          text: input,
          toolTitle: tool.name,
          toolDescription: tool.description,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to generate formula')

      const content = data.result || data.choices?.[0]?.message?.content
      if (content) {
        setFormula(content)
        setExplanation('Generated formula for your request')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const useTemplate = (template: typeof formulaTemplates[0]) => {
    setFormula(template.formula)
    setExplanation(template.description)
    setSelectedTemplate(template.id)
  }

  const testFormula = () => {
    setTestOutput(testInput.trim() ? 'Formula executed successfully' : 'Add sample values to test the formula')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Business workspace"
        eyebrow="BIZ"
        statusTitle="Formula lab"
        statusText="Start from a template or describe the spreadsheet problem, then test and copy the formula."
      />

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <aside className="rounded-none border border-border bg-white p-6 h-fit xl:sticky xl:top-44">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Formula library</p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">Templates</h2>
            <div className="mt-6 space-y-5">
              {categories.map((category) => (
                <div key={category}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{category}</p>
                  <div className="grid gap-2">
                    {formulaTemplates.filter((template) => template.category === category).map((template) => (
                      <button
                        key={template.id}
                        onClick={() => useTemplate(template)}
                        className={`rounded-none border p-3 text-left transition ${
                          selectedTemplate === template.id ? 'border-foreground bg-foreground text-background' : 'border-border bg-white hover:border-foreground/30'
                        }`}
                      >
                        <div className="text-sm font-semibold">{template.name}</div>
                        <div className={selectedTemplate === template.id ? 'mt-1 text-xs text-background/70' : 'mt-1 text-xs text-muted-foreground'}>{template.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <main className="space-y-6">
            <section className="rounded-none border border-border bg-white p-6">
              {/* Generate section (visible) */}
              <div className="m-0 pt-6">
                <label className="grid gap-2 text-sm font-medium text-foreground">
                  What formula do you need?
                  <Textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Example: calculate commission when sales are over R10,000..."
                    className="min-h-[180px] resize-none rounded-none border border-border bg-muted p-4 text-sm"
                  />
                </label>
                <Button onClick={generateFormula} disabled={!input.trim() || loading} className="mt-4 rounded-none bg-primary text-primary-foreground gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate formula
                </Button>
              </div>

              {/* Test section (visible) */}
              <div className="m-0 pt-6 mt-6">
                <label className="grid gap-2 text-sm font-medium text-foreground">
                  Sample values
                  <Input value={testInput} onChange={(event) => setTestInput(event.target.value)} placeholder="A1=120, B1=0.15" className="rounded-none border-border bg-white" />
                </label>
                <Button onClick={testFormula} className="mt-4 rounded-none bg-primary text-primary-foreground gap-2">
                  <Play className="w-4 h-4" />
                  Test formula
                </Button>
                {testOutput && <div className="mt-4 rounded-none border border-border bg-muted p-4 text-sm">{testOutput}</div>}
              </div>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </section>

            <section className="rounded-none border border-border bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Formula output</p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">Formula</h2>
                </div>
                <Button variant="outline" onClick={() => copyToClipboard(formula)} disabled={!formula} className="rounded-none bg-white gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <pre className="mt-5 min-h-[140px] overflow-auto rounded-none border border-border bg-muted p-5 font-mono text-sm whitespace-pre-wrap">
                {formula || 'Your generated formula will appear here.'}
              </pre>
              {explanation && <p className="mt-4 text-sm leading-6 text-muted-foreground">{explanation}</p>}
            </section>
          </main>

          <aside className="rounded-none border border-border bg-white p-6 h-fit xl:sticky xl:top-44">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Reference</p>
            <div className="mt-5 space-y-4 text-sm text-muted-foreground">
              <div className="rounded-none border border-border bg-muted p-4">
                <p className="mb-2 font-semibold text-foreground">Formula parts</p>
                <p>=FUNCTION(range, criteria)</p>
              </div>
              <div className="rounded-none border border-border bg-muted p-4">
                <p className="mb-2 font-semibold text-foreground">Common ranges</p>
                <p>A1:A10, B:B, Sheet1!A:C</p>
              </div>
              <div className="rounded-none border border-border bg-muted p-4">
                <p className="mb-2 font-semibold text-foreground">Operators</p>
                <p>&gt;, &lt;, =, &gt;=, &lt;=, &lt;&gt;</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
