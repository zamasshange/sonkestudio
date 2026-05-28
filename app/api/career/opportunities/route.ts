import { NextRequest, NextResponse } from 'next/server'
import { fetchAdzunaOpportunities, getAdzunaMissingConfig, hasAdzunaConfig } from '@/lib/apis/adzuna'
import { fetchJSearchOpportunities, hasJSearchConfig } from '@/lib/apis/jsearch'
import {
  CareerOpportunity,
  CareerSearchParams,
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
    (item.remote ? 3 : 0) +
    (item.url ? 1 : 0)
  )
}

function mergeOpportunities(live: CareerOpportunity[]) {
  const seen = new Set<string>()
  return live
    .filter((item) => {
      const key = opportunityKey(item)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => scoreOpportunity(b) - scoreOpportunity(a))
}

export async function GET(request: NextRequest) {
  const params = parseSearch(request)
  const settled = await Promise.allSettled([fetchJSearchOpportunities(params), fetchAdzunaOpportunities(params)])
  const live = settled.flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
  const opportunities = mergeOpportunities(live)

  return NextResponse.json({
    opportunities: opportunities.length ? opportunities : localFallbackOpportunities(params),
    providers: {
      jsearch: hasJSearchConfig(),
      adzuna: hasAdzunaConfig(),
      adzunaMissing: getAdzunaMissingConfig(),
    },
    providerErrors: process.env.NODE_ENV === 'development' ? {
      jsearch: settled[0].status === 'rejected' ? settled[0].reason?.message || 'JSearch failed' : null,
      adzuna: getAdzunaMissingConfig().length
        ? `Missing ${getAdzunaMissingConfig().join(', ')}`
        : settled[1].status === 'rejected' ? settled[1].reason?.message || 'Adzuna failed' : null,
    } : undefined,
    source: opportunities.length ? 'live' : 'fallback',
    requiredEnv: {
      jsearch: 'JSEARCH_API_KEY + JSEARCH_API_HOST',
      adzuna: 'ADZUNA_APP_ID + ADZUNA_API_KEY',
    },
  })
}
