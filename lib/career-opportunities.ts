export type CareerProvider = 'jsearch' | 'adzuna' | 'sonke'

export type CareerOpportunity = {
  id: string
  provider: CareerProvider
  source?: string
  title: string
  company: string
  location: string
  country?: string
  remote: boolean
  salary?: string
  description: string
  url?: string
  postedAt?: string
  employmentType?: string
  category?: string
}

export type CareerSearchParams = {
  query: string
  location: string
  country: string
  remoteOnly: boolean
  salaryMin?: string
  company?: string
  page: number
}

export const southAfricanCareerLocations = [
  'South Africa',
  'Johannesburg',
  'Cape Town',
  'Durban',
  'Pretoria',
  'Remote Africa',
]

export const careerInterestTracks = [
  { id: 'coding', label: 'Coding', query: 'junior developer internship learnership' },
  { id: 'design', label: 'Design', query: 'junior designer creator internship' },
  { id: 'business', label: 'Business', query: 'graduate marketing business analyst internship' },
  { id: 'freelance', label: 'Freelance', query: 'remote freelance entry level' },
  { id: 'data', label: 'Data', query: 'data analyst internship graduate' },
]

export function normalizeCountry(country: string) {
  const value = country.trim().toLowerCase()
  if (!value || value === 'south africa' || value === 'za') return 'za'
  if (value === 'united states' || value === 'usa' || value === 'us') return 'us'
  if (value === 'united kingdom' || value === 'uk' || value === 'gb') return 'gb'
  return value.slice(0, 2)
}

export function buildCareerQuery(params: CareerSearchParams) {
  const parts = [
    params.query || 'internship graduate program learnership entry level',
    params.company ? `company:${params.company}` : '',
    params.remoteOnly ? 'remote' : '',
  ].filter(Boolean)
  return parts.join(' ')
}

export function localFallbackOpportunities(params: CareerSearchParams): CareerOpportunity[] {
  const query = params.query || 'student opportunity'
  const location = params.location || 'South Africa'
  const tracks = [
    ['Graduate Software Developer Internship', 'SONKE Career Signal', 'Remote / Johannesburg', 'coding'],
    ['Marketing Graduate Programme', 'SA Growth Studio', 'Cape Town', 'business'],
    ['Junior Creator Fellowship', 'Creator Economy Lab', 'Remote Africa', 'design'],
    ['Data Analyst Learnership', 'Insight Skills Network', 'Pretoria', 'data'],
  ] as const

  return tracks.map(([title, company, place, category], index) => ({
    id: `fallback-${category}-${index}`,
    provider: 'sonke',
    title,
    company,
    location: params.remoteOnly ? 'Remote Africa' : location || place,
    country: 'ZA',
    remote: params.remoteOnly || place.toLowerCase().includes('remote'),
    salary: 'Market related',
    description: `Curated ${query} pathway for students, graduates, junior talent, freelancers, and early-career builders. Use AI prep to tailor your CV and cover letter before applying.`,
    employmentType: index === 0 ? 'Internship' : 'Graduate / Entry-level',
    category,
  }))
}
