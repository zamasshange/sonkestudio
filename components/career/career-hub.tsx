"use client"

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  GraduationCap,
  Layers3,
  Loader2,
  MapPin,
  MessageSquareText,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Target,
  UploadCloud,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SafeImage } from '@/components/safe-image'
import {
  CareerOpportunity,
  careerInterestTracks,
  southAfricanCareerLocations,
} from '@/lib/career-opportunities'

type CareerMode = 'discover' | 'internships' | 'cover' | 'resume' | 'tracker'
type SavedApplication = CareerOpportunity & {
  stage: 'Saved' | 'Applied' | 'Interviewing' | 'Offer Received' | 'Rejected'
  note?: string
}

type CareerApiResponse = {
  opportunities?: CareerOpportunity[]
  source?: 'live' | 'fallback'
  providers?: { jsearch: boolean; adzuna: boolean; adzunaMissing?: string[] }
  providerErrors?: { jsearch?: string | null; adzuna?: string | null }
  meta?: {
    page: number
    perPage: number
    returned: number
    providerCounts: { jsearch: number; adzuna: number }
    hasMore: boolean
    refreshedAt?: string
    trends?: {
      locations: [string, number][]
      categories: [string, number][]
      companies: string[]
    }
  }
}

const modes: Array<{ id: CareerMode; label: string; text: string }> = [
  { id: 'discover', label: 'Opportunity Hub', text: 'Live discovery' },
  { id: 'internships', label: 'Internship Finder', text: 'Student pathways' },
  { id: 'cover', label: 'Cover Letter Kit', text: 'AI chat' },
  { id: 'resume', label: 'Resume Feedback', text: 'Upload + score' },
  { id: 'tracker', label: 'Application Tracker', text: 'Kanban workflow' },
]

const stageOrder: SavedApplication['stage'][] = ['Saved', 'Applied', 'Interviewing', 'Offer Received', 'Rejected']

function storageKey(name: string) {
  return `sonke-career-${name}`
}

function formatPostedDate(value?: string) {
  if (!value) return 'Recent'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recent'
  const diff = Math.round((Date.now() - date.getTime()) / 86_400_000)
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 8) return `${diff} days ago`
  return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })
}

function countryFlagUrl(code?: string) {
  const value = (code || 'za').toLowerCase()
  return `https://flagcdn.com/w40/${value}.png`
}

function CompanyMark({ opportunity, size = 'md' }: { opportunity: CareerOpportunity; size?: 'md' | 'lg' }) {
  const dimension = size === 'lg' ? 'h-16 w-16 text-xl' : 'h-12 w-12 text-sm'
  return (
    <SafeImage
      src={opportunity.logoUrl}
      fallbacks={opportunity.logoFallbacks}
      alt={`${opportunity.company} logo`}
      className={`${dimension} shrink-0 rounded-xl border border-border bg-white p-2`}
      imgClassName="object-contain"
      fallbackContent={
        <span className="flex h-full w-full items-center justify-center rounded-lg bg-foreground font-semibold text-background">
          {opportunity.companyInitials || opportunity.company.slice(0, 2).toUpperCase()}
        </span>
      }
    />
  )
}

function Flag({ code }: { code?: string }) {
  return (
    <SafeImage
      src={countryFlagUrl(code)}
      alt={`${code || 'za'} flag`}
      className="h-4 w-6 rounded-sm border border-border bg-white"
      imgClassName="object-cover"
      fallbackContent={<span className="block h-full w-full bg-primary/20" />}
    />
  )
}

