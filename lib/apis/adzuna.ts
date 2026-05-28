import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { buildCareerQuery, CareerOpportunity, CareerSearchParams, normalizeCountry, resolveCompanyBrand } from '@/lib/career-opportunities'

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

async function fetchWithPowerShell(url: URL) {
  if (process.platform !== 'win32') return null

  try {
    const { stdout } = await execFileAsync('powershell.exe', [
      '-NoProfile',
      '-Command',
      `$ProgressPreference='SilentlyContinue'; (Invoke-WebRequest -UseBasicParsing '${url.toString().replace(/'/g, "''")}' -TimeoutSec 20).Content`,
    ], { timeout: 25000, maxBuffer: 1024 * 1024 * 5 })
    return stdout
  } catch (error) {
    console.error('[career:adzuna] PowerShell fallback failed', error instanceof Error ? error.message : error)
    return null
  }
}

async function fetchWithRetry(urls: URL[]) {
  let lastError: unknown

  for (const url of urls) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(url, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        })

        if (!response.ok) {
          const detail = await response.text().catch(() => '')
          throw new Error(`Adzuna returned ${response.status}${detail ? `: ${detail.slice(0, 160)}` : ''}`)
        }

        return response
      } catch (error) {
        lastError = error
        console.error('[career:adzuna] fetch attempt failed', {
          url: url.origin + url.pathname,
          message: error instanceof Error ? error.message : String(error),
          cause: error instanceof Error && 'cause' in error ? error.cause : undefined,
        })
      }
    }

    const fallback = await fetchWithPowerShell(url)
    if (fallback) {
      return new Response(fallback, { status: 200, headers: { 'content-type': 'application/json' } })
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Adzuna fetch failed')
}

export async function fetchAdzunaOpportunities(params: CareerSearchParams): Promise<CareerOpportunity[]> {
  const appId = env('ADZUNA_APP_ID', 'ADZUNA_APPLICATION_ID')
  const appKey = env('ADZUNA_API_KEY', 'ADZUNA_APP_KEY')
  if (!appId || !appKey) return []

  const country = normalizeCountry(params.country)
  const buildUrl = (protocol: 'https:' | 'http:') => {
    const url = new URL(`${protocol}//api.adzuna.com/v1/api/jobs/${country}/search/${params.page}`)
    url.searchParams.set('app_id', appId)
    url.searchParams.set('app_key', appKey)
    url.searchParams.set('results_per_page', String(Math.min(params.perPage || 20, 30)))
    url.searchParams.set('what', buildCareerQuery(params))
    url.searchParams.set('where', params.remoteOnly ? 'remote' : params.location)
    url.searchParams.set('content-type', 'application/json')
    url.searchParams.set('sort_by', 'date')
    if (params.salaryMin) url.searchParams.set('salary_min', params.salaryMin)
    return url
  }

  const response = await fetchWithRetry([buildUrl('https:'), buildUrl('http:')])

  const data = await response.json()

  return (data.results || []).map((item: any): CareerOpportunity => ({
    id: String(item.id || item.redirect_url || item.title),
    provider: 'adzuna',
    source: 'Adzuna',
    title: item.title || 'Untitled role',
    company: item.company?.display_name || 'Unknown company',
    ...resolveCompanyBrand(item.company?.display_name || 'Unknown company'),
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
