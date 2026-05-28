export type CareerProvider = 'jsearch' | 'adzuna' | 'sonke'

export type CareerOpportunity = {
  id: string
  provider: CareerProvider
  source?: string
  title: string
  company: string
  companyDomain?: string
  companyInitials?: string
  logoUrl?: string
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
  perPage: number
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
  const normalized = company.toLowerCase().replace(/[^a-z0-9 ]+/g, '').trim()
  return knownCompanyDomains[normalized] || knownCompanyDomains[normalized.split(' ')[0]] || inferSouthAfricanDomain(company)
}

export function resolveCompanyBrand(company: string, logoUrl?: string) {
  const domain = inferCompanyDomain(company)
  return {
    companyDomain: domain,
    companyInitials: getCompanyInitials(company),
    logoUrl: logoUrl || (domain ? `https://logo.clearbit.com/${domain}` : undefined),
  }
}

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
    ['Graduate Software Developer Internship', 'SONKE Career Signal', 'Remote / Johannesburg', 'digital-skills'],
    ['Marketing Graduate Programme', 'SA Growth Studio', 'Cape Town', 'graduate'],
    ['Junior Creator Fellowship', 'Creator Economy Lab', 'Remote Africa', 'creator-economy'],
    ['Data Analyst Learnership', 'Insight Skills Network', 'Pretoria', 'learnerships'],
    ['Admin Assistant Entry Role', 'Mzansi Careers Desk', 'Durban', 'retail-admin'],
    ['Youth Public Sector Internship', 'Civic Talent Network', 'Pretoria', 'government'],
    ['Customer Support Learnership', 'SA Contact Centre Academy', 'Johannesburg', 'call-centre'],
    ['Student Bursary Research Assistant', 'Campus Opportunity Signal', 'South Africa', 'bursaries'],
  ] as const

  return tracks.map(([title, company, place, category], index) => ({
    id: `fallback-${category}-${index}`,
    provider: 'sonke',
    source: 'SONKE',
    title,
    company,
    ...resolveCompanyBrand(company),
    location: params.remoteOnly ? 'Remote Africa' : location || place,
    country: 'ZA',
    remote: params.remoteOnly || place.toLowerCase().includes('remote'),
    salary: 'Market related',
    description: `Curated ${query} pathway for students, graduates, junior talent, freelancers, and early-career builders. Use AI prep to tailor your CV and cover letter before applying.`,
    employmentType: index === 0 ? 'Internship' : 'Graduate / Entry-level',
    category,
  }))
}