function OpportunityCard({
  opportunity,
  index,
  selected,
  onSelect,
  onSave,
  compact = false,
}: {
  opportunity: CareerOpportunity
  index: number
  selected?: boolean
  onSelect: () => void
  onSave: () => void
  compact?: boolean
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      className={`group border bg-white/92 transition hover:-translate-y-1 hover:shadow-[0_30px_90px_-62px_rgba(0,0,0,.8)] ${selected ? 'border-primary' : 'border-border'} ${compact ? 'rounded-xl p-4' : 'rounded-2xl p-5'}`}
    >
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className="flex items-start gap-4">
          <CompanyMark opportunity={opportunity} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold uppercase text-muted-foreground">
                {opportunity.source || opportunity.provider}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-semibold uppercase text-muted-foreground">
                <Flag code={opportunity.countryCode || opportunity.country} />
                {opportunity.countryCode || opportunity.country || 'ZA'}
              </span>
              {opportunity.remote ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase text-emerald-700">Remote</span> : null}
              {index < 4 ? <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase text-primary">Fresh signal</span> : null}
            </div>
            <h3 className={`${compact ? 'text-lg' : 'text-2xl'} mt-3 font-semibold leading-tight text-foreground`}>
              {opportunity.title}
            </h3>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{opportunity.company}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {opportunity.location}</span>
              <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {formatPostedDate(opportunity.postedAt)}</span>
              {opportunity.salary ? <span className="inline-flex items-center gap-1"><Wallet className="h-4 w-4" /> {opportunity.salary}</span> : null}
            </p>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{opportunity.description || 'Open the listing for the full brief and application details.'}</p>
          </div>
        </div>
      </button>
      <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" onClick={onSave}><Bookmark className="mr-2 h-4 w-4" />Save</Button>
        {opportunity.url ? (
          <Button asChild>
            <a href={opportunity.url} target="_blank" rel="noreferrer">Apply <ExternalLink className="ml-2 h-4 w-4" /></a>
          </Button>
        ) : null}
      </div>
    </motion.article>
  )
}

export function CareerHub({
  initialMode = 'discover',
  initialQuery = 'internship graduate program learnership entry level',
  initialLocation = 'South Africa',
}: {
  initialMode?: CareerMode
  initialQuery?: string
  initialLocation?: string
}) {
  const [mode, setMode] = useState<CareerMode>(initialMode)
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const [country, setCountry] = useState('za')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [company, setCompany] = useState('')
  const [activeTrack, setActiveTrack] = useState('internships')
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>([])
  const [selected, setSelected] = useState<CareerOpportunity | null>(null)
  const [saved, setSaved] = useState<SavedApplication[]>([])
  const [meta, setMeta] = useState<CareerApiResponse['meta']>()
  const [providers, setProviders] = useState<CareerApiResponse['providers']>({ jsearch: false, adzuna: false })
  const [source, setSource] = useState<'live' | 'fallback'>('fallback')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [aiOutput, setAiOutput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [resumeFiles, setResumeFiles] = useState<File[]>([])
  const [resumeScore, setResumeScore] = useState(76)

  useEffect(() => {
    const tool = new URLSearchParams(window.location.search).get('tool') as CareerMode | null
    if (tool && modes.some((item) => item.id === tool)) setMode(tool)
  }, [])

  useEffect(() => {
    const savedRaw = window.localStorage.getItem(storageKey('saved'))
    if (savedRaw) setSaved(JSON.parse(savedRaw))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey('saved'), JSON.stringify(saved))
  }, [saved])

  const search = async (
    nextQuery = query,
    options: { page?: number; append?: boolean; location?: string; remoteOnly?: boolean; company?: string; seed?: number } = {},
  ) => {
    const targetPage = options.page || 1
    const append = Boolean(options.append)
    if (append) setLoadingMore(true)
    else setLoading(true)
    try {
      const params = new URLSearchParams({
        query: nextQuery,
        location: options.location ?? location,
        country,
        remoteOnly: String(options.remoteOnly ?? remoteOnly),
        page: String(targetPage),
        perPage: '20',
        seed: String(options.seed ?? Math.floor(Date.now() / 300000)),
      })
      const nextCompany = options.company ?? company
      if (nextCompany) params.set('company', nextCompany)
      const response = await fetch(`/api/career/opportunities?${params}`, { cache: 'no-store' })
      const data: CareerApiResponse = await response.json()
      const nextOpportunities = data.opportunities || []
      setOpportunities((current) => {
        if (!append) return nextOpportunities
        const seen = new Set(current.map((item) => `${item.provider}-${item.id}`))
        return [...current, ...nextOpportunities.filter((item) => !seen.has(`${item.provider}-${item.id}`))]
      })
      setProviders(data.providers || { jsearch: false, adzuna: false })
      setSource(data.source || 'fallback')
      setMeta(data.meta)
      setPage(data.meta?.page || targetPage)
      setHasMore(data.meta?.hasMore ?? nextOpportunities.length > 0)
      if (!append) setSelected(nextOpportunities[0] || null)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    search()
    const timer = window.setInterval(() => {
      search(query, { page: 1, seed: Math.floor(Date.now() / 60000) })
    }, 120000)
    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const internships = useMemo(
    () => opportunities.filter((item) => /intern|learnership|graduate|student|bursary/i.test(`${item.title} ${item.description} ${item.category}`)),
    [opportunities],
  )
  const remoteJobs = useMemo(() => opportunities.filter((item) => item.remote), [opportunities])
  const featured = opportunities[0]

  const saveOpportunity = (opportunity: CareerOpportunity) => {
    setSaved((current) => {
      if (current.some((item) => item.provider === opportunity.provider && item.id === opportunity.id)) return current
      return [{ ...opportunity, stage: 'Saved' }, ...current].slice(0, 40)
    })
  }

  const updateStage = (item: SavedApplication, stage: SavedApplication['stage']) => {
    setSaved((current) => current.map((entry) => entry.provider === item.provider && entry.id === item.id ? { ...entry, stage } : entry))
  }

  const runAi = async (action: string, opportunity = selected) => {
    setAiLoading(true)
    try {
      const prompt = `SONKE Career AI: ${action}
Role: ${opportunity?.title || 'No selected role'}
Company: ${opportunity?.company || 'Unknown'}
Location: ${opportunity?.location || location}
Job brief: ${opportunity?.description || 'Use South African early-career context.'}
Return a practical, polished, job-ready response.`
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'career', text: prompt, toolTitle: 'SONKE Career Kit' }),
      })
      const data = await response.json()
      setAiOutput(data.result || data.choices?.[0]?.message?.content || data.error || '')
    } finally {
      setAiLoading(false)
    }
  }

  const analyzeResume = (files: File[]) => {
    setResumeFiles(files)
    const bump = Math.min(14, files.reduce((sum, file) => sum + Math.min(5, Math.round(file.size / 100000)), 0))
    setResumeScore(72 + bump)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-5 pb-8 pt-28 sm:px-8">
        <div className="mx-auto max-w-[1720px]">
          <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[1.2rem] border border-border bg-white p-6 sm:p-8">
              <p className="flex items-center gap-3 text-sm font-semibold uppercase text-muted-foreground">
                <span className="h-2.5 w-2.5 bg-primary" />
                SONKE Career Ecosystem
              </p>
              <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-none sm:text-7xl">
                Live opportunities, AI application help, and career momentum.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
                Built for South African students, graduates, junior talent, and remote builders. JSearch and Adzuna feed the discovery layer while AI helps you apply with confidence.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {southAfricanCareerLocations.map((item) => (
                  <button key={item} onClick={() => { setLocation(item); search(query, { location: item, page: 1 }) }} className="rounded-sm border border-border bg-background px-3 py-2 text-xs font-semibold uppercase text-muted-foreground transition hover:border-primary hover:text-foreground">
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="sonke-hero-field relative min-h-[380px] overflow-hidden rounded-[1.2rem] border border-border p-6 text-background">
              <div className="sonke-hero-mesh absolute inset-0" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase text-background/70">Live opportunity graph</span>
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-5xl font-semibold">{opportunities.length || 'AI'} roles</p>
                  <p className="mt-3 text-sm leading-6 text-background/75">
                    JSearch {providers?.jsearch ? 'connected' : 'offline'} / Adzuna {providers?.adzuna ? 'connected' : 'offline'} / {source === 'live' ? 'live feed' : 'fallback active'}
                  </p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {(meta?.trends?.categories || []).slice(0, 4).map(([label, count]) => (
                      <span key={label} className="rounded-sm border border-background/15 bg-background/5 px-3 py-2 text-xs font-semibold uppercase text-background/70">
                        {label} / {count}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-background/55">Refreshed {formatPostedDate(meta?.refreshedAt)}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-5 grid gap-2 md:grid-cols-5">
            {modes.map((item) => (
              <button key={item.id} onClick={() => setMode(item.id)} className={`rounded-xl border p-4 text-left transition ${mode === item.id ? 'border-foreground bg-foreground text-background' : 'border-border bg-white hover:border-primary'}`}>
                <span className="text-sm font-semibold">{item.label}</span>
                <span className={`mt-1 block text-xs ${mode === item.id ? 'text-background/60' : 'text-muted-foreground'}`}>{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-[1720px]">
          <AnimatePresence mode="wait">
            {mode === 'discover' && (
              <motion.div key="discover" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)_360px]">
                <SearchRail query={query} setQuery={setQuery} company={company} setCompany={setCompany} location={location} setLocation={setLocation} country={country} setCountry={setCountry} remoteOnly={remoteOnly} setRemoteOnly={setRemoteOnly} loading={loading} search={search} activeTrack={activeTrack} setActiveTrack={setActiveTrack} />
                <OpportunityFeed loading={loading} opportunities={opportunities} selected={selected} setSelected={setSelected} saveOpportunity={saveOpportunity} page={page} hasMore={hasMore} loadingMore={loadingMore} search={search} query={query} />
                <InsightRail selected={selected} saved={saved} remoteJobs={remoteJobs} runAi={runAi} aiLoading={aiLoading} aiOutput={aiOutput} />
              </motion.div>
            )}

            {mode === 'internships' && (
              <InternshipFinder key="internships" internships={internships} loading={loading} selected={selected} setSelected={setSelected} saveOpportunity={saveOpportunity} search={search} />
            )}

            {mode === 'cover' && (
              <CoverLetterKit key="cover" selected={selected} opportunities={opportunities} setSelected={setSelected} aiOutput={aiOutput} setAiOutput={setAiOutput} aiLoading={aiLoading} runAi={runAi} />
            )}

            {mode === 'resume' && (
              <ResumeFeedback key="resume" files={resumeFiles} score={resumeScore} analyzeResume={analyzeResume} runAi={runAi} aiLoading={aiLoading} aiOutput={aiOutput} />
            )}

            {mode === 'tracker' && (
              <ApplicationTracker key="tracker" saved={saved} updateStage={updateStage} setSelected={setSelected} setMode={setMode} />
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}

function SearchRail(props: {
  query: string
  setQuery: (value: string) => void
  company: string
  setCompany: (value: string) => void
  location: string
  setLocation: (value: string) => void
  country: string
  setCountry: (value: string) => void
  remoteOnly: boolean
  setRemoteOnly: (value: boolean) => void
  loading: boolean
  search: (query?: string, options?: any) => void
  activeTrack: string
  setActiveTrack: (value: string) => void
}) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-28 xl:h-fit">
      <div className="rounded-2xl border border-border bg-white/90 p-4 backdrop-blur">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold"><Search className="h-4 w-4" /> Live Search</p>
        <div className="grid gap-2">
          <Input value={props.query} onChange={(event) => props.setQuery(event.target.value)} placeholder="Role, keyword, category" />
          <Input value={props.company} onChange={(event) => props.setCompany(event.target.value)} placeholder="Company optional" />
          <select value={props.location} onChange={(event) => props.setLocation(event.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm">
            {southAfricanCareerLocations.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={props.country} onChange={(event) => props.setCountry(event.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm">
            <option value="za">South Africa</option>
            <option value="gb">United Kingdom</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
          </select>
          <label className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm">
            Remote only
            <input type="checkbox" checked={props.remoteOnly} onChange={(event) => props.setRemoteOnly(event.target.checked)} />
          </label>
          <Button onClick={() => props.search(props.query, { page: 1 })} disabled={props.loading}>
            {props.loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Search opportunities
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white/90 p-4">
        <p className="mb-3 text-sm font-semibold">Mzansi Career Tracks</p>
        <div className="grid gap-2">
          {careerInterestTracks.map((track) => (
            <Button
              key={track.id}
              variant={props.activeTrack === track.id ? 'default' : 'outline'}
              className="h-auto min-h-10 justify-start whitespace-normal text-left text-xs"
              onClick={() => { props.setActiveTrack(track.id); props.setQuery(track.query); props.search(track.query, { page: 1 }) }}
            >
              {track.label}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}

function OpportunityFeed(props: {
  loading: boolean
  opportunities: CareerOpportunity[]
  selected: CareerOpportunity | null
  setSelected: (value: CareerOpportunity) => void
  saveOpportunity: (value: CareerOpportunity) => void
  page: number
  hasMore: boolean
  loadingMore: boolean
  search: (query?: string, options?: any) => void
  query: string
}) {
  return (
    <section className="space-y-4">
      {props.loading && props.opportunities.length === 0 ? (
        <div className="grid gap-3">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-44 animate-pulse rounded-2xl border border-border bg-white" />)}
        </div>
      ) : null}
      <AnimatePresence mode="popLayout">
        {props.opportunities.map((opportunity, index) => (
          <OpportunityCard
            key={`${opportunity.provider}-${opportunity.id}`}
            opportunity={opportunity}
            index={index}
            selected={props.selected?.id === opportunity.id}
            onSelect={() => props.setSelected(opportunity)}
            onSave={() => props.saveOpportunity(opportunity)}
          />
        ))}
      </AnimatePresence>
      <div className="rounded-2xl border border-border bg-white/90 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Page <span className="font-semibold text-foreground">{props.page}</span> / fresh results rotate as providers update.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" disabled={props.page <= 1 || props.loading} onClick={() => props.search(props.query, { page: Math.max(1, props.page - 1) })}><ChevronLeft className="mr-2 h-4 w-4" />Previous</Button>
            <Button variant="outline" disabled={!props.hasMore || props.loading} onClick={() => props.search(props.query, { page: props.page + 1 })}>Next<ChevronRight className="ml-2 h-4 w-4" /></Button>
            <Button disabled={!props.hasMore || props.loadingMore} onClick={() => props.search(props.query, { page: props.page + 1, append: true })}>
              {props.loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Layers3 className="mr-2 h-4 w-4" />}
              Load more
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function InsightRail({ selected, saved, remoteJobs, runAi, aiLoading, aiOutput }: {
  selected: CareerOpportunity | null
  saved: SavedApplication[]
  remoteJobs: CareerOpportunity[]
  runAi: (action: string, opportunity?: CareerOpportunity | null) => void
  aiLoading: boolean
  aiOutput: string
}) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-28 xl:h-fit">
      {selected ? (
        <div className="rounded-2xl border border-border bg-white/90 p-4">
          <div className="flex items-start gap-4">
            <CompanyMark opportunity={selected} size="lg" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-muted-foreground">{selected.source || selected.provider}</p>
              <h2 className="mt-1 line-clamp-3 text-2xl font-semibold leading-tight">{selected.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{selected.company}</p>
            </div>
          </div>
          <p className="mt-4 max-h-[220px] overflow-y-auto whitespace-pre-line text-sm leading-6 text-muted-foreground">{selected.description}</p>
          <div className="mt-4 grid gap-2">
            <Button variant="outline" onClick={() => runAi('Create a targeted cover letter for this role', selected)}><FileText className="mr-2 h-4 w-4" />AI cover letter</Button>
            <Button variant="outline" onClick={() => runAi('Prepare interview questions and answers', selected)}><MessageSquareText className="mr-2 h-4 w-4" />Interview prep</Button>
          </div>
        </div>
      ) : null}
      <div className="rounded-2xl border border-border bg-white/90 p-4">
        <p className="text-sm font-semibold">Live Side Signals</p>
        <div className="mt-3 grid gap-2">
          <span className="rounded-xl border border-border bg-background p-3 text-sm">{remoteJobs.length} remote-friendly roles detected</span>
          <span className="rounded-xl border border-border bg-background p-3 text-sm">{saved.length} saved applications</span>
          <span className="rounded-xl border border-border bg-background p-3 text-sm">{aiLoading ? 'AI is preparing guidance' : aiOutput ? 'AI guidance ready' : 'Career AI standing by'}</span>
        </div>
      </div>
    </aside>
  )
}

function InternshipFinder({ internships, loading, selected, setSelected, saveOpportunity, search }: {
  internships: CareerOpportunity[]
  loading: boolean
  selected: CareerOpportunity | null
  setSelected: (value: CareerOpportunity) => void
  saveOpportunity: (value: CareerOpportunity) => void
  search: (query?: string, options?: any) => void
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-3xl border border-border bg-foreground p-6 text-background sm:p-8">
        <p className="text-sm font-semibold uppercase text-background/55">Student pathway radar</p>
        <h2 className="mt-5 text-5xl font-semibold leading-none">Internships, learnerships, graduate openings.</h2>
        <p className="mt-5 text-sm leading-7 text-background/70">A focused feed for students and early-career builders, with urgency cues and application rhythm.</p>
        <div className="mt-6 grid gap-3">
          {['Applications open now', 'Save reminders', 'Graduate friendly', 'South Africa first'].map((item) => (
            <span key={item} className="flex items-center gap-3 rounded-xl border border-background/15 bg-background/5 p-3 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" />{item}</span>
          ))}
        </div>
        <Button className="mt-6" onClick={() => search('internship learnership graduate programme bursary South Africa', { page: 1 })}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh student feed
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {internships.map((item, index) => (
          <div key={`${item.provider}-${item.id}`} className="relative overflow-hidden rounded-2xl border border-border bg-white p-4">
            <div className="absolute right-4 top-4 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {index < 3 ? 'Apply soon' : `${7 + index} day window`}
            </div>
            <OpportunityCard opportunity={item} index={index} selected={selected?.id === item.id} onSelect={() => setSelected(item)} onSave={() => saveOpportunity(item)} compact />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-muted-foreground">
              <span className="rounded-lg bg-background p-2"><Clock3 className="mx-auto mb-1 h-4 w-4 text-primary" />Deadline watch</span>
              <span className="rounded-lg bg-background p-2"><Bell className="mx-auto mb-1 h-4 w-4 text-primary" />Reminder</span>
              <span className="rounded-lg bg-background p-2"><GraduationCap className="mx-auto mb-1 h-4 w-4 text-primary" />Student fit</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function CoverLetterKit({ selected, opportunities, setSelected, aiOutput, setAiOutput, aiLoading, runAi }: {
  selected: CareerOpportunity | null
  opportunities: CareerOpportunity[]
  setSelected: (value: CareerOpportunity) => void
  aiOutput: string
  setAiOutput: (value: string) => void
  aiLoading: boolean
  runAi: (action: string, opportunity?: CareerOpportunity | null) => void
}) {
  const prompts = ['Make it more professional', 'Shorten this', 'Make it ATS-friendly', 'Add confidence', 'Rewrite for remote jobs']
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="rounded-3xl border border-border bg-white p-4">
        <p className="mb-3 text-sm font-semibold">Choose a live listing</p>
        <div className="grid max-h-[720px] gap-2 overflow-y-auto">
          {opportunities.slice(0, 12).map((item) => (
            <button key={`${item.provider}-${item.id}`} onClick={() => setSelected(item)} className={`rounded-xl border p-3 text-left transition ${selected?.id === item.id ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'}`}>
              <p className="line-clamp-2 text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.company}</p>
            </button>
          ))}
        </div>
      </aside>
      <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-3xl border border-border bg-foreground p-5 text-background">
          <p className="text-sm font-semibold uppercase text-background/55">Conversational career kit</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">Chat your way to a tailored cover letter.</h2>
          <div className="mt-6 rounded-2xl border border-background/15 bg-background/5 p-4">
            <p className="text-sm text-background/65">Selected role</p>
            <p className="mt-2 text-2xl font-semibold">{selected?.title || 'Pick a live opportunity'}</p>
            <p className="mt-2 text-sm text-background/65">{selected?.company}</p>
          </div>
          <div className="mt-5 grid gap-2">
            <Button onClick={() => runAi('Generate a polished cover letter', selected)} disabled={aiLoading}>
              {aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate cover letter
            </Button>
            {prompts.map((prompt) => (
              <Button key={prompt} variant="outline" className="border-background/20 bg-background/5 text-background hover:bg-background hover:text-foreground" onClick={() => runAi(prompt, selected)}>{prompt}</Button>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-white p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Live editing preview</p>
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(aiOutput)}><Copy className="mr-2 h-4 w-4" />Copy</Button>
          </div>
          <Textarea value={aiOutput} onChange={(event) => setAiOutput(event.target.value)} className="min-h-[560px] resize-none text-sm leading-7" placeholder="Your AI-generated cover letter will appear here." />
        </div>
      </section>
    </motion.div>
  )
}

function ResumeFeedback({ files, score, analyzeResume, runAi, aiLoading, aiOutput }: {
  files: File[]
  score: number
  analyzeResume: (files: File[]) => void
  runAi: (action: string) => void
  aiLoading: boolean
  aiOutput: string
}) {
  const checks = ['ATS headings detected', 'Quantified achievements', 'Keyword match', 'Readable formatting', 'Contact details clear']
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl border border-dashed border-primary/45 bg-white p-6">
        <label className="flex min-h-[360px] cursor-pointer flex-col items-center justify-center rounded-2xl bg-background p-8 text-center transition hover:bg-white">
          <UploadCloud className="h-12 w-12 text-primary" />
          <p className="mt-4 text-3xl font-semibold">Drop your CV here</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">PDF, DOCX, or screenshot. This is the only career tool where uploads belong.</p>
          <input type="file" multiple accept=".pdf,.doc,.docx,image/*" className="sr-only" onChange={(event) => analyzeResume(Array.from(event.target.files || []))} />
        </label>
        <div className="mt-4 grid gap-2">
          {files.map((file) => (
            <span key={file.name} className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-sm">
              {file.name}
              <span className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-border bg-white p-6">
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <div className="flex aspect-square flex-col items-center justify-center rounded-full border-[14px] border-primary bg-background">
            <span className="text-5xl font-semibold">{score}</span>
            <span className="text-xs font-semibold uppercase text-muted-foreground">ATS score</span>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-muted-foreground">Resume intelligence</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight">Professional feedback, section by section.</h2>
            <Button className="mt-5" disabled={aiLoading} onClick={() => runAi('Review this CV for ATS, formatting, keywords, readability, and South African job readiness')}>
              {aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Run AI resume review
            </Button>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {checks.map((check, index) => (
            <div key={check} className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold">{check}</p>
              <div className="mt-3 h-2 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(96, score - index * 8)}%` }} />
              </div>
            </div>
          ))}
        </div>
        {aiOutput ? <div className="mt-5 rounded-2xl border border-border bg-background p-4 text-sm leading-7 text-muted-foreground">{aiOutput}</div> : null}
      </div>
    </motion.div>
  )
}

function ApplicationTracker({ saved, updateStage, setSelected, setMode }: {
  saved: SavedApplication[]
  updateStage: (item: SavedApplication, stage: SavedApplication['stage']) => void
  setSelected: (value: CareerOpportunity) => void
  setMode: (value: CareerMode) => void
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
      <div className="mb-5 flex flex-col gap-3 rounded-3xl border border-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-muted-foreground">Application operating system</p>
          <h2 className="mt-2 text-4xl font-semibold">Track every opportunity from saved to offer.</h2>
        </div>
        <Button onClick={() => setMode('discover')}><Search className="mr-2 h-4 w-4" />Find more roles</Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-5">
        {stageOrder.map((stage) => {
          const items = saved.filter((item) => item.stage === stage)
          return (
            <section key={stage} className="min-h-[460px] rounded-2xl border border-border bg-white p-3">
              <div className="mb-3 flex items-center justify-between rounded-xl bg-background p-3">
                <p className="text-sm font-semibold">{stage}</p>
                <span className="text-xs font-semibold text-muted-foreground">{items.length}</span>
              </div>
              <div className="grid gap-3">
                {items.map((item) => (
                  <article key={`${item.provider}-${item.id}`} className="rounded-xl border border-border bg-background p-3">
                    <div className="flex items-start gap-3">
                      <CompanyMark opportunity={item} />
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold">{item.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.company}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2">
                      <select value={item.stage} onChange={(event) => updateStage(item, event.target.value as SavedApplication['stage'])} className="h-9 rounded-md border border-border bg-white px-2 text-xs">
                        {stageOrder.map((option) => <option key={option}>{option}</option>)}
                      </select>
                      <Button variant="outline" size="sm" onClick={() => { setSelected(item); setMode('cover') }}>Prepare application</Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </motion.div>
  )
}
