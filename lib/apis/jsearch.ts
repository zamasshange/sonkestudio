import { buildCareerQuery, CareerOpportunity, CareerSearchParams, resolveCompanyBrand } from '@/lib/career-opportunities'

function env(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim()
    if (value) return value
  }
  return undefined
}

export function hasJSearchConfig() {
  return Boolean(env('JSEARCH_API_KEY', 'JSEARCH_RAPIDAPI_KEY', 'RAPIDAPI_KEY', 'RAPID_API_KEY', 'X_RAPIDAPI_KEY'))
}

function formatSalary(item: any) {
  if (!item.job_min_salary && !item.job_max_salary) return undefined
  return `${item.job_min_salary || ''}${item.job_min_salary && item.job_max_salary ? ' - ' : ''}${item.job_max_salary || ''} ${item.job_salary_currency || ''}`.trim()
}

function formatLocation(item: any, fallback: string) {
  return [item.job_city, item.job_state, item.job_country].filter(Boolean).join(', ') || fallback
}

export async function fetchJSearchOpportunities(params: CareerSearchParams): Promise<CareerOpportunity[]> {
  const key = env('JSEARCH_API_KEY', 'JSEARCH_RAPIDAPI_KEY', 'RAPIDAPI_KEY', 'RAPID_API_KEY', 'X_RAPIDAPI_KEY')
  const host = env('JSEARCH_API_HOST', 'JSEARCH_RAPIDAPI_HOST') || 'jsearch.p.rapidapi.com'
  if (!key) return []

  const query = [buildCareerQuery(params), params.location].filter(Boolean).join(' in ')
  const url = new URL(`https://${host}/search`)
  url.searchParams.set('query', query)
  url.searchParams.set('page', String(params.page))
  url.searchParams.set('num_pages', '1')
  url.searchParams.set('country', params.country)
  if (params.remoteOnly) url.searchParams.set('remote_jobs_only', 'true')

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': host,
      'x-rapidapi-key': key,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`JSearch returned ${response.status}${detail ? `: ${detail.slice(0, 160)}` : ''}`)
  }

  const data = await response.json()

  return (data.data || []).map((item: any): CareerOpportunity => ({
    id: String(item.job_id || item.job_apply_link || item.job_title),
    provider: 'jsearch',
    source: 'JSearch',
    title: item.job_title || 'Untitled role',
    company: item.employer_name || 'Unknown company',
    ...resolveCompanyBrand(item.employer_name || 'Unknown company', item.employer_logo),
    location: formatLocation(item, params.location),
    country: item.job_country,
    countryCode: item.job_country?.toLowerCase() || params.country,
    remote: Boolean(item.job_is_remote),
    salary: formatSalary(item),
    description: item.job_description || '',
    url: item.job_apply_link || item.job_google_link,
    postedAt: item.job_posted_at_datetime_utc,
    employmentType: item.job_employment_type,
    category: item.job_employment_type,
  }))
}
