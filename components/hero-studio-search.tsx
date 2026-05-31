"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BriefcaseBusiness, Grid2X2, Search, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { searchStudio, studioSearchHref, type StudioSearchHit } from '@/lib/studio-search'
import { useLocation } from '@/hooks/use-location'
import { isSouthAfricanUser } from '@/lib/sa-intelligence'

const quickPrompts = [
  'PDF to Word',
  'CV Generator',
  'Internships South Africa',
  'AI Humanizer',
  'Currency Converter',
]

type HeroStudioSearchProps = {
  className?: string
  compact?: boolean
}

function HitIcon({ hit }: { hit: StudioSearchHit }) {
  if (hit.type === 'tool') {
    const Icon = hit.tool.icon
    return (
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#ddd9d5] bg-white"
        style={{ color: hit.tool.iconColor }}
      >
        <Icon className={hit.tool.iconColor ? 'h-5 w-5' : 'h-4 w-4'} />
      </span>
    )
  }
  if (hit.type === 'career') {
    return (
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#ddd9d5] bg-white text-primary">
        <BriefcaseBusiness className="h-4 w-4" />
      </span>
    )
  }
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#ddd9d5] bg-white text-foreground">
      <Grid2X2 className="h-4 w-4" />
    </span>
  )
}

function hitLabel(hit: StudioSearchHit) {
  if (hit.type === 'tool') return hit.tool.name
  return hit.label
}

function hitDescription(hit: StudioSearchHit) {
  if (hit.type === 'tool') return hit.tool.description
  if (hit.type === 'career') return 'Career Hub · live opportunity search'
  return hit.description
}

function hitHref(hit: StudioSearchHit) {
  if (hit.type === 'tool') return hit.tool.href
  return hit.href
}

export function HeroStudioSearch({ className = '', compact = false }: HeroStudioSearchProps) {
  const router = useRouter()
  const { location } = useLocation()
  const isSA = isSouthAfricanUser(location)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => searchStudio(query, 7), [query])
  const showPanel = open && query.trim().length > 0

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const submit = (value = query) => {
    const trimmed = value.trim()
    if (!trimmed) return
    setOpen(false)
    router.push(studioSearchHref(trimmed))
  }

  const selectHit = (hit: StudioSearchHit) => {
    setOpen(false)
    router.push(hitHref(hit))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, Math.max(0, results.length - 1)))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      if (results[activeIndex]) selectHit(results[activeIndex])
      else submit()
      return
    }
    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const localizedPrompts = isSA
    ? ['Internships South Africa', 'CAPS study tools', 'ZAR invoice', 'SA ID validator', ...quickPrompts.slice(0, 2)]
    : quickPrompts

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.48, duration: 0.55, ease: 'easeOut' }}
      className={`relative z-20 max-w-[640px] ${compact ? 'mt-4' : 'mt-6'} ${className}`}
    >
      <div
        className={`overflow-hidden rounded-xl border bg-[#f0ece8]/95 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.55)] transition ${
          showPanel ? 'border-background/40 ring-2 ring-primary/35' : 'border-[#ddd9d5]/80'
        }`}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
          <Search className="h-4 w-4 shrink-0 text-foreground/55" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={isSA ? 'Search tools, careers, or workflows…' : 'Search tools and workflows…'}
            aria-label="Search SONKE Studio"
            aria-expanded={showPanel}
            aria-controls="hero-studio-search-results"
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-foreground/45 focus:outline-none sm:text-base"
          />
          <button
            type="button"
            onClick={() => submit()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-background transition hover:bg-foreground/90"
          >
            Search
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <AnimatePresence>
          {showPanel && (
            <motion.div
              id="hero-studio-search-results"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[#ddd9d5]/80 bg-white"
            >
              {results.length ? (
                <ul className="max-h-[280px] overflow-y-auto py-1">
                  {results.map((hit, index) => (
                    <li key={hit.type === 'tool' ? hit.tool.id : `${hit.type}-${hit.id}`}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => selectHit(hit)}
                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition sm:px-4 ${
                          index === activeIndex ? 'bg-[#f0ece8]' : 'hover:bg-[#f0ece8]/70'
                        }`}
                      >
                        <HitIcon hit={hit} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">{hitLabel(hit)}</span>
                          <span className="block truncate text-xs text-muted-foreground">{hitDescription(hit)}</span>
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-4 text-sm text-muted-foreground">
                  No exact match yet — press Enter to search the toolbox for “{query.trim()}”.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`flex flex-wrap items-center gap-1.5 ${compact ? 'mt-2' : 'mt-3'}`}>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-background/55">
          <Sparkles className="h-3 w-3 text-primary" />
          Try
        </span>
        {localizedPrompts.slice(0, compact ? 4 : 5).map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              setQuery(prompt)
              submit(prompt)
            }}
            className="rounded-full border border-background/15 bg-background/8 px-2.5 py-1 text-[11px] font-medium text-background/75 transition hover:border-background/30 hover:bg-background/14 hover:text-background"
          >
            {prompt}
          </button>
        ))}
        <Link
          href="/career"
          className="ml-auto hidden text-[11px] font-semibold text-background/65 underline-offset-2 hover:text-background hover:underline sm:inline"
        >
          Career Hub →
        </Link>
      </div>
    </motion.div>
  )
}
