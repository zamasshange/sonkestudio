export type CareerProvider = 'jsearch' | 'adzuna'

export type CareerOpportunity = {
  id: string
  provider: CareerProvider
  source?: string
  title: string
  company: string
  companyDomain?: string
  companyInitials?: string
  logoUrl?: string
  logoFallbacks?: string[]
  location: string
  country?: string
  countryCode?: string
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
  perPage: number
  seed?: number
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
  { id: 'internships', label: 'Internships', query: 'internship graduate trainee South Africa' },
  { id: 'learnerships', label: 'Learnerships', query: 'learnership SETA youth programme South Africa' },
  { id: 'bursaries', label: 'Bursaries', query: 'bursary scholarship student opportunity South Africa' },
  { id: 'graduate', label: 'Graduate Programs', query: 'graduate programme graduate program South Africa' },
  { id: 'government', label: 'Government Jobs', query: 'government internship public sector entry level South Africa' },
  { id: 'remote', label: 'Remote Work', query: 'remote junior entry level South Africa' },
  { id: 'call-centre', label: 'Call Centre', query: 'call centre agent entry level South Africa' },
  { id: 'retail-admin', label: 'Retail & Admin', query: 'retail admin assistant entry level South Africa' },
  { id: 'digital-skills', label: 'Digital Skills', query: 'digital marketing IT support data analyst internship South Africa' },
  { id: 'creator-economy', label: 'Creator Economy', query: 'content creator social media internship junior South Africa' },
  { id: 'startup', label: 'Startup Opportunities', query: 'startup internship junior operations South Africa' },
  { id: 'cv-interview', label: 'CV & Interview Prep', query: 'graduate internship entry level junior South Africa' },
]

const knownCompanyDomains: Record<string, string> = {
  massmart: 'massmart.co.za',
  homechoice: 'homechoice.co.za',
  standardbank: 'standardbank.co.za',
  'standard bank': 'standardbank.co.za',
  sanlam: 'sanlam.co.za',
  istore: 'istore.co.za',
  pwc: 'pwc.co.za',
  premier: 'premierfmcg.com',
  pepkor: 'pepkor.co.za',
  'pepkor lifestyle': 'pepkorlifestyle.com',
  columbus: 'columbus.co.za',
  vodacom: 'vodacom.co.za',
  transnet: 'transnet.net',
  eskom: 'eskom.co.za',
  'fidelity services group': 'fidelity-services.com',
  mtn: 'mtn.co.za',
  'mtn group': 'mtn.com',
  shoprite: 'shoprite.co.za',
  checkers: 'shoprite.co.za',
  picknpay: 'pnp.co.za',
  'pick n pay': 'pnp.co.za',
  woolworths: 'woolworths.co.za',
  discovery: 'discovery.co.za',
  nedbank: 'nedbank.co.za',
  absa: 'absa.co.za',
  fnb: 'fnb.co.za',
  'first national bank': 'fnb.co.za',
  capitec: 'capitecbank.co.za',
  multichoice: 'multichoice.com',
  naspers: 'naspers.com',
  takealot: 'takealot.com',
  outsurance: 'outsurance.co.za',
  oldmutual: 'oldmutual.com',
  'old mutual': 'oldmutual.com',
  sasol: 'sasol.com',
  angloamerican: 'angloamerican.com',
  'anglo american': 'angloamerican.com',
  dimensiondata: 'dimensiondata.com',
  'dimension data': 'dimensiondata.com',
  deloitte: 'deloitte.co.za',
  kpmg: 'kpmg.co.za',
  ey: 'ey.com',
  'ernst young': 'ey.com',
  mckinsey: 'mckinsey.com',
  amazon: 'amazon.com',
  google: 'google.com',
  microsoft: 'microsoft.com',
}

function inferSouthAfricanDomain(company: string) {
  const slug = company
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9 ]+/g, '')
    .trim()
    .split(/\s+/)
    .filter((part) => !['pty', 'ltd', 'limited', 'group', 'company', 'the'].includes(part))
    .slice(0, 2)
    .join('')

  return slug.length > 2 ? `${slug}.co.za` : undefined
}

export function getCompanyInitials(company: string) {
  return company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SA'
}

export function inferCompanyDomain(company: string) {
  const normalized = company.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (knownCompanyDomains[normalized]) return knownCompanyDomains[normalized]
  const firstToken = normalized.split(' ')[0]
  if (knownCompanyDomains[firstToken]) return knownCompanyDomains[firstToken]
  for (const [key, domain] of Object.entries(knownCompanyDomains)) {
    if (normalized.includes(key) || key.includes(normalized)) return domain
  }
  return inferSouthAfricanDomain(company)
}

export function resolveCompanyBrand(company: string, logoUrl?: string) {
  const domain = inferCompanyDomain(company)
  return {
    companyDomain: domain,
    companyInitials: getCompanyInitials(company),
    logoUrl: logoUrl || (domain ? `https://logo.clearbit.com/${domain}` : undefined),
    logoFallbacks: domain
      ? [
          `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          `https://icons.duckduckgo.com/ip3/${domain}.ico`,
        ]
      : [],
  }
}

export function normalizeCountry(country: string) {
  const value = country.trim().toLowerCase()
  if (!value || value === 'south africa' || value === 'za') return 'za'
  if (value === 'united states' || value === 'usa' || value === 'us') return 'us'
  if (value === 'united kingdom' || value === 'uk' || value === 'gb') return 'gb'
  return value.slice(0, 2)
}

export function countryToFlagCode(country?: string) {
  const value = (country || 'za').trim().toLowerCase()
  if (value === 'south africa' || value === 'za' || value === 'zaf') return 'za'
  if (value === 'united states' || value === 'usa' || value === 'us') return 'us'
  if (value === 'united kingdom' || value === 'uk' || value === 'gb') return 'gb'
  if (value.length === 2) return value
  return 'za'
}

export function freshnessScore(postedAt?: string) {
  if (!postedAt) return 0
  const time = new Date(postedAt).getTime()
  if (Number.isNaN(time)) return 0
  const days = Math.max(0, (Date.now() - time) / 86_400_000)
  return Math.max(0, 14 - days)
}

export function buildCareerQuery(params: CareerSearchParams) {
  const parts = [
    params.query || 'internship graduate program learnership entry level',
    params.company ? `company:${params.company}` : '',
    params.remoteOnly ? 'remote' : '',
  ].filter(Boolean)
  return parts.join(' ')
}

