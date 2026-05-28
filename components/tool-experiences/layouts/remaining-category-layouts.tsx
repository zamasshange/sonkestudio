"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { Tool } from '@/lib/tools-data'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Code2,
  Copy,
  Gauge,
  GitCompareArrows,
  LineChart,
  QrCode,
  RefreshCw,
  Palette,
  Play,
  Ruler,
  Sparkles,
  Shuffle,
  Terminal,
  Type,
} from 'lucide-react'
import { useLocation } from '@/hooks/use-location'
import { getLocalizedPromptSuggestions } from '@/lib/smart-recommendations'
import { getSAContextSignal } from '@/lib/sa-intelligence'
import {
  ContextualFollowUps,
  describeAssets,
  InteractionAsset,
  SmartUploadPanel,
} from '@/components/tool-experiences/shared/ai-interaction-panel'

async function askAi(tool: Tool, text: string) {
  const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: tool.id, text }) })
  const data = await res.json()
  return data.result || data.choices?.[0]?.message?.content || ''
}

const uploadEnabledToolIds = new Set([
  'ai-resume',
  'resume-optimizer',
  'ai-resume-feedback',
  'pdf-summarizer',
  'ocr-extractor',
  'doc-scanner',
  'agreement-analyzer',
  'legal-simplifier',
  'contract-simplifier',
  'terms-simplifier',
  'explain-screenshot',
  'explain-contract',
  'explain-legal',
  'explain-chart',
  'explain-spreadsheet',
])

function shouldShowUpload(tool: Tool) {
  return uploadEnabledToolIds.has(tool.id)
}

function getDeveloperWorkbenchConfig(toolId: string) {
  const configs: Record<string, {
    badge: string
    statusTitle: string
    statusText: string
    panelTitle: string
    editorTitle: string
    placeholder: string
    outputPlaceholder: string
    helper: string
    modes: string[]
    signals: string[]
  }> = {
    'regex-tester': {
      badge: 'REGEX',
      statusTitle: 'Pattern debugger',
      statusText: 'Pattern, sample text, match diagnostics, and follow-up refinement in one focused regex bench.',
      panelTitle: 'Match strategy',
      editorTitle: 'Sample text',
      placeholder: 'Paste the text you want to test against the regex pattern...',
      outputPlaceholder: 'Matches, groups, and pattern issues appear here.',
      helper: 'Use global matching by default. Add a pattern in the sidebar, then inspect matched tokens and edge cases.',
      modes: ['Inspect', 'Find matches', 'Explain pattern', 'Generate test cases'],
      signals: ['Global match scan', 'Edge-case review', 'Copy-ready pattern'],
    },
    'sql-formatter': {
      badge: 'SQL',
      statusTitle: 'Query workbench',
      statusText: 'Format, explain, and tune SQL with a database-oriented editor and diagnostics panel.',
      panelTitle: 'Query task',
      editorTitle: 'SQL editor',
      placeholder: 'SELECT customers.id, SUM(total) FROM orders JOIN customers ON ...',
      outputPlaceholder: 'Formatted SQL, query explanation, risks, or optimization notes appear here.',
      helper: 'Designed for query cleanup, readability, joins, indexes, and production review.',
      modes: ['Format', 'Explain query', 'Optimize', 'Find risks'],
      signals: ['Clause structure', 'Join review', 'Index suggestions'],
    },
    'jwt-decoder': {
      badge: 'JWT',
      statusTitle: 'Token inspector',
      statusText: 'Decode headers and payloads with security-focused validation cues.',
      panelTitle: 'Token review',
      editorTitle: 'JWT input',
      placeholder: 'Paste a JWT token...',
      outputPlaceholder: 'Decoded header and payload appear here.',
      helper: 'This decodes client-side only. Treat real tokens as sensitive and avoid sharing secrets.',
      modes: ['Decode', 'Inspect claims', 'Security review', 'Explain token'],
      signals: ['Header payload split', 'Claim inspection', 'Expiry awareness'],
    },
    'markdown-preview': {
      badge: 'MD',
      statusTitle: 'Markdown preview',
      statusText: 'Draft Markdown with responsive preview modes and AI-assisted structure cleanup.',
      panelTitle: 'Preview mode',
      editorTitle: 'Markdown editor',
      placeholder: '# Release notes\n\n- Added...\n- Fixed...',
      outputPlaceholder: 'Preview notes, rewritten Markdown, or structural suggestions appear here.',
      helper: 'Use the viewport selector to think through how docs read across surfaces.',
      modes: ['Preview', 'Clean structure', 'Summarize', 'Make docs-ready'],
      signals: ['Heading hierarchy', 'Link readiness', 'Responsive preview'],
    },
    'color-palette': {
      badge: 'COLOR',
      statusTitle: 'Design token lab',
      statusText: 'Generate palettes as implementation-ready tokens with accessibility guidance.',
      panelTitle: 'Palette goal',
      editorTitle: 'Brand or UI context',
      placeholder: 'Describe the product, brand mood, accessibility needs, and colors to avoid...',
      outputPlaceholder: 'Palette tokens, contrast notes, and usage guidance appear here.',
      helper: 'Great palettes include roles: background, surface, primary, accent, success, warning, and danger.',
      modes: ['Generate palette', 'Check contrast', 'Create tokens', 'Refine mood'],
      signals: ['Token roles', 'Contrast notes', 'Usage mapping'],
    },
    'code-diff': {
      badge: 'DIFF',
      statusTitle: 'Change review',
      statusText: 'Compare code changes with reviewer-style summaries and regression cues.',
      panelTitle: 'Review task',
      editorTitle: 'Before / after code',
      placeholder: 'Paste before and after code separated by --- or describe the change...',
      outputPlaceholder: 'Diff summary, risks, and review notes appear here.',
      helper: 'Paste both versions to get behavior-focused review notes instead of generic comments.',
      modes: ['Review diff', 'Find regression', 'Summarize changes', 'Suggest tests'],
      signals: ['Behavior changes', 'Risk scan', 'Test suggestions'],
    },
  }

  return configs[toolId] || {
    badge: 'DEV',
    statusTitle: 'Code workspace',
    statusText: 'A technical editor-first workflow with execution, diagnostics, and AI follow-up actions.',
    panelTitle: 'Developer task',
    editorTitle: 'Code editor',
    placeholder: 'Paste code, configuration, logs, CSS, HTML, curl, or technical input...',
    outputPlaceholder: 'Formatted output, preview notes, generated command, or diagnostics appear here.',
    helper: 'This workspace is tuned for developer ergonomics: editor first, diagnostics next, follow-up actions always available.',
    modes: ['Inspect', 'Format', 'Debug', 'Generate'],
    signals: ['Syntax-aware pass', 'Copy-ready output', 'Follow-up actions'],
  }
}

