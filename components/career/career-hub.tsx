"use client"

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  FileText,
  GraduationCap,
  Loader2,
  MapPin,
  MessageSquareText,
  Search,
  Send,
  Sparkles,
  Target,
  Video,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CareerOpportunity, careerInterestTracks, southAfricanCareerLocations } from '@/lib/career-opportunities'
import {
  ContextualFollowUps,
  describeAssets,
  InteractionAsset,
  SmartUploadPanel,
} from '@/components/tool-experiences/shared/ai-interaction-panel'
import { tools } from '@/lib/tools-data'

const careerTool = tools.find((tool) => tool.id === 'career-opportunity-hub') || tools.find((tool) => tool.id === 'cv-generator') || tools[0]

type Providers = { jsearch: boolean; adzuna: boolean; adzunaMissing?: string[] }

type SavedApplication = CareerOpportunity & {
  stage: 'Saved' | 'Applied' | 'Interview' | 'Offer'
  note?: string
}

function storageKey(name: string) {
  return `sonke-career-${name}`
}

export function CareerHub() {
  const [query, setQuery] = useState('internship graduate program learnership entry level')
  const [location, setLocation] = useState('South Africa')
  const [country, setCountry] = useState('za')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [salaryMin, setSalaryMin] = useState('')
  const [company, setCompany] = useState('')
  const [activeTrack, setActiveTrack] = useState('coding')
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>([])
  const [selected, setSelected] = useState<CareerOpportunity | null>(null)
  const [saved, setSaved] = useState<SavedApplication[]>([])
  const [assets, setAssets] = useState<InteractionAsset[]>([])
  const [providers, setProviders] = useState<Providers>({ jsearch: false, adzuna: false })
  const [loading, setLoading] = useState(false)
  const [aiOutput, setAiOutput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [showCvContext, setShowCvContext] = useState(false)

  useEffect(() => {
    const savedRaw = window.localStorage.getItem(storageKey('saved'))
    if (savedRaw) setSaved(JSON.parse(savedRaw))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey('saved'), JSON.stringify(saved))
  }, [saved])

  const activeTrackMeta = careerInterestTracks.find((track) => track.id === activeTrack)

  const search = async (nextQuery = query) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        query: nextQuery,
        location,
        country,
        remoteOnly: String(remoteOnly),
        page: '1',
      })
      if (salaryMin) params.set('salaryMin', salaryMin)
      if (company) params.set('company', company)
      const response = await fetch(`/api/career/opportunities?${params}`)
      const data = await response.json()
      setOpportunities(data.opportunities || [])
      setProviders(data.providers || { jsearch: false, adzuna: false })
      setSelected(data.opportunities?.[0] || null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    search(activeTrackMeta?.query || query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const personalized = useMemo(() => {
    const track = activeTrack.toLowerCase()
    return opportunities
      .map((opportunity) => {
        const text = `${opportunity.title} ${opportunity.description} ${opportunity.category}`.toLowerCase()
        const score =
          (text.includes(track) ? 3 : 0) +
          (opportunity.remote ? 2 : 0) +
          (/intern|graduate|learnership|entry|junior/i.test(text) ? 3 : 0) +
          (/south africa|johannesburg|cape town|durban|pretoria|remote africa/i.test(opportunity.location) ? 2 : 0)
        return { opportunity, score }
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.opportunity)
  }, [activeTrack, opportunities])

  const runAi = async (action: string, opportunity = selected) => {
    if (/resume|cv|cover letter|portfolio/i.test(action)) setShowCvContext(true)
    setAiLoading(true)
    try {
      const prompt = `SONKE Career Copilot action: ${action}
Interest track: ${activeTrackMeta?.label || activeTrack}
Search: ${query}
Location: ${location}
Uploaded CV/context:
${describeAssets(assets) || 'None'}

Selected opportunity:
${opportunity ? `${opportunity.title} at ${opportunity.company}
Location: ${opportunity.location}
Description: ${opportunity.description}` : 'None selected'}

Return a practical, encouraging, South Africa-aware response for students, graduates, junior developers, creators, freelancers, or remote workers.`
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'career', text: prompt, toolTitle: 'SONKE Career Copilot' }),
      })
      const data = await response.json()
      setAiOutput(data.result || data.choices?.[0]?.message?.content || data.error || '')
    } finally {
      setAiLoading(false)
    }
  }

  const saveOpportunity = (opportunity: CareerOpportunity) => {
    setSaved((current) => {
      if (current.some((item) => item.id === opportunity.id && item.provider === opportunity.provider)) return current
      return [{ ...opportunity, stage: 'Saved' }, ...current].slice(0, 24)
    })
  }

  const setTrack = (trackId: string) => {
    const track = careerInterestTracks.find((item) => item.id === trackId)
    setActiveTrack(trackId)
    if (track) {
      setQuery(track.query)
      search(track.query)
    }
  }

  const adzunaStatus = providers.adzuna
    ? 'connected'
    : providers.adzunaMissing?.includes('ADZUNA_APP_ID') ? 'needs app id' : 'ready for key'

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-5 pb-8 pt-28 sm:px-8">
        <div className="mx-auto max-w-[1720px]">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[1.2rem] border border-border bg-white p-6 sm:p-8">
              <div className="absolute right-8 top-8 hidden text-[6rem] font-semibold uppercase leading-none text-muted/60 md:block">CAREER</div>
              <div className="relative z-10">
                <p className="flex items-center gap-3 text-sm font-semibold uppercase text-muted-foreground">
                  <span className="h-2.5 w-2.5 bg-primary" />
                  Student Career Ecosystem
                </p>
                <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-none sm:text-7xl">
                  Find the next move, then let AI help you apply.
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
                  Internships, graduate programs, learnerships, junior roles, freelance work, and remote opportunities with South African context built in.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Remote Africa'].map((item) => (
                    <button key={item} onClick={() => { setLocation(item); search(query) }} className="rounded-sm border border-border bg-background px-3 py-2 text-xs font-semibold uppercase text-muted-foreground transition hover:border-primary hover:text-foreground">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="sonke-hero-field relative min-h-[320px] overflow-hidden rounded-[1.2rem] border border-border p-6 text-background">
              <div className="sonke-hero-mesh absolute inset-0" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase text-background/70">Live opportunity graph</span>
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-4xl font-semibold">{personalized.length || opportunities.length || 'AI'} matches</p>
                  <p className="mt-3 text-sm leading-6 text-background/75">
                    JSearch {providers.jsearch ? 'connected' : 'ready for key'} / Adzuna {adzunaStatus} with local fallback signals.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-12 sm:px-8">
        <div className="mx-auto grid max-w-[1720px] gap-5 xl:grid-cols-[360px_minmax(0,1fr)_360px]">
          <aside className="space-y-4 xl:sticky xl:top-28 xl:h-fit">
            <div className="rounded-2xl border border-border bg-white/85 p-4 backdrop-blur">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Search className="h-4 w-4" /> Opportunity Search</p>
              <div className="grid gap-2">
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Role, keyword, category" />
                <Input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company optional" />
                <select value={location} onChange={(event) => setLocation(event.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm">
                  {southAfricanCareerLocations.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select value={country} onChange={(event) => setCountry(event.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm">
                  <option value="za">South Africa</option>
                  <option value="gb">United Kingdom</option>
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                </select>
                <Input value={salaryMin} onChange={(event) => setSalaryMin(event.target.value)} placeholder="Minimum salary optional" />
                <label className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  Remote only
                  <input type="checkbox" checked={remoteOnly} onChange={(event) => setRemoteOnly(event.target.checked)} />
                </label>
                <Button onClick={() => search()} disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Search opportunities</Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white/85 p-4">
              <p className="mb-3 text-sm font-semibold">Personalization</p>
              <div className="grid grid-cols-2 gap-2">
                {careerInterestTracks.map((track) => (
                  <Button key={track.id} variant={activeTrack === track.id ? 'default' : 'outline'} className="h-auto min-h-10 whitespace-normal text-xs" onClick={() => setTrack(track.id)}>
                    {track.label}
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { icon: GraduationCap, label: 'Internships', text: 'Learnerships, graduate programs, junior paths' },
                { icon: FileText, label: 'Apply Smarter', text: 'CV feedback, ATS keywords, cover letters' },
                { icon: MessageSquareText, label: 'Interview Prep', text: 'Questions, tips, company framing' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-white/85 p-4">
                  <item.icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {personalized.map((opportunity, index) => (
                  <motion.article
                    key={`${opportunity.provider}-${opportunity.id}`}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    className={`group rounded-2xl border bg-white/90 p-4 transition hover:-translate-y-1 hover:shadow-[0_28px_80px_-55px_rgba(0,0,0,0.7)] ${selected?.id === opportunity.id ? 'border-primary' : 'border-border'}`}
                  >
                    <button onClick={() => setSelected(opportunity)} className="block w-full text-left">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold uppercase text-muted-foreground">{opportunity.provider}</span>
                            {opportunity.remote && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-emerald-700">Remote</span>}
                            {index < 3 && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase text-primary">Best match</span>}
                          </div>
                          <h2 className="mt-3 text-2xl font-semibold leading-tight">{opportunity.title}</h2>
                          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4" /> {opportunity.company}</span>
                            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {opportunity.location}</span>
                          </p>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{opportunity.description}</p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Button variant="outline" onClick={(event) => { event.stopPropagation(); saveOpportunity(opportunity) }}><Bookmark className="mr-2 h-4 w-4" />Save</Button>
                          {opportunity.url && <Button asChild><a href={opportunity.url} target="_blank" rel="noreferrer">Apply</a></Button>}
                        </div>
                      </div>
                    </button>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </section>

          <aside className="space-y-4 xl:sticky xl:top-28 xl:h-fit">
            <div className="rounded-2xl border border-border bg-white/85 p-4 backdrop-blur">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4" /> Career Copilot</p>
              <div className="grid gap-2">
                {[
                  ['AI Career Suggestions', Target],
                  ['AI Resume Feedback', FileText],
                  ['Generate a Cover Letter', BriefcaseBusiness],
                  ['Prepare Interview Questions', Video],
                ].map(([label, Icon]) => (
                  <Button key={label as string} variant="outline" className="justify-start" onClick={() => runAi(label as string)} disabled={aiLoading}>
                    <Icon className="mr-2 h-4 w-4" />
                    {label as string}
                  </Button>
                ))}
              </div>
              <Button type="button" variant="outline" className="mt-3 w-full justify-start" onClick={() => setShowCvContext((value) => !value)}>
                <FileText className="mr-2 h-4 w-4" />
                {showCvContext ? 'Hide CV context' : 'Add CV or portfolio context'}
              </Button>
              {showCvContext ? (
                <div className="mt-3">
                  <SmartUploadPanel tool={careerTool} assets={assets} onAssetsChange={setAssets} compact />
                </div>
              ) : null}
              <Textarea value={aiOutput} onChange={(event) => setAiOutput(event.target.value)} className="mt-3 min-h-[260px]" placeholder={aiLoading ? 'SONKE Career Copilot is thinking...' : 'AI career guidance appears here.'} />
              {aiLoading ? <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Preparing guidance</p> : null}
              <div className="mt-3">
                <ContextualFollowUps tool={careerTool} output={aiOutput} onAction={(action) => runAi(action)} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white/85 p-4">
              <p className="mb-3 text-sm font-semibold">Saved Tracker</p>
              <div className="space-y-2">
                {saved.length ? saved.slice(0, 6).map((item) => (
                  <button key={`${item.provider}-${item.id}`} onClick={() => setSelected(item)} className="w-full rounded-xl border border-border bg-background p-3 text-left transition hover:border-primary">
                    <p className="line-clamp-1 text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.stage} / {item.company}</p>
                  </button>
                )) : <p className="rounded-xl border border-border bg-background p-3 text-sm text-muted-foreground">Saved roles and applications will appear here.</p>}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
