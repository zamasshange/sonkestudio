"use client"

import Image from 'next/image'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check, Search, Sparkles, Star, TrendingUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MyDeskBanner } from '@/components/auth/my-desk-banner'
import { filterToolsForUser, getPersonalizedLeadTools, sortToolsForUser } from '@/lib/filter-tools'
import { useLocation } from '@/hooks/use-location'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import {
  categories,
  getToolsByCategory,
  newTools,
  searchTools,
  Tool,
  tools,
  trendingTools,
} from '@/lib/tools-data'
import faviconImage from '@/app/images/favicon.png'

const categoryVisuals: Record<string, { tint: string; mark: string; pattern: string }> = {
  'ai-text': { tint: 'from-violet-500/20 via-white to-primary/20', mark: 'AI', pattern: 'Prompt / Rewrite / Polish' },
  student: { tint: 'from-sky-500/20 via-white to-cyan-400/20', mark: 'ST', pattern: 'Learn / Practice / Review' },
  document: { tint: 'from-emerald-500/20 via-white to-teal-400/20', mark: 'DOC', pattern: 'Upload / Extract / Export' },
  creator: { tint: 'from-rose-500/20 via-white to-orange-400/20', mark: 'CR', pattern: 'Hook / Caption / Publish' },
  everyday: { tint: 'from-amber-500/20 via-white to-primary/20', mark: 'UT', pattern: 'Fast / Clean / Useful' },
  developer: { tint: 'from-slate-500/20 via-white to-zinc-400/20', mark: 'DEV', pattern: '{ format: true }' },
  business: { tint: 'from-indigo-500/20 via-white to-blue-400/20', mark: 'BIZ', pattern: 'Plan / Pitch / Decide' },
  career: { tint: 'from-blue-500/20 via-white to-emerald-400/20', mark: 'JOB', pattern: 'Search / Save / Apply' },
  explain: { tint: 'from-fuchsia-500/20 via-white to-pink-400/20', mark: 'WHY', pattern: 'Paste / Decode / Understand' },
}

const reveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const grid: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
}

const trendingSearches = ['Currency Converter', 'Time Zone', 'AI Humanizer', 'PDF to Word', 'CV Generator']

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold uppercase text-muted-foreground">
      <span className="h-2.5 w-2.5 bg-primary" />
      {children}
    </div>
  )
}

