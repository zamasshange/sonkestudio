import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { CareerOpportunity, CareerSearchParams, normalizeCountry, resolveCompanyBrand } from '@/lib/career-opportunities'

const execFileAsync = promisify(execFile)

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

function buildAdzunaWhat(params: CareerSearchParams) {
  const cleaned = (params.query || 'internship graduate learnership entry level')
    .replace(/company:\S+/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (params.company) {
    return `${params.company} ${cleaned}`.trim().slice(0, 180)
  }
  return cleaned.slice(0, 180)
}

function adzunaWhatVariants(params: CareerSearchParams) {
  const primary = buildAdzunaWhat(params)
  const variants = new Set<string>([primary])
  if (params.company) variants.add(`${params.company} internship graduate`.slice(0, 180))
  variants.add('internship graduate learnership South Africa')
  variants.add('entry level junior graduate programme')
  variants.add('internship')
  return [...variants].filter(Boolean)
}

function mapAdzunaResults(data: any, params: CareerSearchParams, country: string): CareerOpportunity[] {
  return (data.results || []).map((item: any): CareerOpportunity => ({
    id: String(item.id || item.redirect_url || item.title),
    provider: 'adzuna',
    source: 'Adzuna',
    title: item.title || 'Untitled role',
    company: item.company?.display_name || 'Unknown company',
    ...resolveCompanyBrand(item.company?.display_name || 'Unknown company'),
    location: item.location?.display_name || params.location,
    country: country.toUpperCase(),
    countryCode: country,
    remote: /remote/i.test(`${item.title} ${item.description} ${item.location?.display_name || ''}`),
    salary: formatSalary(item),
    description: item.description || '',
    url: item.redirect_url,
    postedAt: item.created,
    employmentType: item.contract_type || item.category?.label,
    category: item.category?.label,
  }))
}

async function fetchWithPowerShell(url: URL) {
  if (process.platform !== 'win32') return null

  try {
    const { stdout } = await execFileAsync('powershell.exe', [
      '-NoProfile',
      '-Command',
      `$ProgressPreference='SilentlyContinue'; (Invoke-WebRequest -UseBasicParsing '${url.toString().replace(/'/g, "''")}' -TimeoutSec 25).Content`,
    ], { timeout: 30_000, maxBuffer: 1024 * 1024 * 8 })
    return stdout
  } catch (error) {
    console.error('[career:adzuna] PowerShell fallback failed', error instanceof Error ? error.message : error)
    return null
  }
}

async function fetchAdzunaUrl(url: URL) {
  let lastError: unknown
  const urls = [url, new URL(url.toString().replace('https:', 'http:'))]

  for (const target of urls) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(target, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
          signal: AbortSignal.timeout(25_000),
        })

        if (!response.ok) {
          const detail = await response.text().catch(() => '')
          throw new Error(`Adzuna returned ${response.status}${detail ? `: ${detail.slice(0, 160)}` : ''}`)
        }

        return response
      } catch (error) {
        lastError = error
        console.error('[career:adzuna] fetch attempt failed', {
          attempt,
          protocol: target.protocol,
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }

    const fallback = await fetchWithPowerShell(target)
    if (fallback) {
      return new Response(fallback, { status: 200, headers: { 'content-type': 'application/json' } })
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Adzuna fetch failed')
}

async function fetchAdzunaPage(
  params: CareerSearchParams,
  page: number,
  what: string,
  appId: string,
  appKey: string,
  country: string,
) {
  const perPage = Math.min(50, Math.max(params.perPage || 20, 20))
  const buildUrl = (protocol: 'https:' | 'http:') => {
    const url = new URL(`${protocol}//api.adzuna.com/v1/api/jobs/${country}/search/${page}`)
    url.searchParams.set('app_id', appId)
    url.searchParams.set('app_key', appKey)
    url.searchParams.set('results_per_page', String(perPage))
    url.searchParams.set('what', what)
    url.searchParams.set('where', params.remoteOnly ? 'remote' : params.location)
    url.searchParams.set('sort_by', 'date')
    if (params.salaryMin) url.searchParams.set('salary_min', params.salaryMin)
    return url
  }

  const response = await fetchAdzunaUrl(buildUrl('https:'))
  const data = await response.json()
  return mapAdzunaResults(data, params, country)
}

export async function fetchAdzunaOpportunities(params: CareerSearchParams): Promise<CareerOpportunity[]> {
  const appId = env('ADZUNA_APP_ID', 'ADZUNA_APPLICATION_ID')
  const appKey = env('ADZUNA_API_KEY', 'ADZUNA_APP_KEY')
  if (!appId || !appKey) return []

  const country = normalizeCountry(params.country)
  const seen = new Set<string>()
  const merged: CareerOpportunity[] = []

  const addResults = (items: CareerOpportunity[]) => {
    for (const item of items) {
      const key = `${item.provider}-${item.id}`.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(item)
    }
  }

  for (const what of adzunaWhatVariants(params)) {
    try {
      const pageResults = await fetchAdzunaPage(params, params.page, what, appId, appKey, country)
      addResults(pageResults)
      if (merged.length >= params.perPage) break
    } catch (error) {
      console.error('[career:adzuna] query variant failed', { what, message: error instanceof Error ? error.message : error })
    }
  }

  if (merged.length < params.perPage && params.page === 1) {
    try {
      const nextPage = await fetchAdzunaPage(params, params.page + 1, buildAdzunaWhat(params), appId, appKey, country)
      addResults(nextPage)
    } catch (error) {
      console.error('[career:adzuna] secondary page failed', error instanceof Error ? error.message : error)
    }
  }

  return merged
}
