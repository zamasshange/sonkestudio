"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Loader2, Sparkles } from 'lucide-react'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'

const businessTypes = ['Startup', 'Small business', 'Side hustle', 'Online store', 'Agency', 'Restaurant', 'Nonprofit', 'Personal brand']
const sectors = ['Technology', 'Fashion', 'Food and beverage', 'Beauty', 'Education', 'Finance', 'Health', 'Construction', 'Creative services', 'Retail']
const locations = ['South Africa', 'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Soweto', 'Lagos', 'Nairobi', 'London', 'Global']
const nameStyles = ['Premium', 'Modern', 'Local and warm', 'Short and punchy', 'Luxury', 'Playful', 'Corporate', 'African-inspired']
const audiences = ['Young professionals', 'Students', 'Families', 'Businesses', 'Creators', 'Luxury buyers', 'Local community', 'Global customers']
const checks = ['Domain-friendly', 'Easy to pronounce', 'Works on social media', 'South African market fit', 'Trademark caution notes']

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-none border border-border bg-white px-3 py-2 text-sm font-normal">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

export function BusinessNameGeneratorLayout({ tool }: { tool: Tool }) {
  const [businessType, setBusinessType] = useState('Startup')
  const [sector, setSector] = useState('Technology')
  const [location, setLocation] = useState('South Africa')
  const [style, setStyle] = useState('Modern')
  const [audience, setAudience] = useState('Young professionals')
  const [keywords, setKeywords] = useState('')
  const [mustAvoid, setMustAvoid] = useState('')
  const [selectedChecks, setSelectedChecks] = useState<string[]>(['Domain-friendly', 'Easy to pronounce', 'South African market fit'])
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const toggleCheck = (check: string) => {
    setSelectedChecks((current) =>
      current.includes(check) ? current.filter((item) => item !== check) : [...current, check]
    )
  }

  const generate = async () => {
    setLoading(true)
    setError('')
    setOutput('')

    const prompt = `Generate business names with this brief:
Business type: ${businessType}
Sector: ${sector}
Location or market: ${location}
Style: ${style}
Target audience: ${audience}
Keywords to include or inspire from: ${keywords || 'none'}
Words or ideas to avoid: ${mustAvoid || 'none'}
Checks required: ${selectedChecks.join(', ')}

Return:
- 20 name ideas grouped by style
- Top 5 strongest names with reasoning
- Tagline ideas for the top 5
- Domain/social handle suggestions
- Names to avoid and why
- A quick next-step checklist`

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'business-name',
          text: prompt,
          toolTitle: tool.name,
          toolDescription: tool.description,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Generation failed.')
      setOutput(data.result || data.choices?.[0]?.message?.content || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Business workspace"
        eyebrow="BIZ"
        statusTitle={`${sector} / ${style}`}
        statusText="Shape the brand brief, generate name directions, and review market-fit checks in one workspace."
      />

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-none border border-border bg-white p-6 h-fit">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Brand brief</p>
            <div className="mt-5 grid gap-4">
              <SelectField label="Business type" value={businessType} options={businessTypes} onChange={setBusinessType} />
              <SelectField label="Sector" value={sector} options={sectors} onChange={setSector} />
              <SelectField label="Location or market" value={location} options={locations} onChange={setLocation} />
              <SelectField label="Naming style" value={style} options={nameStyles} onChange={setStyle} />
              <SelectField label="Target audience" value={audience} options={audiences} onChange={setAudience} />
            </div>
          </aside>

          <main className="space-y-6">
            <section className="rounded-none border border-border bg-white p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Keywords, values, or founder story
                  <textarea value={keywords} onChange={(event) => setKeywords(event.target.value)} className="min-h-32 resize-none rounded-none border border-border bg-muted px-4 py-3 text-sm font-normal" placeholder="Example: trust, speed, township innovation, eco-friendly packaging..." />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Avoid these words or vibes
                  <textarea value={mustAvoid} onChange={(event) => setMustAvoid(event.target.value)} className="min-h-32 resize-none rounded-none border border-border bg-muted px-4 py-3 text-sm font-normal" placeholder="Example: no generic tech names, no hard spelling, no corporate tone..." />
                </label>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-foreground">Naming checks</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {checks.map((check) => (
                    <button key={check} onClick={() => toggleCheck(check)} className={`rounded-none border px-3 py-2 text-sm ${selectedChecks.includes(check) ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted-foreground hover:border-primary'}`}>
                      {check}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={generate} disabled={loading} className="rounded-none bg-primary">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate names
                </Button>
              </div>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </section>

            <section className="rounded-none border border-border bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Name studio output</p>
                  <h2 className="mt-2 text-xl font-semibold">{sector} / {location} / {style}</h2>
                </div>
                <Button variant="outline" onClick={copy} disabled={!output} className="rounded-none">
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <div className="mt-5 min-h-[340px] rounded-none border border-border bg-muted p-5 text-sm leading-7 whitespace-pre-wrap">
                {output || 'Your names, taglines, handle ideas, and brand checks will appear here.'}
              </div>
            </section>
          </main>
        </div>
      </div>
    </motion.div>
  )
}