function ToolVisual({ tool, featured = false }: { tool: Tool; featured?: boolean }) {
  const Icon = tool.icon
  const CategoryIcon = categories.find((category) => category.id === tool.category)?.icon || Icon
  const visual = categoryVisuals[tool.category] || categoryVisuals.everyday
  const isBrandIcon = Boolean(tool.iconColor)
  const iconFilter = tool.id === 'tiktok-hook'
    ? 'drop-shadow(-1.2px 0 #00F2EA) drop-shadow(1.2px 0 #FF0050)'
    : undefined

  return (
    <div className={`relative shrink-0 overflow-hidden ${featured ? 'h-40' : 'h-28'} bg-gradient-to-br ${visual.tint}`}>
      <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(15,23,42,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.08)_1px,transparent_1px)] [background-size:26px_26px]" />
      {!isBrandIcon && (
        <motion.div
          className="absolute -right-12 top-6 opacity-15"
          animate={{ x: [0, -18, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon className={featured ? 'h-40 w-40' : 'h-32 w-32'} strokeWidth={1.25} />
        </motion.div>
      )}
      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-sm bg-white/85 px-3 py-2 text-xs font-semibold uppercase text-muted-foreground shadow-sm">
            <CategoryIcon className="h-3.5 w-3.5 text-primary" />
            {visual.mark}
          </span>
          <span
            className={`inline-flex h-12 w-12 items-center justify-center ${
              isBrandIcon ? 'bg-transparent text-foreground' : 'rounded-sm border border-black/5 bg-white text-foreground shadow-sm'
            }`}
            style={{
              background: isBrandIcon ? undefined : tool.iconBg,
              color: tool.iconColor,
            }}
          >
            <Icon className={isBrandIcon ? 'h-9 w-9' : 'h-6 w-6'} style={{ filter: iconFilter }} />
          </span>
        </div>
        <div>
          <p className="max-w-[240px] text-sm font-semibold text-foreground">{tool.name}</p>
          <p className="mt-1 max-w-[240px] font-mono text-xs text-muted-foreground">{visual.pattern}</p>
          <div className="mt-4 flex gap-1.5">
            {tool.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolCard({ tool, index, featured = false }: { tool: Tool; index: number; featured?: boolean }) {
  const Icon = tool.icon

  return (
    <motion.div
      layout
      variants={reveal}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 18, transition: { duration: 0.2 } }}
    >
      <Link href={tool.href} className="group block h-full">
        <motion.article
          whileHover={{ y: -8 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`relative flex h-full min-h-[315px] flex-col overflow-hidden rounded-md border border-border bg-white avoora-soft-shadow ${
            featured ? 'lg:min-h-[365px]' : ''
          }`}
        >
          <div className="relative">
            <ToolVisual tool={tool} featured={featured} />
            <div className="absolute bottom-4 right-4 flex gap-2">
              {tool.trending && (
                <span className="inline-flex items-center gap-1 rounded-sm bg-white px-2.5 py-1.5 text-xs font-semibold text-foreground">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  Hot
                </span>
              )}
              {tool.new && (
                <span className="inline-flex items-center gap-1 rounded-sm bg-white px-2.5 py-1.5 text-xs font-semibold text-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  New
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <span
                className={`inline-flex h-12 w-12 items-center justify-center ${
                  tool.iconColor ? 'bg-transparent text-foreground' : 'rounded-sm border border-black/5 bg-muted text-foreground'
                }`}
                style={{
                  background: tool.iconColor ? undefined : tool.iconBg,
                  color: tool.iconColor,
                }}
              >
                <Icon className={tool.iconColor ? 'h-9 w-9' : 'h-6 w-6'} style={{ filter: tool.id === 'tiktok-hook' ? 'drop-shadow(-1.2px 0 #00F2EA) drop-shadow(1.2px 0 #FF0050)' : undefined }} />
              </span>
              <span className="text-sm text-muted-foreground">({String(index + 1).padStart(2, '0')})</span>
            </div>

            <h3 className="mt-5 min-h-[56px] text-xl font-semibold leading-tight text-foreground line-clamp-2">{tool.name}</h3>
            <p className="mt-2 min-h-[48px] line-clamp-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>

            <div className="mt-auto flex items-center justify-between border-t border-border pt-5 text-sm font-semibold text-foreground">
              <span>{tool.usageCount?.toLocaleString() ?? 'Live'} uses</span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-foreground text-background transition group-hover:bg-primary">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  )
}

function CategoryPanel({
  category,
  active,
  index,
  onClick,
}: {
  category: (typeof categories)[number]
  active: boolean
  index: number
  onClick: () => void
}) {
  const Icon = category.icon
  const count = getToolsByCategory(category.id).length

  return (
    <motion.button
      layout
      onClick={onClick}
      className={`group flex h-[300px] w-full flex-col overflow-hidden rounded-md border border-border p-5 text-left transition ${
        active ? 'bg-foreground text-background' : 'bg-white text-foreground hover:bg-muted'
      }`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between">
        <span className={active ? 'text-background/70' : 'text-muted-foreground'}>SERVICE</span>
        <span className={active ? 'text-background/70' : 'text-muted-foreground'}>({String(index + 1).padStart(2, '0')})</span>
      </div>
      <div className="mt-auto flex items-end justify-between gap-6">
        <div className="min-w-0">
          <Icon className={`mb-5 h-8 w-8 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
          <h3 className="min-h-[78px] max-w-[230px] text-3xl font-semibold leading-tight line-clamp-2">{category.name}</h3>
          <p className={`mt-3 text-sm ${active ? 'text-background/70' : 'text-muted-foreground'}`}>{count} tools</p>
        </div>
        <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1" />
      </div>
    </motion.button>
  )
}

export default function ToolsPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category')
  const deskParam = searchParams.get('desk')
  const { prefs, hasDesk, persona } = useUserPreferences()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory)
  const [showMyDesk, setShowMyDesk] = useState(deskParam === '1' || Boolean(hasDesk))
  const { location, season } = useLocation()

  useEffect(() => {
    setActiveCategory(searchParams.get('category'))
    if (searchParams.get('desk') === '1') {
      setShowMyDesk(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (hasDesk && deskParam === '1') {
      setShowMyDesk(true)
    }
  }, [hasDesk, deskParam])

  const filteredTools = useMemo(() => {
    let result = tools

    if (searchQuery.trim()) {
      result = searchTools(searchQuery)
    } else if (showMyDesk && hasDesk && prefs && !activeCategory) {
      result = filterToolsForUser(result, prefs)
    }

    if (activeCategory) {
      result = result.filter((tool) => tool.category === activeCategory)
    }

    // Smart-sort when browsing (not actively searching)
    if (!searchQuery.trim()) {
      result = sortToolsForUser(result, { location, season, prefs })
    }

    return result
  }, [activeCategory, searchQuery, showMyDesk, hasDesk, prefs, location, season])

  const leadTools = useMemo(() => {
    return getPersonalizedLeadTools(tools, { location, season, prefs }, 8)
  }, [location, season, prefs])
  const activeCategoryName = categories.find((category) => category.id === activeCategory)?.name

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!activeCategory && (
        <section className="px-5 pb-10 pt-32 sm:px-8">
          <motion.div initial="hidden" animate="visible" variants={grid} className="mx-auto max-w-[1720px]">
            <motion.div variants={reveal} className="grid gap-5 lg:grid-cols-[1fr_0.95fr] lg:items-stretch">
              <div className="flex min-h-[430px] flex-col justify-between rounded-xl border border-border bg-white p-6 sm:p-8">
                <SectionLabel>Tools Workspace</SectionLabel>
                <div>
                  <h1 className="mt-7 text-6xl font-semibold leading-[0.9] sm:text-7xl lg:text-8xl">
                    {showMyDesk && hasDesk ? 'My Desk' : 'All Tools'}
                  </h1>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                    {showMyDesk && hasDesk
                      ? `Showing ${persona?.label ?? 'your'} systems first. Switch filters anytime or browse everything.`
                      : 'Find the right tool by real task category, then jump into a purpose-built workspace.'}
                  </p>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { value: `${tools.length}+`, label: 'live tools' },
                    { value: categories.length.toString(), label: 'systems' },
                    { value: 'Role-based', label: 'smart sorting' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-border bg-background p-4">
                      <p className="text-3xl font-semibold leading-none text-foreground">{stat.value}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5">
                <div className="overflow-hidden rounded-xl border border-border bg-foreground text-background">
                  <div className="grid min-h-[250px] sm:grid-cols-[0.88fr_1.12fr]">
                    <div className="relative flex items-center justify-center overflow-hidden border-b border-background/15 bg-background/5 p-8 sm:border-b-0 sm:border-r">
                      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.10)_1px,transparent_1px)] [background-size:28px_28px]" />
                      <div className="relative flex h-36 w-36 items-center justify-center rounded-xl border border-primary/45 bg-background/5">
                        <Image src={faviconImage} alt="SONKE favicon" className="h-20 w-20 object-contain" priority />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between p-6">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-background/55">Directory Mode</p>
                        <p className="mt-4 text-4xl font-semibold leading-tight">
                          Search the job, open the right workspace.
                        </p>
                      </div>
                      <div className="mt-6 grid gap-2">
                        {['No account wall', 'Real task categories', 'Popular tools first'].map((item) => (
                          <span key={item} className="flex items-center gap-2 text-sm font-medium text-background/80">
                            <Check className="h-4 w-4 text-primary" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.slice(0, 6).map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-white p-4 text-left transition hover:border-primary/50 hover:bg-background"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon className="h-5 w-5 shrink-0 text-primary" />
                          <span className="truncate text-sm font-semibold text-foreground">{category.name}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div variants={reveal} className="mt-5 min-w-0 overflow-hidden border border-border bg-white">
              <div className="grid min-w-0 lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
                <div className="relative min-w-0 overflow-hidden p-5 sm:p-6">
                  <div className="relative z-10">
                    <p className="mb-4 text-sm font-semibold uppercase text-muted-foreground">Find the exact workspace</p>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search 100+ tools..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="h-16 rounded-sm border-border bg-background pl-14 pr-12 text-lg focus:border-primary"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-sm bg-white text-muted-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">Trending:</span>
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="rounded-sm border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-foreground hover:text-foreground"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  </div>
                </div>

                <div className="min-w-0 border-t border-border bg-background p-5 xl:border-l xl:border-t-0">
                  <p className="text-sm font-semibold uppercase text-muted-foreground">Hot shortcuts</p>
                  <div className="mt-4 grid gap-2">
                    {trendingTools.slice(0, 3).map((tool, index) => {
                      const Icon = tool.icon
                      return (
                        <Link key={tool.id} href={tool.href} className="group flex items-center justify-between gap-3 border border-border bg-white p-3 transition hover:border-primary/50">
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                            <Icon className="h-4 w-4 shrink-0 text-primary" style={{ color: tool.iconColor }} />
                            <span className="truncate text-sm font-semibold text-foreground">{tool.name}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      )}

      <section className={`border-y border-border bg-white px-5 py-7 sm:px-8 ${activeCategory ? 'pt-32' : ''}`}>
        <div className="mx-auto max-w-[1720px]">
          <MyDeskBanner
            activeCategory={activeCategory}
            onClearCategory={() => setActiveCategory(null)}
            showMyDesk={showMyDesk}
            onToggleMyDesk={setShowMyDesk}
            className="mb-5"
          />
        </div>
        <div className="mx-auto flex max-w-[1720px] gap-4 overflow-x-auto pb-3">
          <motion.button
            layout
            onClick={() => setActiveCategory(null)}
            whileHover={{ y: -4 }}
            className={`flex h-[300px] min-w-[320px] flex-col rounded-md border border-border p-5 text-left transition ${
              !activeCategory ? 'bg-foreground text-background' : 'bg-background text-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={!activeCategory ? 'text-background/70' : 'text-muted-foreground'}>INDEX</span>
              <span className={!activeCategory ? 'text-background/70' : 'text-muted-foreground'}>(00)</span>
            </div>
            <div className="mt-auto">
              <h3 className="text-4xl font-semibold">All Tools</h3>
              <p className={`mt-3 text-sm ${!activeCategory ? 'text-background/70' : 'text-muted-foreground'}`}>
                {tools.length} total workspaces
              </p>
            </div>
          </motion.button>

          {categories.map((category, index) => (
            <div key={category.id} className="min-w-[320px]">
              <CategoryPanel
                category={category}
                index={index}
                active={activeCategory === category.id}
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-[1720px]">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionLabel>{searchQuery || activeCategory ? 'Filtered results' : 'Popular in South Africa'}</SectionLabel>
              <h2 className="mt-5 text-5xl font-semibold leading-tight sm:text-7xl">
                {searchQuery || activeCategory ? `${filteredTools.length} result${filteredTools.length === 1 ? '' : 's'}` : 'Start with the tools people actually need.'}
              </h2>
              {activeCategoryName && <p className="mt-4 text-lg text-muted-foreground">Showing {activeCategoryName}</p>}
            </div>

            {(activeCategory || searchQuery) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory(null)
                }}
                className="h-12 rounded-sm border-border bg-white px-6"
              >
                Clear filters
              </Button>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {filteredTools.length > 0 ? (
              <motion.div
                key={`${activeCategory ?? 'all'}-${searchQuery || 'browse'}`}
                variants={grid}
                initial="hidden"
                animate="visible"
                className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
              >
                {(searchQuery || activeCategory ? filteredTools : leadTools).map((tool, index) => (
                  <ToolCard key={`${tool.id}-${index}`} tool={tool} index={index} featured={index < 2 && !searchQuery && !activeCategory} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md border border-border bg-white p-12 text-center"
              >
                <Search className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-6 text-3xl font-semibold">No tools found</h3>
                <p className="mt-3 text-muted-foreground">Try a broader search or clear the selected system.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {!searchQuery && !activeCategory && (
        <section className="bg-white px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-[1720px]">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <SectionLabel>New arrivals</SectionLabel>
                <h2 className="mt-5 text-5xl font-semibold sm:text-7xl">Fresh tools in the system.</h2>
              </div>
              <Star className="hidden h-12 w-12 text-primary sm:block" />
            </div>

            <motion.div variants={grid} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {newTools.map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index + 8} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {!searchQuery && !activeCategory && (
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-[1720px]">
            <div className="mb-10">
              <SectionLabel>Browse by category</SectionLabel>
              <h2 className="mt-5 text-5xl font-semibold sm:text-7xl">Every system has its own job.</h2>
            </div>

            <div className="grid gap-12">
              {categories.map((category, categoryIndex) => {
                const categoryTools = getToolsByCategory(category.id)
                const Icon = category.icon
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.65, delay: categoryIndex * 0.04 }}
                    className="border-t border-border pt-8"
                  >
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-sm bg-white">
                          <Icon className="h-7 w-7 text-primary" />
                        </span>
                        <div>
                          <h3 className="text-3xl font-semibold">{category.name}</h3>
                          <p className="text-muted-foreground">{categoryTools.length} tools for {category.description.toLowerCase()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveCategory(category.id)}
                        className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-foreground"
                      >
                        View all <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                      {categoryTools.slice(0, 4).map((tool, index) => (
                        <ToolCard key={tool.id} tool={tool} index={index + categoryIndex} />
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
