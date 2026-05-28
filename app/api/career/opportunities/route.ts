import { NextRequest, NextResponse } from 'next/server'
import { fetchAdzunaOpportunities, getAdzunaMissingConfig, hasAdzunaConfig } from '@/lib/apis/adzuna'
import { fetchJSearchOpportunities, hasJSearchConfig } from '@/lib/apis/jsearch'
import {
  CareerOpportunity,
  CareerProvider,
  CareerSearchParams,
  freshnessScore,
  localFallbackOpportunities,
  normalizeCountry,
} from '@/lib/career-opportunities'

export const runtime = 'nodejs'

function parseSearch(request: NextRequest): CareerSearchParams {
  const params = request.nextUrl.searchParams
  return {
    query: params.get('query')?.trim() || 'internship graduate program learnership entry level',
    location: params.get('location')?.trim() || 'South Africa',
    country: normalizeCountry(params.get('country') || 'za'),
    remoteOnly: params.get('remoteOnly') === 'true',
    salaryMin: params.get('salaryMin')?.trim() || undefined,
    company: params.get('company')?.trim() || undefined,
    page: Math.max(1, Number(params.get('page')) || 1),
    perPage: Math.min(30, Math.max(8, Number(params.get('perPage')) || 20)),
    seed: Number(params.get('seed')) || Math.floor(Date.now() / 300000),
  }
}

function opportunityKey(item: CareerOpportunity) {
  return `${item.title}-${item.company}-${item.location}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
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

function mergeOpportunities(live: CareerOpportunity[], seed = 1) {
  const seen = new Set<string>()
  return live
    .filter((item) => {
      const key = opportunityKey(item)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => (scoreOpportunity(b) + seededNoise(opportunityKey(b), seed)) - (scoreOpportunity(a) + seededNoise(opportunityKey(a), seed)))
}

async function loadProvider(
  provider: Exclude<CareerProvider, 'sonke'>,
  loader: () => Promise<CareerOpportunity[]>,
) {
  try {
    return { provider, opportunities: await loader(), error: null }
  } catch (error) {
    console.error(`[career:provider:${provider}]`, error)
    return {
      provider,
      opportunities: [],
      error: error instanceof Error ? error.message : `${provider} failed`,
    }
  }
}

export async function GET(request: NextRequest) {
  const params = parseSearch(request)
  const [jsearchResult, adzunaResult] = await Promise.all([
    loadProvider('jsearch', () => fetchJSearchOpportunities(params)),
    loadProvider('adzuna', () => fetchAdzunaOpportunities(params)),
  ])
  const providerCounts = {
    jsearch: jsearchResult.opportunities.length,
    adzuna: adzunaResult.opportunities.length,
  }
  const live = [...jsearchResult.opportunities, ...adzunaResult.opportunities]
  const opportunities = mergeOpportunities(live, params.seed)
  const locationCounts = opportunities.reduce<Record<string, number>>((acc, item) => {
    const location = item.remote ? 'Remote' : (item.location.split(',')[0] || 'South Africa')
    acc[location] = (acc[location] || 0) + 1
    return acc
  }, {})
  const categoryCounts = opportunities.reduce<Record<string, number>>((acc, item) => {
    const category = /intern|learnership/i.test(`${item.title} ${item.description}`) ? 'Internships' : item.remote ? 'Remote' : item.employmentType || item.category || 'Jobs'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  return NextResponse.json({
    opportunities: opportunities.length ? opportunities : localFallbackOpportunities(params),
    providers: {
      jsearch: hasJSearchConfig(),
      adzuna: hasAdzunaConfig(),
      adzunaMissing: getAdzunaMissingConfig(),
    },
    providerErrors: process.env.NODE_ENV === 'development' ? {
      jsearch: jsearchResult.error,
      adzuna: getAdzunaMissingConfig().length
        ? `Missing ${getAdzunaMissingConfig().join(', ')}`
        : adzunaResult.error,
    } : undefined,
    source: opportunities.length ? 'live' : 'fallback',
    meta: {
      page: params.page,
      perPage: params.perPage,
      returned: opportunities.length,
      providerCounts,
      hasMore: opportunities.length >= Math.min(8, params.perPage),
      refreshedAt: new Date().toISOString(),
      trends: {
        locations: Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
        categories: Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
        companies: opportunities.slice(0, 8).map((item) => item.company),
      },
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
