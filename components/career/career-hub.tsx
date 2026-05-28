"use client"

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  GraduationCap,
  Loader2,
  MapPin,
  MessageSquareText,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Video,
  Wallet,
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
type ProviderErrors = { jsearch?: string | null; adzuna?: string | null }

type CareerApiResponse = {
  opportunities?: CareerOpportunity[]
  providers?: Providers
  providerErrors?: ProviderErrors
  source?: 'live' | 'fallback'
  meta?: {
    page: number
    perPage: number
    returned: number
    providerCounts: { jsearch: number; adzuna: number }
    hasMore: boolean
  }
}

type SavedApplication = CareerOpportunity & {
  stage: 'Saved' | 'Applied' | 'Interview' | 'Offer'
  note?: string
}

function storageKey(name: string) {
  return `sonke-career-${name}`
}

function formatPostedDate(value?: string) {
  if (!value) return 'Recent'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recent'
  return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function CompanyMark({ opportunity, size = 'md' }: { opportunity: CareerOpportunity; size?: 'md' | 'lg' }) {
  const [failed, setFailed] = useState(false)
  const dimension = size === 'lg' ? 'h-16 w-16 text-xl' : 'h-12 w-12 text-sm'

  if (opportunity.logoUrl && !failed) {
    return (
      <span className={`${dimension} flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-2`}>
        <img src={opportunity.logoUrl} alt={`${opportunity.company} logo`} className="h-full w-full object-contain" onError={() => setFailed(true)} />
      </span>
    )
  }

  return (
    <span className={`${dimension} flex shrink-0 items-center justify-center rounded-xl border border-border bg-foreground font-semibold text-background`}>
      {opportunity.companyInitials || opportunity.company.slice(0, 2).toUpperCase()}
    </span>
  )
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
  const [providerErrors, setProviderErrors] = useState<ProviderErrors>({})
  const [source, setSource] = useState<'live' | 'fallback'>('fallback')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
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

  const search = async (
    nextQuery = query,
    options: {
      page?: number
      append?: boolean
      location?: string
      country?: string
      remoteOnly?: boolean
      salaryMin?: string
      company?: string
    } = {},
  ) => {
    const targetPage = options.page || 1
    const append = Boolean(options.append)
    if (append) setLoadingMore(true)
    else setLoading(true)
    try {
      const params = new URLSearchParams({
        query: nextQuery,
        location: options.location ?? location,
        country: options.country ?? country,
        remoteOnly: String(options.remoteOnly ?? remoteOnly),
        page: String(targetPage),
        perPage: '20',
      })
      const nextSalary = options.salaryMin ?? salaryMin
      const nextCompany = options.company ?? company
      if (nextSalary) params.set('salaryMin', nextSalary)
      if (nextCompany) params.set('company', nextCompany)
      const response = await fetch(`/api/career/opportunities?${params}`)
      const data: CareerApiResponse = await response.json()
      const nextOpportunities = data.opportunities || []
      setOpportunities((current) => {
        if (!append) return nextOpportunities
        const seen = new Set(current.map((item) => `${item.provider}-${item.id}`))
        return [...current, ...nextOpportunities.filter((item) => !seen.has(`${item.provider}-${item.id}`))]
      })
      setProviders(data.providers || { jsearch: false, adzuna: false })
      setProviderErrors(data.providerErrors || {})
      setSource(data.source || 'fallback')
      setPage(data.meta?.page || targetPage)
      setHasMore(data.meta?.hasMore ?? nextOpportunities.length > 0)
      if (!append) setSelected(nextOpportunities[0] || null)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    search(activeTrackMeta?.query || query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const personalized = useMemo(() => {
    const trackTerms = `${activeTrackMeta?.label || activeTrack} ${activeTrackMeta?.query || ''}`.toLowerCase().split(/\W+/).filter((term) => term.length > 3)
    return opportunities
      .map((opportunity) => {
        const text = `${opportunity.title} ${opportunity.description} ${opportunity.category}`.toLowerCase()
        const score =
          (trackTerms.some((term) => text.includes(term)) ? 3 : 0) +
          (opportunity.remote ? 2 : 0) +
          (/intern|graduate|learnership|bursary|entry|junior|admin|retail|call centre|government/i.test(text) ? 3 : 0) +
          (/south africa|johannesburg|cape town|durban|pretoria|remote africa/i.test(opportunity.location) ? 2 : 0)
        return { opportunity, score }
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.opportunity)
  }, [activeTrack, activeTrackMeta, opportunities])

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
      search(track.query, { page: 1 })
    }
  }

  const adzunaStatus = providers.adzuna
    ? 'connected'
    : providers.adzunaMissing?.includes('ADZUNA_APP_ID') ? 'needs app id' : 'ready for key'
  const providerHealth = [
    `JSearch ${providers.jsearch ? 'connected' : 'not configured'}`,
    `Adzuna ${adzunaStatus}`,
    source === 'live' ? `${opportunities.length} live signals loaded` : 'fallback signal active',
  ]

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
                    <button key={item} onClick={() => { setLocation(item); search(query, { location: item, page: 1 }) }} className="rounded-sm border border-border bg-background px-3 py-2 text-xs font-semibold uppercase text-muted-foreground transition hover:border-primary hover:text-foreground">
                      {item}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['NSFAS-aware', 'Learnerships', 'Bursaries', 'Government', 'Remote SA'].map((item) => (
                    <span key={item} className="rounded-full border border-border bg-muted/45 px-3 py-1.5 text-xs font-semibold uppercase text-muted-foreground">
                      {item}
                    </span>
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
                  <div className="mt-4 grid gap-2">
                    {providerHealth.map((item) => (
                      <span key={item} className="rounded-sm border border-background/15 bg-background/5 px-3 py-2 text-xs font-semibold uppercase text-background/65">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-12 sm:px-8">
        <div className="mx-auto grid max-w-[1720px] gap-5 xl:grid-cols-[360px_minmax(0,1fr)_360px]">
          <aside className="space-y-4 xl:sticky xl:top-28 xl:h-fit">
            {selected ? (
              <div className="rounded-2xl border border-border bg-white/90 p-4 backdrop-blur">
                <div className="flex items-start gap-4">
                  <CompanyMark opportunity={selected} size="lg" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">{selected.source || selected.provider}</p>
                    <h2 className="mt-1 line-clamp-3 text-2xl font-semibold leading-tight">{selected.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{selected.company}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"><MapPin className="h-4 w-4 text-primary" /> {selected.location}</span>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"><BriefcaseBusiness className="h-4 w-4 text-primary" /> {selected.employmentType || 'Opportunity'}</span>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"><CalendarDays className="h-4 w-4 text-primary" /> {formatPostedDate(selected.postedAt)}</span>
                  {selected.salary && <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2"><Wallet className="h-4 w-4 text-primary" /> {selected.salary}</span>}
                </div>

                <div className="mt-4 rounded-xl border border-border bg-background p-3">
                  <p className="text-sm font-semibold">Full opportunity brief</p>
                  <p className="mt-2 max-h-[280px] overflow-y-auto whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {selected.description || 'No detailed description was provided by the source. Use the apply link for the full listing.'}
                  </p>
                </div>

                <div className="mt-4 grid gap-2">
                  {selected.url && (
                    <Button asChild>
                      <a href={selected.url} target="_blank" rel="noreferrer">Apply now <ExternalLink className="ml-2 h-4 w-4" /></a>
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => runAi('Create a targeted cover letter for this opportunity', selected)}>
                    <FileText className="mr-2 h-4 w-4" />
                    AI cover letter
                  </Button>
                  <Button variant="outline" onClick={() => runAi('Prepare interview questions and answers for this opportunity', selected)}>
                    <Video className="mr-2 h-4 w-4" />
                    Interview prep
                  </Button>
                </div>
              </div>
            ) : null}

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
                <Button onClick={() => search(query, { page: 1 })} disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Search opportunities</Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white/85 p-4">
              <p className="mb-3 text-sm font-semibold">Mzansi Personalization</p>
              <div className="grid gap-2">
                {careerInterestTracks.map((track) => (
                  <Button key={track.id} variant={activeTrack === track.id ? 'default' : 'outline'} className="h-auto min-h-10 justify-start whitespace-normal text-left text-xs" onClick={() => setTrack(track.id)}>
                    {track.label}
                  </Button>
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { icon: GraduationCap, label: 'Internships + Learnerships', text: 'SETA pathways, graduate programs, junior roles' },
                { icon: TrendingUp, label: 'Bursaries + Digital Skills', text: 'Student funding signals, tech, admin, creator paths' },
                { icon: MessageSquareText, label: 'AI Career Prep', text: 'CV feedback, interview prep, cover letters' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-white/85 p-4">
                  <item.icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>

            {(providerErrors.jsearch || providerErrors.adzuna) && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="flex items-center gap-2 font-semibold"><AlertCircle className="h-4 w-4" /> One provider is temporarily delayed</p>
                <p className="mt-2 text-xs leading-5 text-amber-800">
                  SONKE is still showing live opportunities from available sources while the delayed provider retries in the background.
                </p>
              </div>
            )}

            <div className="grid gap-3">
              {loading && opportunities.length === 0 ? (
                <div className="grid gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse rounded-2xl border border-border bg-white/80 p-4">
                      <div className="h-4 w-40 rounded bg-muted" />
                      <div className="mt-4 h-7 w-3/4 rounded bg-muted" />
                      <div className="mt-3 h-4 w-1/2 rounded bg-muted" />
                      <div className="mt-5 h-12 rounded bg-muted/70" />
                    </div>
                  ))}
                </div>
              ) : null}

              {!loading && personalized.length === 0 ? (
                <div className="rounded-2xl border border-border bg-white/90 p-8 text-center">
                  <Search className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h2 className="mt-4 text-2xl font-semibold">No opportunities found yet</h2>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Try South Africa, Johannesburg, remote work, learnerships, bursaries, or graduate programmes.
                  </p>
                  <Button className="mt-5" onClick={() => search('internship learnership graduate programme South Africa', { page: 1 })}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry with local signals
                  </Button>
                </div>
              ) : null}

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
                        <div className="flex min-w-0 gap-4">
                          <CompanyMark opportunity={opportunity} />
                          <div className="min-w-0">
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold uppercase text-muted-foreground">{opportunity.source || opportunity.provider}</span>
                            {opportunity.remote && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-emerald-700">Remote</span>}
                            {index < 3 && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase text-primary">Best match</span>}
                            {/learnership|bursary|graduate|intern/i.test(`${opportunity.title} ${opportunity.description}`) && <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-sky-700">Youth pathway</span>}
                          </div>
                          <h2 className="mt-3 text-2xl font-semibold leading-tight">{opportunity.title}</h2>
                          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4" /> {opportunity.company}</span>
                            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {opportunity.location}</span>
                            <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {formatPostedDate(opportunity.postedAt)}</span>
                            {opportunity.salary && <span className="inline-flex items-center gap-1"><Wallet className="h-4 w-4" /> {opportunity.salary}</span>}
                          </p>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{opportunity.description}</p>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Button variant="outline" onClick={(event) => { event.stopPropagation(); saveOpportunity(opportunity) }}><Bookmark className="mr-2 h-4 w-4" />Save</Button>
                          {opportunity.url && <Button asChild><a href={opportunity.url} target="_blank" rel="noreferrer">Apply <ExternalLink className="ml-2 h-4 w-4" /></a></Button>}
                        </div>
                      </div>
                    </button>
                  </motion.article>
                ))}
              </AnimatePresence>

              {personalized.length > 0 ? (
                <div className="rounded-2xl border border-border bg-white/90 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Page <span className="font-semibold text-foreground">{page}</span> / Browse more internships, learnerships, remote roles, bursaries, and junior jobs.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" disabled={page <= 1 || loading} onClick={() => search(query, { page: Math.max(1, page - 1) })}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      {[Math.max(1, page - 1), page, page + 1].filter((item, index, arr) => arr.indexOf(item) === index).map((item) => (
                        <Button key={item} variant={item === page ? 'default' : 'outline'} disabled={loading || loadingMore} onClick={() => search(query, { page: item })}>
                          {item}
                        </Button>
                      ))}
                      <Button variant="outline" disabled={!hasMore || loading} onClick={() => search(query, { page: page + 1 })}>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button disabled={!hasMore || loadingMore} onClick={() => search(query, { page: page + 1, append: true })}>
                        {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                        Load more
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
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