function getBusinessWorkbenchConfig(toolId: string) {
  const defaults = {
    badge: 'BIZ',
    statusTitle: 'Strategy dashboard',
    statusText: 'A management-style workspace with KPI controls, projections, workflow lanes, and executive output.',
    panelTitle: 'Strategy controls',
    briefTitle: 'Market context, constraints, and goals',
    placeholder: 'Describe the business, market, audience, pricing, current traction, constraints, and the decision you need to make...',
    outputBrief: 'Return an executive summary, KPI assumptions, projections, risks, and a next-action plan.',
    stages: ['Strategy', 'Planning', 'Launch', 'Optimization'],
    kpis: ['Revenue', 'Conversion', 'CAC', 'Retention', 'Brand Reach'],
    projections: [
      { label: 'Revenue confidence', value: 'Medium', score: 62 },
      { label: 'Execution clarity', value: 'High', score: 78 },
      { label: 'Market risk', value: 'Needs review', score: 42 },
    ],
    lanes: ['Inputs and assumptions', 'Analysis and projections', 'Risks and tradeoffs', 'Next operating actions'],
  }

  const configs: Record<string, Partial<typeof defaults>> = {
    'startup-idea': {
      badge: 'STARTUP',
      statusTitle: 'Opportunity builder',
      panelTitle: 'Venture controls',
      briefTitle: 'Founder brief',
      placeholder: 'Describe your skills, target customers, local problem, budget, unfair advantage, and markets you want to explore...',
      outputBrief: 'Return startup ideas with customer pain, MVP, revenue model, validation tests, and launch plan.',
      stages: ['Ideation', 'Validation', 'MVP', 'Go-to-market'],
      kpis: ['Problem urgency', 'Revenue potential', 'Build effort', 'Market size', 'Validation speed'],
    },
    'swot-generator': {
      badge: 'SWOT',
      statusTitle: 'Decision matrix',
      panelTitle: 'Analysis controls',
      briefTitle: 'Company or project context',
      placeholder: 'Describe the business, competitor pressure, market conditions, internal strengths, weak points, and strategic question...',
      outputBrief: 'Return a SWOT matrix, strategic implications, priority moves, risk mitigations, and KPI tracking.',
      stages: ['Discovery', 'SWOT matrix', 'Prioritization', 'Action plan'],
      kpis: ['Competitive strength', 'Market timing', 'Operational risk', 'Brand moat', 'Execution priority'],
    },
    'market-research': {
      badge: 'MARKET',
      statusTitle: 'Research command center',
      panelTitle: 'Research controls',
      briefTitle: 'Market data and question',
      placeholder: 'Paste notes, survey findings, competitor observations, customer quotes, pricing data, or the market question...',
      outputBrief: 'Return market insights, segments, trends, buyer pains, evidence quality, and recommended next research.',
      stages: ['Data intake', 'Segmentation', 'Insight synthesis', 'Recommendation'],
      kpis: ['Market demand', 'Segment fit', 'Pricing signal', 'Evidence quality', 'Growth potential'],
    },
    'competitor-analyzer': {
      badge: 'COMPETE',
      statusTitle: 'Competitive intelligence',
      panelTitle: 'Competitor controls',
      briefTitle: 'Competitor set and positioning',
      placeholder: 'List competitors, their offers, pricing, content, strengths, weaknesses, customer complaints, and your current positioning...',
      outputBrief: 'Return competitor map, differentiation gaps, pricing opportunities, positioning moves, and counter-strategy.',
      stages: ['Competitor map', 'Gap analysis', 'Positioning', 'Action plan'],
      kpis: ['Differentiation', 'Pricing power', 'Channel strength', 'Threat level', 'Opportunity gap'],
    },
  }

  return { ...defaults, ...(configs[toolId] || {}) }
}

function getTextStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const sentences = text.trim() ? text.split(/[.!?]+/).filter((item) => item.trim()).length : 0
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((item) => item.trim()).length : 0
  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTime: Math.max(1, Math.ceil(words / 220)),
  }
}

function getCompareStats(aText: string, bText: string) {
  const normalize = (text: string) => text.toLowerCase().split(/\W+/).filter(Boolean)
  const a = new Set(normalize(aText))
  const b = new Set(normalize(bText))
  const onlyA = [...a].filter((word) => !b.has(word)).slice(0, 60)
  const onlyB = [...b].filter((word) => !a.has(word)).slice(0, 60)
  const common = [...a].filter((word) => b.has(word)).slice(0, 60)
  const total = new Set([...a, ...b]).size || 1
  return { onlyA, onlyB, common, similarity: Math.round((common.length / total) * 100) }
}

function transformCase(text: string, mode: string) {
  if (mode === 'UPPERCASE') return text.toUpperCase()
  if (mode === 'lowercase') return text.toLowerCase()
  if (mode === 'Title Case') return text.replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
  if (mode === 'Sentence case') return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase())
  if (mode === 'kebab-case') return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (mode === 'snake_case') return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  return text
}

