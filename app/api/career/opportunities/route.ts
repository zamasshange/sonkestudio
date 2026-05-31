import { NextRequest, NextResponse } from 'next/server'
import { fetchAdzunaOpportunities, getAdzunaMissingConfig, hasAdzunaConfig } from '@/lib/apis/adzuna'
import { isJSearchPaused, sanitizeProviderError } from '@/lib/apis/career-provider-state'
import { fetchJSearchOpportunities, hasJSearchConfig } from '@/lib/apis/jsearch'
import {
  CareerOpportunity,
  CareerSearchParams,
  freshnessScore,
  normalizeCountry,
} from '@/lib/career-opportunities'

export const runtime = 'nodejs'

function parseSearch(request: NextRequest): CareerSearchParams {
  const params = request.nextUrl.searchParams
  const fresh = params.get('fresh') === 'true'
  return {
    query: params.get('query')?.trim() || 'internship graduate program learnership entry level',
    location: params.get('location')?.trim() || 'South Africa',
    country: normalizeCountry(params.get('country') || 'za'),
    remoteOnly: params.get('remoteOnly') === 'true',
    salaryMin: params.get('salaryMin')?.trim() || undefined,
    company: params.get('company')?.trim() || undefined,
    page: Math.max(1, Number(params.get('page')) || 1),
    perPage: Math.min(30, Math.max(8, Number(params.get('perPage')) || 20)),
    seed: fresh
      ? Date.now()
      : Number(params.get('seed')) || Date.now(),
  }
}

function parseRecent(request: NextRequest) {
  if (request.nextUrl.searchParams.get('fresh') === 'true') return []
  return (request.nextUrl.searchParams.get('recent') || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

function opportunityKey(item: CareerOpportunity) {
  return `${item.provider}-${item.id}`.toLowerCase()
}

function scoreOpportunity(item: CareerOpportunity) {
  const text = `${item.title} ${item.company} ${item.location} ${item.description} ${item.employmentType || ''}`.toLowerCase()
  return (
    (/south africa|johannesburg|cape town|durban|pretoria|remote africa|\bza\b/.test(text) ? 8 : 0) +
    (/internship|intern|learnership|graduate program|graduate programme|entry level|junior/.test(text) ? 5 : 0) +
    freshnessScore(item.postedAt) +
    (item.remote ? 3 : 0) +
    (item.url ? 1 : 0)
  )
}

function seededNoise(key: string, seed = 1) {
  let hash = seed
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) % 9973
  }
  return hash / 9973
}

