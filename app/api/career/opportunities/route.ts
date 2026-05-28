import { NextRequest, NextResponse } from 'next/server'
import {
  buildCareerQuery,
  CareerOpportunity,
  CareerSearchParams,
  localFallbackOpportunities,
  normalizeCountry,
} from '@/lib/career-opportunities'

export const runtime = 'nodejs'

function env(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim()
    if (value) return value
  }
  return undefined
}

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

async function fetchJSearch(params: CareerSearchParams): Promise<CareerOpportunity[]> {
  const key = env('JSEARCH_RAPIDAPI_KEY', 'RAPIDAPI_KEY', 'RAPID_API_KEY', 'X_RAPIDAPI_KEY')
  if (!key) return []

  const query = [buildCareerQuery(params), params.location].filter(Boolean).join(' in ')
  const url = new URL('https://jsearch.p.rapidapi.com/search')
  url.searchParams.set('query', query)
  url.searchParams.set('page', String(params.page))
  url.searchParams.set('num_pages', '1')
  url.searchParams.set('country', params.country)
  if (params.remoteOnly) url.searchParams.set('remote_jobs_only', 'true')

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      'x-rapidapi-key': key,
    },
    next: { revalidate: 900 },
  })
  if (!response.ok) {
    throw new Error(`JSearch returned ${response.status}`)
  }
  const data = await response.json()

  return (data.data || []).map((item: any): CareerOpportunity => ({
    id: String(item.job_id || item.job_apply_link || item.job_title),
    provider: 'jsearch',
    title: item.job_title || 'Untitled role',
    company: item.employer_name || 'Unknown company',
    location: item.job_city || item.job_country || params.location,
    country: item.job_country,
    remote: Boolean(item.job_is_remote),
    salary: item.job_min_salary || item.job_max_salary
      ? `${item.job_min_salary || ''}${item.job_min_salary && item.job_max_salary ? ' - ' : ''}${item.job_max_salary || ''} ${item.job_salary_currency || ''}`.trim()
      : undefined,
    description: item.job_description || '',
    url: item.job_apply_link || item.job_google_link,
    postedAt: item.job_posted_at_datetime_utc,
    employmentType: item.job_employment_type,
    category: item.job_employment_type,
  }))
}

async function fetchAdzuna(params: CareerSearchParams): Promise<CareerOpportunity[]> {
  const appId = env('ADZUNA_APP_ID', 'ADZUNA_APPLICATION_ID')
  const appKey = env('ADZUNA_APP_KEY', 'ADZUNA_API_KEY')
  if (!appId || !appKey) return []

  const country = normalizeCountry(params.country)
  const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/${params.page}`)
  url.searchParams.set('app_id', appId)
  url.searchParams.set('app_key', appKey)
  url.searchParams.set('results_per_page', '12')
  url.searchParams.set('what', buildCareerQuery(params))
  url.searchParams.set('where', params.remoteOnly ? 'remote' : params.location)
  url.searchParams.set('content-type', 'application/json')
  if (params.salaryMin) url.searchParams.set('salary_min', params.salaryMin)

  const response = await fetch(url, { next: { revalidate: 900 } })
  if (!response.ok) {
    throw new Error(`Adzuna returned ${response.status}`)
  }
  const data = await response.json()

  return (data.results || []).map((item: any): CareerOpportunity => ({
    id: String(item.id || item.redirect_url || item.title),
    provider: 'adzuna',
    title: item.title || 'Untitled role',
    company: item.company?.display_name || 'Unknown company',
    location: item.location?.display_name || params.location,
    country: country.toUpperCase(),
    remote: /remote/i.test(`${item.title} ${item.description} ${item.location?.display_name || ''}`),
    salary: item.salary_min || item.salary_max
      ? `${item.salary_min || ''}${item.salary_min && item.salary_max ? ' - ' : ''}${item.salary_max || ''}`.trim()
      : undefined,
    description: item.description || '',
    url: item.redirect_url,
    postedAt: item.created,
    employmentType: item.contract_type || item.category?.label,
    category: item.category?.label,
  }))
}

export async function GET(request: NextRequest) {
  const params = parseSearch(request)
  const settled = await Promise.allSettled([fetchJSearch(params), fetchAdzuna(params)])
  const live = settled.flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
  const seen = new Set<string>()
  const opportunities = live.filter((item) => {
    const key = `${item.provider}-${item.id}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return NextResponse.json({
    opportunities: opportunities.length ? opportunities : localFallbackOpportunities(params),
    providers: {
      jsearch: Boolean(env('JSEARCH_RAPIDAPI_KEY', 'RAPIDAPI_KEY', 'RAPID_API_KEY', 'X_RAPIDAPI_KEY')),
      adzuna: Boolean(env('ADZUNA_APP_ID', 'ADZUNA_APPLICATION_ID') && env('ADZUNA_APP_KEY', 'ADZUNA_API_KEY')),
    },
    providerErrors: process.env.NODE_ENV === 'development' ? {
      jsearch: settled[0].status === 'rejected' ? settled[0].reason?.message || 'JSearch failed' : null,
      adzuna: settled[1].status === 'rejected' ? settled[1].reason?.message || 'Adzuna failed' : null,
    } : undefined,
    source: opportunities.length ? 'live' : 'fallback',
    requiredEnv: {
      jsearch: 'JSEARCH_RAPIDAPI_KEY or RAPIDAPI_KEY',
      adzuna: 'ADZUNA_APP_ID + ADZUNA_APP_KEY',
    },
  })
}