function convertUnit(value: string, mode: string) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return ''
  const conversions: Record<string, (n: number) => string> = {
    'cm -> inches': (n) => `${n} cm = ${(n / 2.54).toFixed(3)} in`,
    'inches -> cm': (n) => `${n} in = ${(n * 2.54).toFixed(3)} cm`,
    'kg -> lb': (n) => `${n} kg = ${(n * 2.20462).toFixed(3)} lb`,
    'lb -> kg': (n) => `${n} lb = ${(n / 2.20462).toFixed(3)} kg`,
    'Celsius -> Fahrenheit': (n) => `${n} C = ${((n * 9) / 5 + 32).toFixed(2)} F`,
    'Fahrenheit -> Celsius': (n) => `${n} F = ${(((n - 32) * 5) / 9).toFixed(2)} C`,
    'km -> miles': (n) => `${n} km = ${(n * 0.621371).toFixed(3)} mi`,
    'miles -> km': (n) => `${n} mi = ${(n / 0.621371).toFixed(3)} km`,
  }
  return conversions[mode]?.(amount) || ''
}

function getUtilityConfig(toolId: string) {
  const defaults = {
    badge: 'UTILITY',
    statusTitle: 'Focused utility bench',
    statusText: 'A precise utility workspace with live metrics, mode-specific controls, and copy-ready output.',
    panelTitle: 'Utility mode',
    editorTitle: 'Input workspace',
    placeholder: 'Paste or type the input for this utility...',
    outputTitle: 'Result',
    outputPlaceholder: 'Run the utility to create a copy-ready result.',
    signalTitle: 'Utility signals',
    helper: 'This workspace is built for fast, repeatable everyday utility work.',
    action: 'Run utility',
    icon: <Play className="mr-2 h-4 w-4" />,
    modes: ['Default'],
    signals: ['Fast input flow', 'Copy-ready result', 'Session-level workflow'],
  }

  const configs: Record<string, Partial<typeof defaults>> = {
    'qr-generator': {
      badge: 'QR',
      statusTitle: 'Payload builder',
      statusText: 'Build scan-ready QR payloads with type modes, reliability checks, preview, and copy actions.',
      panelTitle: 'QR payload type',
      editorTitle: 'QR payload',
      placeholder: 'Paste a URL, Wi-Fi note, contact info, event details, or any text payload...',
      outputTitle: 'QR diagnostics',
      signalTitle: 'Scan readiness',
      helper: 'Short payloads scan faster. Use a short link when the destination URL is long.',
      action: 'Generate QR',
      icon: <QrCode className="mr-2 h-4 w-4" />,
      modes: ['URL', 'Text', 'Contact', 'Wi-Fi', 'Event'],
      signals: ['Payload preview', 'Scan reliability check', 'Download-ready QR image'],
    },
    'unit-converter': {
      badge: 'UNIT',
      statusTitle: 'Conversion cockpit',
      statusText: 'Convert common measurements instantly with clear units and live results.',
      panelTitle: 'Conversion pair',
      outputTitle: 'Converted value',
      helper: 'Choose the conversion pair, enter a number, and the result updates instantly.',
      action: 'Capture conversion',
      icon: <Ruler className="mr-2 h-4 w-4" />,
      modes: ['cm -> inches', 'inches -> cm', 'kg -> lb', 'lb -> kg', 'Celsius -> Fahrenheit', 'Fahrenheit -> Celsius', 'km -> miles', 'miles -> km'],
      signals: ['Live conversion', 'Clear source and target units', 'Copy-ready result'],
    },
    'word-counter': {
      badge: 'WORDS',
      statusTitle: 'Writing meter',
      statusText: 'Measure words, characters, reading time, sentences, and paragraphs in a writing-focused layout.',
      panelTitle: 'Text analysis mode',
      editorTitle: 'Writing canvas',
      placeholder: 'Paste an article, essay, caption, email, or document text...',
      outputTitle: 'Text report',
      action: 'Snapshot counts',
      icon: <Type className="mr-2 h-4 w-4" />,
      modes: ['Full report', 'SEO copy', 'Academic', 'Social post'],
      signals: ['Live word count', 'Reading time estimate', 'Paragraph structure'],
    },
    'char-counter': {
      badge: 'CHARS',
      statusTitle: 'Character inspector',
      statusText: 'Track character limits, whitespace, lines, and compact copy constraints.',
      panelTitle: 'Limit mode',
      editorTitle: 'Text limit canvas',
      placeholder: 'Paste text for a bio, headline, SMS, meta description, or post...',
      outputTitle: 'Character report',
      action: 'Snapshot characters',
      icon: <Type className="mr-2 h-4 w-4" />,
      modes: ['All characters', 'No spaces', 'SMS length', 'Meta description'],
      signals: ['Live character count', 'Whitespace awareness', 'Limit-friendly report'],
    },
    'case-converter': {
      badge: 'CASE',
      statusTitle: 'Text transform lab',
      statusText: 'Convert text into naming, headline, slug, and developer-friendly case formats.',
      panelTitle: 'Case transform',
      editorTitle: 'Source text',
      placeholder: 'Paste names, headings, labels, filenames, or messy casing...',
      outputTitle: 'Transformed text',
      action: 'Transform case',
      icon: <RefreshCw className="mr-2 h-4 w-4" />,
      modes: ['UPPERCASE', 'lowercase', 'Title Case', 'Sentence case', 'kebab-case', 'snake_case'],
      signals: ['Slug-ready output', 'Copy naming cleanup', 'Developer case formats'],
    },
    'text-compare': {
      badge: 'DIFF',
      statusTitle: 'Side-by-side compare',
      statusText: 'Compare two text versions with similarity, unique terms, and shared language.',
      panelTitle: 'Comparison mode',
      outputTitle: 'Difference report',
      action: 'Compare text',
      icon: <GitCompareArrows className="mr-2 h-4 w-4" />,
      modes: ['Word diff', 'Revision review', 'SEO overlap', 'Plagiarism-style scan'],
      signals: ['Side-by-side input', 'Similarity score', 'Unique/common term lists'],
    },
    'uuid-generator': {
      badge: 'UUID',
      statusTitle: 'Identifier factory',
      statusText: 'Generate clean UUID batches for databases, mocks, tests, and records.',
      panelTitle: 'ID batch controls',
      editorTitle: 'Namespace or note',
      placeholder: 'Optional note for what this ID batch is for...',
      outputTitle: 'Generated IDs',
      action: 'Generate UUIDs',
      icon: <RefreshCw className="mr-2 h-4 w-4" />,
      modes: ['UUID v4', 'Database IDs', 'Test fixtures', 'Session keys'],
      signals: ['Batch quantity control', 'Cryptographic browser UUIDs', 'Copy-ready list'],
    },
    'random-generator': {
      badge: 'RANDOM',
      statusTitle: 'Randomization lab',
      statusText: 'Generate number sets with range and quantity controls for sampling, tests, and quick decisions.',
      panelTitle: 'Random output type',
      outputTitle: 'Generated values',
      action: 'Generate values',
      icon: <Shuffle className="mr-2 h-4 w-4" />,
      modes: ['Integer set', 'Raffle numbers', 'Test data', 'Sampling'],
      signals: ['Min/max range', 'Batch output', 'Decision-ready values'],
    },
  }

  return { ...defaults, ...(configs[toolId] || {}) }
}

