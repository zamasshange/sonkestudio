"use client"

import Link from 'next/link'
import { AITool } from '@/components/ai-tool'
import { ArrowLeft, Sparkles, Lightbulb, BookOpen, Code2, FileText, BarChart3, HelpCircle, ShieldCheck } from 'lucide-react'
import { getToolsCategoryHref, tools } from '@/lib/tools-data'

interface ToolPageShellProps {
  title: string
  description: string
  toolId: string
  inputPlaceholder: string
  category?: string
  examples?: string[]
}

const categoryMeta: Record<string, { accent: string; label: string; copy: string; icon: typeof Sparkles }> = {
  ai: {
    accent: 'from-violet-500 to-fuchsia-500',
    label: 'Creative AI Studio',
    copy: 'Write, rewrite, summarize, or optimize any text with tailored AI guidance.',
    icon: Sparkles,
  },
  student: {
    accent: 'from-sky-500 to-cyan-500',
    label: 'Study Companion',
    copy: 'Solve homework, explain concepts, and turn study material into clear review notes.',
    icon: BookOpen,
  },
  creator: {
    accent: 'from-rose-500 to-orange-500',
    label: 'Creator Lab',
    copy: 'Generate viral captions, headlines, hooks, and content ideas for every platform.',
    icon: Lightbulb,
  },
  document: {
    accent: 'from-emerald-500 to-teal-500',
    label: 'Document Assistant',
    copy: 'Turn dense documents into clear text, citations, summaries, and polished materials.',
    icon: FileText,
  },
  dev: {
    accent: 'from-slate-500 to-sky-500',
    label: 'Developer Toolkit',
    copy: 'Format code, build queries, debug errors, and turn ideas into production-ready snippets.',
    icon: Code2,
  },
  business: {
    accent: 'from-indigo-500 to-blue-500',
    label: 'Business Booster',
    copy: 'Create polished business content, plans, pitches, and growth-ready materials fast.',
    icon: BarChart3,
  },
  explain: {
    accent: 'from-amber-500 to-yellow-500',
    label: 'Explain & Simplify',
    copy: 'Break down complex content into smart, easy-to-understand explanations and summaries.',
    icon: HelpCircle,
  },
  utility: {
    accent: 'from-emerald-500 to-lime-500',
    label: 'Utility Lab',
    copy: 'Simple tools with fast results — from conversions to quick text helpers.',
    icon: ShieldCheck,
  },
  pdf: {
    accent: 'from-slate-500 to-cyan-500',
    label: 'PDF Helper',
    copy: 'Extract, summarize, and transform PDF content with fast AI workflows.',
    icon: FileText,
  },
}

const defaultExamples: Record<string, string[]> = {
  ai: [
    'Rewrite my text to sound more natural and conversational.',
    'Improve this paragraph for clarity and flow.',
    'Turn this into a professional email asking for a meeting.',
    'Paraphrase this sentence without changing the meaning.',
  ],
  student: [
    'Explain this concept step-by-step: photosynthesis.',
    'Turn these notes into a study guide for exam prep.',
    'Solve this math problem and show all steps: 2x + 5 = 17.',
    'Summarize this paragraph in simple terms.',
  ],
  creator: [
    'Write a catchy Instagram caption for a product launch.',
    'Generate 10 Twitter hooks about productivity.',
    'Give me 5 video ideas for a travel vlog.',
    'Create a LinkedIn post announcing a new service.',
  ],
  document: [
    'Summarize this document into 3 bullet points.',
    'Simplify this contract clause for a non-expert.',
    'Convert this text into an APA citation.',
    'Rewrite this paragraph to make it easier to read.',
  ],
  dev: [
    'Format this JSON and validate its structure.',
    'Explain this error and how to fix it: TypeError cannot read property.',
    'Generate a curl command for a POST request to /api/login.',
    'Turn this query into a safe SQL statement.',
  ],
  business: [
    'Write a short sales email for a consulting service.',
    'Create a SWOT analysis for a startup idea.',
    'Draft a marketing plan outline for a new product.',
    'Write a professional cover letter for a job application.',
  ],
  explain: [
    'Explain this paragraph in plain English.',
    'Summarize the key points of this technical text.',
    'Translate this email into friendlier language.',
    'Break down this process into simple steps.',
  ],
  utility: [
    'Convert these units from miles to kilometers.',
    'Generate a random password with letters and numbers.',
    'Shorten this URL with a catchy alias.',
    'Compare these two text blocks and highlight differences.',
  ],
  pdf: [
    'Summarize the content of this PDF into 5 bullet points.',
    'Extract the most important action items from this document.',
    'Create a clean summary of this report.',
    'Turn these notes into a polished executive summary.',
  ],
}

