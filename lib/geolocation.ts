export interface GeoLocationData {
  ip: string
  city: string
  region: string
  country: string
  country_name?: string
  loc: string
  timezone: string
  currency?: string
  latitude?: number
  longitude?: number
}

export interface SeasonalContext {
  season: 'summer' | 'autumn' | 'winter' | 'spring'
  isExamSeason: boolean
  isHolidaySeason: boolean
  isBackToSchool: boolean
  month: number
  hemisphere: 'northern' | 'southern'
}

const IPINFO_BASE = 'https://ipinfo.io'

export async function getLocationByIP(ip?: string): Promise<GeoLocationData | null> {
  const token = process.env.IPINFO_API_KEY
  if (!token) {
    console.warn('IPINFO_API_KEY not set')
    return null
  }

  try {
    const url = ip
      ? `${IPINFO_BASE}/${ip}/json`
      : `${IPINFO_BASE}/json`

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`IPInfo error: ${res.status}`)

    const data = await res.json()

    const [lat, lng] = (data.loc || '').split(',').map(Number)

    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      country_name: getCountryName(data.country),
      loc: data.loc,
      timezone: data.timezone,
      currency: data.currency,
      latitude: lat,
      longitude: lng,
    }
  } catch (err) {
    console.error('Geolocation fetch failed:', err)
    return null
  }
}

export function getSeasonalContext(timezone?: string, monthOverride?: number): SeasonalContext {
  const now = new Date()
  const month = monthOverride ?? (now.getMonth() + 1)

  const southernHemisphereCountries = new Set([
    'ZA', 'AU', 'NZ', 'AR', 'CL', 'BR', 'UY', 'PY', 'BO', 'PE',
    'AO', 'BW', 'SZ', 'LS', 'MG', 'MU', 'MZ', 'NA', 'ZA', 'TZ',
    'ZM', 'ZW', 'FJ', 'PG', 'SB', 'VU', 'ID',
  ])

  const country = timezone?.split('/')[0]?.toUpperCase() || ''
  const hemisphere = southernHemisphereCountries.has(country) ? 'southern' : 'northern'

  let season: SeasonalContext['season']
  if (hemisphere === 'southern') {
    if (month >= 12 || month <= 2) season = 'summer'
    else if (month <= 5) season = 'autumn'
    else if (month <= 8) season = 'winter'
    else season = 'spring'
  } else {
    if (month >= 3 && month <= 5) season = 'spring'
    else if (month >= 6 && month <= 8) season = 'summer'
    else if (month >= 9 && month <= 11) season = 'autumn'
    else season = 'winter'
  }

  // Exam seasons by region
  const isExamSeason = checkExamSeason(country, month, hemisphere)
  const isHolidaySeason = checkHolidaySeason(country, month, hemisphere)
  const isBackToSchool = checkBackToSchool(country, month, hemisphere)

  return { season, isExamSeason, isHolidaySeason, isBackToSchool, month, hemisphere }
}

function checkExamSeason(country: string, month: number, hemisphere: string): boolean {
  const examPeriods: Record<string, number[]> = {
    ZA: [5, 6, 10, 11],
    IN: [2, 3, 12],
    US: [5, 12],
    GB: [5, 6, 12],
    CA: [5, 12],
    AU: [10, 11],
    NG: [4, 5, 10, 11],
    KE: [10, 11, 12],
    GH: [5, 6],
    PK: [4, 5, 9, 10],
    PH: [3, 4, 10, 11],
    BD: [2, 3, 11, 12],
  }

  if (examPeriods[country]) {
    return examPeriods[country].includes(month)
  }

  // Default by hemisphere
  if (hemisphere === 'southern') {
    return [5, 6, 10, 11].includes(month)
  }
  return [5, 6, 12, 1].includes(month)
}

function checkHolidaySeason(country: string, month: number, hemisphere: string): boolean {
  const holidayPeriods: Record<string, number[]> = {
    ZA: [12, 1],
    US: [12, 6, 7, 8],
    GB: [12, 7, 8],
    AU: [12, 1],
    IN: [5, 6, 12],
  }

  if (holidayPeriods[country]) {
    return holidayPeriods[country].includes(month)
  }

  if (hemisphere === 'southern') {
    return [12, 1].includes(month)
  }
  return [12, 6, 7, 8].includes(month)
}

function checkBackToSchool(country: string, month: number, hemisphere: string): boolean {
  const backToSchool: Record<string, number[]> = {
    ZA: [1, 2],
    US: [8, 9],
    GB: [9],
    AU: [1, 2],
    IN: [6, 7],
    NG: [9, 10],
    KE: [1, 2, 9],
  }

  if (backToSchool[country]) {
    return backToSchool[country].includes(month)
  }

  if (hemisphere === 'southern') {
    return [1, 2].includes(month)
  }
  return [8, 9].includes(month)
}

function getCountryName(code: string): string {
  const names: Record<string, string> = {
    ZA: 'South Africa', US: 'United States', GB: 'United Kingdom',
    CA: 'Canada', AU: 'Australia', IN: 'India', NG: 'Nigeria',
    KE: 'Kenya', GH: 'Ghana', PK: 'Pakistan', PH: 'Philippines',
    BD: 'Bangladesh', DE: 'Germany', FR: 'France', BR: 'Brazil',
    JP: 'Japan', KR: 'South Korea', CN: 'China', RU: 'Russia',
    MX: 'Mexico', ID: 'Indonesia', TR: 'Turkey', SA: 'Saudi Arabia',
    AE: 'UAE', EG: 'Egypt', TZ: 'Tanzania', UG: 'Uganda',
    RW: 'Rwanda', ET: 'Ethiopia', MZ: 'Mozambique', ZM: 'Zambia',
    ZW: 'Zimbabwe', BW: 'Botswana', NA: 'Namibia', SZ: 'Eswatini',
    LS: 'Lesotho', MG: 'Madagascar', MU: 'Mauritius', MW: 'Malawi',
  }
  return names[code] || code
}