function getUtilityMetrics(
  toolId: string,
  inputA: string,
  inputB: string,
  textStats: ReturnType<typeof getTextStats>,
  compareStats: ReturnType<typeof getCompareStats>,
  quantity: number,
) {
  if (toolId === 'word-counter' || toolId === 'char-counter') {
    return [
      { label: 'Words', value: String(textStats.words) },
      { label: 'Characters', value: String(textStats.characters) },
      { label: 'Reading', value: `${textStats.readingTime} min` },
      { label: 'Paragraphs', value: String(textStats.paragraphs) },
    ]
  }
  if (toolId === 'text-compare') {
    return [
      { label: 'Similarity', value: `${compareStats.similarity}%` },
      { label: 'Only A', value: String(compareStats.onlyA.length) },
      { label: 'Only B', value: String(compareStats.onlyB.length) },
      { label: 'Common', value: String(compareStats.common.length) },
    ]
  }
  if (toolId === 'random-generator' || toolId === 'uuid-generator') {
    return [
      { label: 'Quantity', value: String(quantity) },
      { label: 'Input A', value: inputA || '-' },
      { label: 'Input B', value: inputB || '-' },
      { label: 'Format', value: toolId === 'uuid-generator' ? 'UUID v4' : 'Integer' },
    ]
  }
  return [
    { label: 'Input chars', value: String(inputA.length) },
    { label: 'Lines', value: String(Math.max(1, inputA.split('\n').length)) },
    { label: 'Mode', value: getUtilityConfig(toolId).modes[0] },
    { label: 'Status', value: inputA ? 'Ready' : 'Waiting' },
  ]
}

function getLiveUtilityOutput(toolId: string, input: string, mode: string, unitResult: string) {
  if (toolId === 'case-converter') return transformCase(input, mode)
  if (toolId === 'unit-converter') return unitResult
  return ''
}

function UtilityTextPanel({
  title,
  value,
  onChange,
  placeholder,
}: {
  title: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">{value.length} chars</span>
      </div>
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-[360px] rounded-xl border-border bg-background/60 text-sm leading-6" placeholder={placeholder} />
    </section>
  )
}