function getCategory(toolId: string, category?: string) {
  if (category) return category
  if (toolId.startsWith('ai-') || ['humanizer','paraphraser','rewriter','grammar','tone','essay','email','hook','prompt','headline','bio','story','simplify','resume','cold-email','reply','tweet','script','notes'].includes(toolId)) return 'ai'
  if (['homework','math','citation','flashcards','quiz','notes-summary','planner','research','concept','tutor','exam','paper','formula','assignment'].includes(toolId)) return 'student'
  if (['caption','tiktok-hook','hashtags','viral-tweet','ideas','linkedin','reddit','youtube-title','hook-analyzer','calendar','podcast'].includes(toolId)) return 'creator'
  if (['summarize','to-word','from-word'].includes(toolId)) return 'pdf'
  if (['ocr','resume','contract','terms','invoice','receipt','legal','scanner','agreement'].includes(toolId)) return 'document'
  if (['password','password-check','temp-notes','word-count','char-count','unit','currency','timezone','random','compare','case','shorten','uuid','fake-data'].includes(toolId)) return 'utility'
  if (['json','sql','regex','base64-encode','base64-decode','jwt','html','css-minify','js-beautify','markdown','color','api','curl','diff'].includes(toolId)) return 'dev'
  if (['biz-resume','cover-letter','meeting-notes','formula','startup-idea','swot','marketing','name','pitch-deck','market-research','competitor'].includes(toolId)) return 'business'
  if (['explain-screenshot','explain-error','explain-code','explain-contract','explain-legal','explain-chart','explain-homework','explain-email','explain-spreadsheet','explain-api-error'].includes(toolId)) return 'explain'
  return 'ai'
}

export function ToolPageShell({ title, description, toolId, inputPlaceholder, category, examples }: ToolPageShellProps) {
  const currentCategory = getCategory(toolId, category)
  const meta = categoryMeta[currentCategory] || categoryMeta.ai
  const exampleList = examples || defaultExamples[currentCategory] || defaultExamples.ai
  const matchedTool = tools.find((tool) => tool.id === toolId || tool.href.endsWith(`/${toolId}`))
  const Icon = matchedTool?.icon || meta.icon
  const backHref = getToolsCategoryHref(matchedTool?.category || currentCategory)
  const iconFilter = matchedTool?.id === 'tiktok-hook'
    ? 'drop-shadow(-1.2px 0 #00F2EA) drop-shadow(1.2px 0 #FF0050)'
    : undefined

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-32 pb-8 px-6 mx-auto max-w-7xl">
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </Link>
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_12px_40px_-28px_rgba(15,23,42,0.12)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] p-6 md:p-8">
            <div className="space-y-6">
              <div className={`inline-flex items-center gap-3 rounded-full bg-gradient-to-r ${meta.accent} bg-opacity-10 px-4 py-2 text-sm font-medium text-foreground`}>
                <Icon className="h-5 w-5" style={{ color: matchedTool?.iconColor, filter: iconFilter }} />
                {meta.label}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">{title}</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-border bg-muted p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">What this tool does</p>
                  <p className="text-sm leading-7 text-foreground">{meta.copy}</p>
                </div>
                <div className="rounded-[1rem] border border-border bg-muted p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">Try one of these</p>
                  <div className="space-y-3">
                    {exampleList.slice(0, 4).map((example) => (
                      <div key={example} className="rounded-[1rem] bg-background px-4 py-3">
                        <p className="text-sm text-foreground">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-[1rem] border border-border bg-muted p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-3">How to use</p>
                <ol className="space-y-3 text-sm leading-7 text-foreground">
                  <li>1. Add your text, question, or prompt in the input box.</li>
                  <li>2. Press Generate and let the AI craft the result.</li>
                  <li>3. Copy, refine, or regenerate until it feels perfect.</li>
                </ol>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-background p-6 md:p-8 shadow-sm mt-8 lg:mt-0 relative z-10 overflow-visible">
              <AITool
                title={title}
                description={description}
                icon={Icon}
                iconColor={matchedTool?.iconColor}
                iconBg={matchedTool?.iconBg}
                iconFilter={iconFilter}
                inputPlaceholder={inputPlaceholder}
                toolId={toolId}
                toolTitle={title}
                toolDescription={description}
                examplePrompts={exampleList}
                hideHeader
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
