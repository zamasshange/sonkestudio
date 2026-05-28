import { buildCareerQuery, CareerOpportunity, CareerSearchParams, normalizeCountry } from '@/lib/career-opportunities'

function env(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim()
    if (value) return value
  }
  return undefined
}

export function hasAdzunaConfig() {
  return Boolean(env('ADZUNA_APP_ID', 'ADZUNA_APPLICATION_ID') && env('ADZUNA_API_KEY', 'ADZUNA_APP_KEY'))
}

export function getAdzunaMissingConfig() {
  const missing = []
  if (!env('ADZUNA_APP_ID', 'ADZUNA_APPLICATION_ID')) missing.push('ADZUNA_APP_ID')
  if (!env('ADZUNA_API_KEY', 'ADZUNA_APP_KEY')) missing.push('ADZUNA_API_KEY')
  return missing
}

function formatSalary(item: any) {
  if (!item.salary_min && !item.salary_max) return undefined
  return `${item.salary_min || ''}${item.salary_min && item.salary_max ? ' - ' : ''}${item.salary_max || ''}`.trim()
}

export async function fetchAdzunaOpportunities(params: CareerSearchParams): Promise<CareerOpportunity[]> {
  const appId = env('ADZUNA_APP_ID', 'ADZUNA_APPLICATION_ID')
  const appKey = env('ADZUNA_API_KEY', 'ADZUNA_APP_KEY')
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
    source: 'Adzuna',
    title: item.title || 'Untitled role',
    company: item.company?.display_name || 'Unknown company',
    location: item.location?.display_name || params.location,
    country: country.toUpperCase(),
    remote: /remote/i.test(`${item.title} ${item.description} ${item.location?.display_name || ''}`),
    salary: formatSalary(item),
    description: item.description || '',
    url: item.redirect_url,
    postedAt: item.created,
    employmentType: item.contract_type || item.category?.label,
    category: item.category?.label,
  }))
}