export function UtilityPurposeLayout({ tool }: { tool: Tool }) {
  const config = getUtilityConfig(tool.id)
  const [inputA, setInputA] = useState('')
  const [inputB, setInputB] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState(config.modes[0])
  const [quantity, setQuantity] = useState(5)
  const [qrDataUrl, setQrDataUrl] = useState('')

  const textStats = useMemo(() => getTextStats(inputA), [inputA])
  const compareStats = useMemo(() => getCompareStats(inputA, inputB), [inputA, inputB])
  const unitResult = useMemo(() => convertUnit(inputA, mode), [inputA, mode])

  const run = async () => {
    if (tool.id === 'word-counter' || tool.id === 'char-counter') {
      setOutput(`Words: ${textStats.words}\nCharacters: ${textStats.characters}\nCharacters without spaces: ${textStats.charactersNoSpaces}\nSentences: ${textStats.sentences}\nParagraphs: ${textStats.paragraphs}\nReading time: ${textStats.readingTime} min`)
      return
    }
    if (tool.id === 'case-converter') {
      setOutput(transformCase(inputA, mode))
      return
    }
    if (tool.id === 'text-compare') {
      setOutput(`Similarity: ${compareStats.similarity}%\nOnly in A:\n${compareStats.onlyA.join(', ') || '-'}\n\nOnly in B:\n${compareStats.onlyB.join(', ') || '-'}\n\nCommon terms:\n${compareStats.common.join(', ') || '-'}`)
      return
    }
    if (tool.id === 'uuid-generator') {
      setOutput(Array.from({ length: quantity }, () => crypto.randomUUID()).join('\n'))
      return
    }
    if (tool.id === 'random-generator') {
      const max = Number(inputA) || 100
      const min = Number(inputB) || 1
      setOutput(Array.from({ length: quantity }, () => String(Math.floor(Math.random() * (max - min + 1)) + min)).join('\n'))
      return
    }
    if (tool.id === 'qr-generator') {
      const payload = inputA || 'https://sonkestudio.co.za'
      const nextQr = await QRCode.toDataURL(payload, { margin: 2, width: 320, color: { dark: '#111827', light: '#ffffff' } })
      setQrDataUrl(nextQr)
      setOutput(`QR payload ready:\n${payload}\n\nType: ${mode}\nScan reliability: ${payload.length < 80 ? 'High' : payload.length < 180 ? 'Medium' : 'Use a shorter link for best results'}`)
      return
    }
    if (tool.id === 'unit-converter') {
      setOutput(unitResult || await askAi(tool, `Convert with clear steps: ${inputA}`))
      return
    }
    setOutput(await askAi(tool, `Utility task:\nA:${inputA}\nB:${inputB}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Everyday Utility" eyebrow={config.badge} statusTitle={config.statusTitle} statusText={config.statusText} />
      <div className="mx-auto max-w-[1720px] px-5 pb-10 sm:px-8">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          {getUtilityMetrics(tool.id, inputA, inputB, textStats, compareStats, quantity).map((metric) => (
            <div key={metric.label} className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</p>
              <p className="mt-2 truncate text-xl font-semibold text-foreground">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_380px]">
          <aside className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Utility controls</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{config.panelTitle}</h3>
            </div>
            <div className="grid gap-2">
              {config.modes.map((item) => (
                <button key={item} onClick={() => setMode(item)} className={`rounded-lg border px-3 py-2 text-left text-sm ${mode === item ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-muted-foreground hover:text-foreground'}`}>
                  {item}
                </button>
              ))}
            </div>
            {(tool.id === 'uuid-generator' || tool.id === 'random-generator') && (
              <label className="grid gap-2 text-sm font-medium">
                Quantity: {quantity}
                <input type="range" min={1} max={50} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
              </label>
            )}
            <div className="rounded-xl border border-border bg-background p-3 text-xs leading-5 text-muted-foreground">{config.helper}</div>
            <Button onClick={run} className="w-full">{config.icon}{config.action}</Button>
          </aside>

          <main className="space-y-4">
            {tool.id === 'text-compare' ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <UtilityTextPanel title="Text A" value={inputA} onChange={setInputA} placeholder="Paste the first version..." />
                <UtilityTextPanel title="Text B" value={inputB} onChange={setInputB} placeholder="Paste the second version..." />
              </div>
            ) : tool.id === 'random-generator' ? (
              <section className="rounded-2xl border border-border bg-white p-4">
                <div className="mb-3 grid gap-3 sm:grid-cols-2">
                  <Input value={inputB} onChange={(e) => setInputB(e.target.value)} placeholder="Minimum value" />
                  <Input value={inputA} onChange={(e) => setInputA(e.target.value)} placeholder="Maximum value" />
                </div>
                <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">Generate number sets for quick decisions, testing ranges, raffles, and sampling.</div>
              </section>
            ) : tool.id === 'unit-converter' ? (
              <section className="rounded-2xl border border-border bg-white p-4">
                <label className="grid gap-2 text-sm font-medium">
                  Value to convert
                  <Input value={inputA} onChange={(e) => setInputA(e.target.value)} placeholder="Example: 12" />
                </label>
                <div className="mt-4 rounded-xl border border-border bg-background p-5 font-mono text-lg">{unitResult || 'Choose a conversion mode and enter a number.'}</div>
              </section>
            ) : (
              <UtilityTextPanel title={config.editorTitle} value={inputA} onChange={setInputA} placeholder={config.placeholder} />
            )}

            <section className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{config.outputTitle}</p>
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(output || getLiveUtilityOutput(tool.id, inputA, mode, unitResult))} disabled={!output && !inputA && !unitResult}><Copy className="mr-2 h-4 w-4" />Copy</Button>
              </div>
              <Textarea value={output || getLiveUtilityOutput(tool.id, inputA, mode, unitResult)} onChange={(e) => setOutput(e.target.value)} className="min-h-[240px] rounded-xl border-border bg-background/60 font-mono text-xs" placeholder={config.outputPlaceholder} />
            </section>
          </main>

          <aside className="space-y-4">
            {tool.id === 'qr-generator' && (
              <section className="rounded-2xl border border-border bg-white p-4 text-center">
                <p className="mb-3 text-sm font-semibold text-foreground">QR preview</p>
                <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-background p-4">
                  {qrDataUrl ? <img src={qrDataUrl} alt="Generated QR code" className="h-64 w-64" /> : <QrCode className="h-28 w-28 text-muted-foreground" />}
                </div>
              </section>
            )}
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">{config.signalTitle}</p>
              <div className="space-y-2">
                {config.signals.map((signal) => (
                  <div key={signal} className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Recent result</p>
              <pre className="max-h-[220px] overflow-auto rounded-xl border border-border bg-background p-3 text-xs whitespace-pre-wrap">{output || 'Run the utility to capture a result here.'}</pre>
            </section>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

export function DeveloperPurposeLayout({ tool }: { tool: Tool }) {
  const [input, setInput] = useState('')
  const [pattern, setPattern] = useState('')
  const [output, setOutput] = useState('')
  const [assets, setAssets] = useState<InteractionAsset[]>([])
  const [activeMode, setActiveMode] = useState('Inspect')
  const [previewMode, setPreviewMode] = useState('Desktop')

  const run = async (followUp?: string) => {
    const assetContext = describeAssets(assets)
    const source = [input, assetContext].filter(Boolean).join('\n\n')
    if (tool.id === 'regex-tester') {
      try {
        const re = new RegExp(pattern, 'g')
        const matches = [...input.matchAll(re)].map((m) => m[0])
        setOutput(`Matches (${matches.length}):\n${matches.join('\n') || 'None'}`)
      } catch (e) {
        setOutput(e instanceof Error ? e.message : 'Invalid regex')
      }
      return
    }
    if (tool.id === 'sql-formatter') {
      setOutput(await askAi(tool, `Format and validate SQL:\n${source}`))
      return
    }
    if (tool.id === 'jwt-decoder') {
      const parts = input.split('.')
      if (parts.length < 2) {
        setOutput('Invalid JWT format')
        return
      }
      try {
        const decode = (v: string) => atob(v.replace(/-/g, '+').replace(/_/g, '/'))
        setOutput(`HEADER:\n${decode(parts[0])}\n\nPAYLOAD:\n${decode(parts[1])}`)
      } catch {
        setOutput('Could not decode token.')
      }
      return
    }
    setOutput(await askAi(tool, `Developer tool task for ${tool.name}:\n${followUp ? `Follow-up:${followUp}\n` : ''}${source}`))
  }

  const config = getDeveloperWorkbenchConfig(tool.id)
  const metrics = [
    { label: 'Mode', value: activeMode },
    { label: 'Input lines', value: String(Math.max(1, input.split('\n').length)).padStart(2, '0') },
    { label: 'Output chars', value: String(output.length) },
    { label: 'Workspace', value: config.badge },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Developer Lab" eyebrow={config.badge} statusTitle={config.statusTitle} statusText={config.statusText} />
      <div className="mx-auto max-w-[1720px] px-5 pb-10 sm:px-8">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</p>
              <p className="mt-2 truncate text-lg font-semibold text-foreground">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_380px]">
          <aside className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Workflow</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{config.panelTitle}</h3>
            </div>
            <div className="grid gap-2">
              {config.modes.map((mode) => (
                <button key={mode} onClick={() => setActiveMode(mode)} className={`rounded-lg border px-3 py-2 text-left text-sm ${activeMode === mode ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-muted-foreground hover:text-foreground'}`}>
                  {mode}
                </button>
              ))}
            </div>
            {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
            {tool.id === 'regex-tester' && <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Regex pattern, e.g. \\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b" />}
            <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
              {config.helper}
            </div>
            <Button onClick={() => run(activeMode)} className="w-full"><Play className="mr-2 h-4 w-4" />Run {activeMode}</Button>
          </aside>

          <main className="rounded-2xl border border-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold"><Terminal className="h-4 w-4 text-primary" /> {config.editorTitle}</div>
              {(tool.id === 'markdown-preview' || tool.id === 'html-formatter') && (
                <select value={previewMode} onChange={(e) => setPreviewMode(e.target.value)} className="h-9 rounded-md border border-border bg-background px-3 text-xs">
                  <option>Desktop</option>
                  <option>Tablet</option>
                  <option>Mobile</option>
                </select>
              )}
            </div>
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[540px] resize-none rounded-xl border-border bg-zinc-950 font-mono text-xs leading-5 text-zinc-100" placeholder={config.placeholder} spellCheck={false} />
          </main>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold"><Code2 className="h-4 w-4 text-primary" />Result panel</p>
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}><Copy className="mr-2 h-4 w-4" />Copy</Button>
              </div>
              <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[340px] resize-none rounded-xl border-border bg-zinc-950 font-mono text-xs leading-5 text-zinc-100" placeholder={config.outputPlaceholder} />
            </section>
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Gauge className="h-4 w-4 text-primary" /> Diagnostics</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                {config.signals.map((signal) => (
                  <div key={signal} className="flex items-center gap-2 rounded-lg border border-border bg-background p-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
            </section>
            <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

export function CreatorPurposeLayout({ tool }: { tool: Tool }) {
  const { location } = useLocation()
  const sa = getSAContextSignal(location)
  const [brief, setBrief] = useState('')
  const [platform, setPlatform] = useState('Instagram')
  const [audience, setAudience] = useState('Gen Z')
  const [output, setOutput] = useState('')
  const [assets, setAssets] = useState<InteractionAsset[]>([])

  const run = async (followUp?: string) => {
    setOutput(await askAi(tool, `Creator workflow for ${tool.name}.\nPlatform:${platform}\nAudience:${audience}\n${followUp ? `Follow-up:${followUp}\n` : ''}Brief:${brief}\n${describeAssets(assets)}\nReturn: options + engagement prediction + hook improvements.`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Creator Studio" eyebrow="SOCIAL" statusTitle={`${platform} / ${tool.name}`} statusText="Social-first workflow with trend-aware generation and performance framing." />
      <div className="mx-auto max-w-[1500px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-border bg-white p-4 space-y-2">
          {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2"><option>Instagram</option><option>TikTok</option><option>YouTube</option><option>X</option><option>LinkedIn</option></select>
          <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" />
          <Button onClick={() => run()}>Generate</Button>
          {sa.isSouthAfrica && (
            <div className="rounded-lg border border-border bg-background p-2 text-xs text-muted-foreground">
              SA creator cues: local hashtags, Amapiano culture hooks, Johannesburg audience phrasing.
            </div>
          )}
        </aside>
        <main className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <Textarea value={brief} onChange={(e) => setBrief(e.target.value)} className="min-h-[180px]" placeholder="Campaign/content brief" />
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[280px]" placeholder="Creator output" />
          <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
        </main>
      </div>
    </motion.div>
  )
}

export function BusinessPurposeLayout({ tool }: { tool: Tool }) {
  const { location } = useLocation()
  const sa = getSAContextSignal(location)
  const [context, setContext] = useState('')
  const [kpi, setKpi] = useState('Revenue')
  const [stage, setStage] = useState('Strategy')
  const [budget, setBudget] = useState(25000)
  const [timeframe, setTimeframe] = useState('90 days')
  const [output, setOutput] = useState('')
  const [assets, setAssets] = useState<InteractionAsset[]>([])
  const config = getBusinessWorkbenchConfig(tool.id)
  const run = async (followUp?: string) => {
    setOutput(await askAi(tool, `Business workflow for ${tool.name}.
Stage: ${stage}
Primary KPI: ${kpi}
Budget: ${sa.isSouthAfrica ? 'R' : '$'}${budget}
Timeframe: ${timeframe}
Required output style: ${config.outputBrief}
${followUp ? `Follow-up:${followUp}\n` : ''}Context:${context}
${describeAssets(assets)}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Business Console" eyebrow={config.badge} statusTitle={`${config.statusTitle} / ${kpi}`} statusText={config.statusText} />
      <div className="mx-auto max-w-[1720px] px-5 pb-10 sm:px-8">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          {[
            { label: 'Budget', value: `${sa.isSouthAfrica ? 'R' : '$'}${budget.toLocaleString()}`, icon: BarChart3 },
            { label: 'Timeframe', value: timeframe, icon: LineChart },
            { label: 'Primary KPI', value: kpi, icon: Gauge },
            { label: 'Workflow', value: stage, icon: BriefcaseBusiness },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="rounded-xl border border-border bg-white p-4">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground"><Icon className="h-4 w-4 text-primary" />{item.label}</p>
                <p className="mt-2 truncate text-xl font-semibold text-foreground">{item.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          <aside className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Operating controls</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{config.panelTitle}</h3>
            </div>
            {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
            <label className="grid gap-2 text-sm font-medium">
              Workflow stage
              <select value={stage} onChange={(e) => setStage(e.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm font-normal">
                {config.stages.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Primary KPI
              <select value={kpi} onChange={(e) => setKpi(e.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm font-normal">
                {config.kpis.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Budget
              <input type="range" min={1000} max={250000} step={1000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Timeframe
              <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm font-normal">
                <option>30 days</option><option>90 days</option><option>6 months</option><option>12 months</option>
              </select>
            </label>
            <Button onClick={() => run()} className="w-full"><Sparkles className="mr-2 h-4 w-4" />Run workflow</Button>
            {sa.isSouthAfrica && (
              <div className="rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
                SA business mode active: ZAR pricing, VAT conventions, SME and local market context.
              </div>
            )}
          </aside>

          <main className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Business brief</p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">{config.briefTitle}</h3>
                </div>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">{tool.name}</span>
              </div>
              <Textarea value={context} onChange={(e) => setContext(e.target.value)} className="min-h-[260px] rounded-xl border-border bg-background/60" placeholder={config.placeholder} />
            </section>

            <section className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">Executive output</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => run('Make this more executive-ready with clearer metrics.')}>Executive-ready</Button>
                  <Button variant="outline" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}><Copy className="mr-2 h-4 w-4" />Copy</Button>
                </div>
              </div>
              <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[340px] rounded-xl border-border bg-background/60 font-mono text-xs" placeholder="Business analysis, projections, action plan, and risks appear here." />
            </section>

            <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
          </main>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Projection snapshot</p>
              <div className="space-y-3">
                {config.projections.map((item, index) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>{item.label}</span><span>{item.value}</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, item.score + index * 8)}%` }} /></div>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-border bg-white p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Workflow lanes</p>
              <div className="space-y-2">
                {config.lanes.map((lane) => (
                  <div key={lane} className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">{lane}</div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}

export function ExplainPurposeLayout({ tool }: { tool: Tool }) {
  const { location } = useLocation()
  const sa = getSAContextSignal(location)
  const [thing, setThing] = useState('')
  const [level, setLevel] = useState('Simple')
  const [output, setOutput] = useState('')
  const [assets, setAssets] = useState<InteractionAsset[]>([])
  const run = async (followUp?: string) => {
    setOutput(await askAi(tool, `Explain this in ${level} mode with examples and analogies.\n${followUp ? `Follow-up:${followUp}\n` : ''}${sa.isSouthAfrica ? 'When relevant, include SA context like VAT, SARS, NSFAS, load shedding, matric systems.' : ''}\n${thing}\n${describeAssets(assets)}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Explain Engine" eyebrow="EXPLAIN" statusTitle={`${level} mode`} statusText="Contextual explanation engine with analogy, step-by-step teaching, and follow-up guidance." />
      <div className="mx-auto max-w-[1400px] px-5 pb-10 sm:px-8 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-white p-4 space-y-3">
          {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="h-9 rounded-sm border border-border bg-background px-2"><option>Simple</option><option>Step-by-step</option><option>Advanced</option><option>ELI5</option></select>
          <Textarea value={thing} onChange={(e) => setThing(e.target.value)} className="min-h-[220px]" placeholder="Paste the thing to explain" />
          <Button onClick={() => run()}>Explain</Button>
        </section>
        <section className="rounded-2xl border border-border bg-white p-4 space-y-3">
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[340px]" placeholder="Explanation" />
          <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
        </section>
      </div>
    </motion.div>
  )
}

export function DocumentPurposeLayout({ tool }: { tool: Tool }) {
  const { location } = useLocation()
  const sa = getSAContextSignal(location)
  const [doc, setDoc] = useState('')
  const [mode, setMode] = useState('Analyze')
  const [output, setOutput] = useState('')
  const [assets, setAssets] = useState<InteractionAsset[]>([])
  const fileCount = assets.length
  const run = async (followUp?: string) => {
    setOutput(await askAi(tool, `Document task for ${tool.name}. Mode:${mode}\n${followUp ? `Follow-up:${followUp}\n` : ''}${sa.isSouthAfrica ? 'Use SA-ready conventions where relevant (ZAR, VAT, local legal/business wording).' : ''}\n${doc}\n${describeAssets(assets)}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="Document Specialist" eyebrow="DOC" statusTitle={`${tool.name} / ${mode}`} statusText="Document-specific workflow focused on legal, resume, OCR, and summary analysis." />
      <div className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-8">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          {[
            { label: 'Workspace', value: tool.name },
            { label: 'Mode', value: mode },
            { label: 'Files', value: String(fileCount).padStart(2, '0') },
            { label: 'Region', value: sa.isSouthAfrica ? 'SA aware' : 'Global' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <aside className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">File queue</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">Upload or attach context</h3>
            </div>
            {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Workflow stage</p>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-border bg-white px-3 text-sm">
                <option>Analyze</option>
                <option>Simplify</option>
                <option>Risk flags</option>
                <option>Rewrite</option>
              </select>
            </div>
            <Button onClick={() => run()} className="w-full">Run document workflow</Button>
            <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
              This workspace keeps document logic in one place: upload queue, structured extraction, and follow-up review.
            </div>
          </aside>

          <main className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Document canvas</p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">Paste the text or instructions</h3>
                </div>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">{tool.category}</span>
              </div>
              <Textarea value={doc} onChange={(e) => setDoc(e.target.value)} className="min-h-[250px] rounded-xl border-border bg-background/60" placeholder="Paste document content, clause text, scanned copy notes, or OCR output." />
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border px-2 py-1">Side-by-side preview</span>
                <span className="rounded-full border border-border px-2 py-1">Page and clause awareness</span>
                <span className="rounded-full border border-border px-2 py-1">Copy-ready result</span>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
              <div className="rounded-2xl border border-border bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Analysis output</p>
                  <Button variant="outline" onClick={() => run('Refine the output with clearer headings and a cleaner document focus.')}>Refine</Button>
                </div>
                <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[320px] rounded-xl border-border bg-background/60 font-mono text-xs" placeholder="Document output appears here." />
              </div>
              <div className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-foreground">Document signals</p>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p>• Format scan and extraction flow</p>
                  <p>• Risk flag and rewrite assistance</p>
                  <p>• Summary, simplification, or OCR-style output</p>
                  <p>• Short follow-up prompts for the next pass</p>
                </div>
                <div className="mt-4 rounded-xl border border-border bg-background p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Recent context</p>
                  <div className="mt-2 space-y-2 text-xs text-muted-foreground">
                    {assets.length ? assets.map((asset) => (
                      <div key={`${asset.name}-${asset.url}`} className="rounded-md border border-border bg-white p-2">
                        <p className="truncate font-medium text-foreground">{asset.name}</p>
                        <p className="truncate">{asset.url}</p>
                      </div>
                    )) : <p>No attachments yet.</p>}
                  </div>
                </div>
              </div>
            </section>

            <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
          </main>
        </div>
      </div>
    </motion.div>
  )
}

export function AITextPurposeLayout({ tool }: { tool: Tool }) {
  const { location } = useLocation()
  const sa = getSAContextSignal(location)
  const localizedPrompts = getLocalizedPromptSuggestions(location)
  const [input, setInput] = useState('')
  const [instruction, setInstruction] = useState('Improve clarity')
  const [output, setOutput] = useState('')
  const [assets, setAssets] = useState<InteractionAsset[]>([])
  const [draftMode, setDraftMode] = useState('Conversation')
  const run = async (nextInstruction = instruction) => {
    setOutput(await askAi(tool, `Tool:${tool.name}\nInstruction:${nextInstruction}\nInput:${input}\n${describeAssets(assets)}`))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <ToolWorkspaceHero tool={tool} label="AI Text Copilot" eyebrow="AI TEXT" statusTitle={tool.name} statusText="Purpose-tuned AI text workflow with instruction-driven transformations and iterative refinements." />
      <div className="mx-auto max-w-[1600px] px-5 pb-10 sm:px-8">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          {[
            { label: 'Mode', value: draftMode },
            { label: 'Instruction', value: instruction },
            { label: 'Assets', value: String(assets.length).padStart(2, '0') },
            { label: 'Locale', value: sa.isSouthAfrica ? 'South Africa aware' : 'Global' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          <aside className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Copilot controls</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">Shape the rewrite path</h3>
            </div>
            {shouldShowUpload(tool) && <SmartUploadPanel tool={tool} assets={assets} onAssetsChange={setAssets} compact />}
            <div className="rounded-xl border border-border bg-background p-3 space-y-2">
              <Input value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="Instruction" />
              <select value={draftMode} onChange={(e) => setDraftMode(e.target.value)} className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm">
                <option>Conversation</option>
                <option>Rewrite</option>
                <option>Shorten</option>
                <option>Expand</option>
                <option>Polish</option>
              </select>
              {sa.isSouthAfrica && (
                <select value={instruction} onChange={(e) => setInstruction(e.target.value)} className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm">
                  {sa.toneModes.map((item) => <option key={item}>{item}</option>)}
                </select>
              )}
            </div>
            <div className="grid gap-2">
              <Button onClick={() => run()} className="w-full">Transform</Button>
              <Button variant="outline" onClick={() => run('Give 3 alternative versions')} className="w-full">3 alternatives</Button>
            </div>
            <div className="grid gap-1">
              {localizedPrompts.slice(0, 4).map((item) => (
                <button key={item} onClick={() => setInstruction(item)} className="rounded-md border border-border bg-background px-2 py-2 text-left text-xs text-muted-foreground hover:text-foreground">
                  {item}
                </button>
              ))}
            </div>
          </aside>

          <main className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <section className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-semibold text-foreground">Prompt canvas</p>
                <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="mt-3 min-h-[260px] rounded-xl border-border bg-white" placeholder="Paste the text you want to transform or refine." />
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-border px-2 py-1">Live preview</span>
                  <span className="rounded-full border border-border px-2 py-1">Iterative generation</span>
                  <span className="rounded-full border border-border px-2 py-1">Conversation memory</span>
                </div>
              </section>
              <section className="rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-foreground">Suggestion lane</p>
                <div className="mt-3 space-y-2">
                  {[
                    'Make it more concise',
                    'Sound more human',
                    'Give me a formal version',
                    'Add one strong opening line',
                  ].map((item) => (
                    <button key={item} onClick={() => setInstruction(item)} className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground">
                      {item}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">AI output</p>
                <Button variant="outline" onClick={() => run('Give 3 alternative versions with distinct tones.')}>Refresh variants</Button>
              </div>
              <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="mt-3 min-h-[320px] rounded-xl border-border bg-white font-mono text-xs" placeholder="AI output appears here." />
            </section>

            <ContextualFollowUps tool={tool} output={output} onAction={(action) => run(action)} />
          </main>

          <aside className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Guidance</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">Refinement stack</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Conversational instructions</p>
              <p>• Immediate follow-up rewrites</p>
              <p>• Platform, audience, and tone-aware suggestions</p>
              <p>• Multiple alternatives on demand</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Prompt shortcuts</p>
              <div className="mt-2 grid gap-2">
                {localizedPrompts.slice(0, 5).map((item) => (
                  <button key={item} onClick={() => setInstruction(item)} className="rounded-md border border-border bg-white px-3 py-2 text-left text-xs text-muted-foreground hover:text-foreground">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
