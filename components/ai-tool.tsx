"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Copy, RefreshCw, ArrowLeft, Loader2, Check, Sparkles, Type, FileEdit, FileCheck, MessageSquare, Mail, Lightbulb, Sparkles as SparklesIcon, Hash, User, BookOpen, Layers, Award, ScrollText, Video, StickyNote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { getToolsCategoryHref, tools, type ToolIcon } from '@/lib/tools-data'

const iconMap: Record<string, any> = {
  Wand2, Type, FileEdit, FileCheck, MessageSquare, Mail, Lightbulb, SparklesIcon, Hash, User, BookOpen, Layers, Award, ScrollText, Video, StickyNote
}

interface AIToolProps {
  title: string
  description: string
  iconName?: string
  icon?: ToolIcon
  iconColor?: string
  iconBg?: string
  iconFilter?: string
  inputPlaceholder: string
  toolId: string
  toolTitle?: string
  toolDescription?: string
  examplePrompts?: string[]
  defaultInput?: string
  hideHeader?: boolean
}

export function AITool({ title, description, iconName, icon, iconColor, iconBg, iconFilter, inputPlaceholder, toolId, toolTitle, toolDescription, examplePrompts = [], defaultInput = '', hideHeader = false }: AIToolProps) {
  const Icon = icon || iconMap[iconName || ''] || Wand2
  const matchedTool = tools.find((tool) => tool.id === toolId || tool.href.endsWith(`/${toolId}`))
  const backHref = getToolsCategoryHref(matchedTool?.category || 'ai-text')

  const [input, setInput] = useState(defaultInput)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const processText = async () => {
    if (!input.trim()) return

    setLoading(true)
    setError('')
    setOutput('')

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: toolId,
          text: input,
          toolTitle: toolTitle || title,
          toolDescription: toolDescription || description
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process text')
      }

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

  const regenerate = async () => {
    await processText()
  }

  const chooseExample = (prompt: string) => {
    setInput(prompt)
    setOutput('')
    setError('')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {!hideHeader && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-32 pb-10 px-6">
          <div className="max-w-7xl mx-auto">
            <Link href={backHref} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Link>
            <div className="rounded-[2rem] border border-border bg-white p-6 md:p-8 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.12)]">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center ${
                      iconColor ? 'bg-transparent' : 'rounded-[1rem] bg-primary/10'
                    }`}
                    style={{ background: iconColor ? undefined : iconBg, color: iconColor }}
                  >
                    <Icon className={iconColor ? 'h-10 w-10 text-primary' : 'h-7 w-7 text-primary'} style={{ color: iconColor, filter: iconFilter }} />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2 text-foreground">{title}</h1>
                    <p className="text-base md:text-lg text-muted-foreground">{description}</p>
                  </div>
                </div>
                <div className="rounded-[1rem] border border-border bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
                  AI tool ID: <span className="text-foreground font-medium">{toolId}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`px-6 pb-20 ${hideHeader ? 'pt-10' : ''}`}>
        <div className={hideHeader ? 'w-full' : 'max-w-7xl mx-auto'}>
          <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-10 items-start">
              {/* Input Panel */}
            <div className="relative rounded-[2rem] border border-border bg-card p-8 shadow-sm z-10">
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5 text-primary" style={{ color: iconColor, filter: iconFilter }} />
                <h3 className="text-lg font-semibold text-foreground">Input</h3>
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputPlaceholder}
                className="min-h-[380px] rounded-[1.25rem] bg-muted resize-none"
              />
              {examplePrompts.length > 0 && (
                <div className="mt-6 rounded-[1.25rem] border border-border bg-muted/50 p-4">
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4" />
                    <span>Example prompts</span>
                  </div>
                  <div className="grid gap-3">
                    {examplePrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => chooseExample(prompt)}
                        className="w-full rounded-[1rem] border border-border bg-white px-4 py-3 text-left text-sm text-foreground hover:border-foreground/40 hover:bg-muted transition"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-muted-foreground">
                  {input.length} characters
                </span>
                <Button
                  onClick={processText}
                  disabled={loading || !input.trim()}
                  className="bg-foreground text-background hover:bg-foreground/90 gap-2 rounded-full px-6 py-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Icon className="w-4 h-4" style={{ filter: iconFilter }} />
                      Generate
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <div className="mt-4 rounded-[1rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* Output Panel */}
            <div className="relative rounded-[2rem] border border-border bg-white p-8 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Result</h3>
              </div>
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Result will appear here..."
                className="min-h-[520px] rounded-[1.25rem] bg-muted resize-none flex-1"
                readOnly
              />
              <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-muted-foreground">
                  {output.length} characters
                </span>
                {output && (
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={regenerate} variant="outline" className="gap-2 rounded-full px-5 py-3">
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </Button>
                    <Button onClick={copyToClipboard} variant="outline" className="gap-2 rounded-full px-5 py-3">
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