function mergeOpportunities(live: CareerOpportunity[], seed = 1, recent: string[] = []) {
  const seen = new Set<string>()
  const recentSet = new Set(recent)
  const deduped = live.filter((item) => {
    const key = opportunityKey(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const scored = deduped
    .map((item) => {
      const key = opportunityKey(item)
      const score = scoreOpportunity(item) + seededNoise(key, seed) * 4 - (recentSet.has(key) ? 18 : 0)
      return { item, score, key }
    })
    .sort((a, b) => b.score - a.score)

  const unseen = scored.filter((entry) => !recentSet.has(entry.key))
  const pool = unseen.length >= Math.min(6, scored.length) ? unseen : scored
  return pool.map((entry) => entry.item)
}

function buildFeedMessages(
  liveCount: number,
  providerErrors: { jsearch: string | null; adzuna: string | null },
) {
  const jsearchConfigured = hasJSearchConfig()
  const adzunaConfigured = hasAdzunaConfig()
  const adzunaMissing = getAdzunaMissingConfig()

  if (liveCount > 0) {
    const warnings: string[] = []
    if (jsearchConfigured && providerErrors.jsearch) warnings.push(sanitizeProviderError('jsearch', providerErrors.jsearch) || '')
    if (adzunaConfigured && providerErrors.adzuna) warnings.push(sanitizeProviderError('adzuna', providerErrors.adzuna) || '')
    const warning = warnings.filter(Boolean).join(' ')
    return { error: null as string | null, warning: warning || null }
  }

  if (!jsearchConfigured && !adzunaConfigured) {
    return {
      error: 'No live opportunities available right now. Add JSEARCH_API_KEY and/or ADZUNA_APP_ID + ADZUNA_API_KEY to your environment.',
      warning: null,
    }
  }

  const parts: string[] = ['Unable to fetch live opportunities right now.']
  if (!jsearchConfigured) parts.push('JSearch is not configured.')
  else if (providerErrors.jsearch) parts.push(sanitizeProviderError('jsearch', providerErrors.jsearch) || 'JSearch unavailable.')
  if (!adzunaConfigured) parts.push(`Adzuna: missing ${adzunaMissing.join(', ') || 'credentials'}.`)
  else if (providerErrors.adzuna) parts.push(sanitizeProviderError('adzuna', providerErrors.adzuna) || 'Adzuna unavailable.')

  return { error: parts.join(' '), warning: null }
}

async function loadProvider(
  provider: 'jsearch' | 'adzuna',
  loader: () => Promise<CareerOpportunity[]>,
) {
  try {
    return { provider, opportunities: await loader(), error: null as string | null }
  } catch (error) {
    console.error(`[career:provider:${provider}]`, error)
    return {
      provider,
      opportunities: [] as CareerOpportunity[],
      error: error instanceof Error ? error.message : `${provider} failed`,
    }
  }
}

export async function GET(request: NextRequest) {
  const params = parseSearch(request)
  const recent = parseRecent(request)

  const jsearchPaused = isJSearchPaused()
  const [jsearchResult, adzunaResult] = await Promise.all([
    jsearchPaused || !hasJSearchConfig()
      ? Promise.resolve({
          provider: 'jsearch' as const,
          opportunities: [],
          error: jsearchPaused ? 'Paused (rate limit) — using Adzuna' : 'Not configured',
        })
      : loadProvider('jsearch', () => fetchJSearchOpportunities(params)),
    loadProvider('adzuna', () => fetchAdzunaOpportunities(params)),
  ])

  const providerCounts = {
    jsearch: jsearchResult.opportunities.length,
    adzuna: adzunaResult.opportunities.length,
  }
  const live = [...jsearchResult.opportunities, ...adzunaResult.opportunities]
  const merged = mergeOpportunities(live, params.seed, recent)
  const opportunities = merged.slice(0, params.perPage)
  const livePoolSize = merged.length

  const rawProviderErrors = {
    jsearch: !hasJSearchConfig()
      ? 'Not configured'
      : jsearchResult.error,
    adzuna: getAdzunaMissingConfig().length
      ? `Missing ${getAdzunaMissingConfig().join(', ')}`
      : adzunaResult.error,
  }

  const providerErrors = {
    jsearch: sanitizeProviderError('jsearch', rawProviderErrors.jsearch),
    adzuna: sanitizeProviderError('adzuna', rawProviderErrors.adzuna),
  }

  const locationCounts = opportunities.reduce<Record<string, number>>((acc, item) => {
    const place = item.remote ? 'Remote' : (item.location.split(',')[0] || 'South Africa')
    acc[place] = (acc[place] || 0) + 1
    return acc
  }, {})
  const categoryCounts = opportunities.reduce<Record<string, number>>((acc, item) => {
    const category = /intern|learnership/i.test(`${item.title} ${item.description}`)
      ? 'Internships'
      : item.remote
        ? 'Remote'
        : item.employmentType || item.category || 'Jobs'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const { error, warning } = buildFeedMessages(livePoolSize, rawProviderErrors)

  return NextResponse.json({
    opportunities,
    providers: {
      jsearch: hasJSearchConfig() && !jsearchPaused,
      adzuna: hasAdzunaConfig(),
      jsearchPaused,
      adzunaMissing: getAdzunaMissingConfig(),
    },
    providerErrors,
    diagnostics: {
      jsearchConfigured: hasJSearchConfig(),
      adzunaConfigured: hasAdzunaConfig(),
      jsearchPaused,
      jsearchReturned: providerCounts.jsearch,
      adzunaReturned: providerCounts.adzuna,
      mergedPool: livePoolSize,
    },
    error,
    warning,
    source: livePoolSize > 0 ? 'live' : 'empty',
    meta: {
      page: params.page,
      perPage: params.perPage,
      returned: opportunities.length,
      livePoolSize,
      totalLive: live.length,
      providerCounts,
      hasMore: livePoolSize > params.perPage || providerCounts.jsearch >= params.perPage || providerCounts.adzuna >= 8,
      refreshedAt: new Date().toISOString(),
      trends: livePoolSize > 0
        ? {
            locations: Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
            categories: Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
            companies: opportunities.slice(0, 8).map((item) => item.company),
          }
        : { locations: [], categories: [], companies: [] },
    },
    requiredEnv: {
      jsearch: 'JSEARCH_API_KEY + JSEARCH_API_HOST',
      adzuna: 'ADZUNA_APP_ID + ADZUNA_API_KEY',
    },
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
