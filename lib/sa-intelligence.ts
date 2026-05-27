import type { GeoLocationData } from './geolocation'

export type RegionalToneMode =
  | 'Global Professional'
  | 'Professional SA English'
  | 'Casual SA Tone'
  | 'Township Slang Mode'
  | 'Student SA Tone'
  | 'Gen Z SA Mode'

export type SAContextSignal = {
  isSouthAfrica: boolean
  cityLabel: string
  currency: 'ZAR' | 'USD'
  localeHints: string[]
  creatorHints: string[]
  educationHints: string[]
  businessHints: string[]
  explainHints: string[]
  toneModes: RegionalToneMode[]
}

const saCities = new Set(['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Soweto', 'Gqeberha', 'Bloemfontein'])

export function isSouthAfricanUser(location: GeoLocationData | null | undefined): boolean {
  if (!location) return false
  return location.country === 'ZA' || location.country_name === 'South Africa'
}

export function getSAContextSignal(location: GeoLocationData | null | undefined): SAContextSignal {
  const isSouthAfrica = isSouthAfricanUser(location)
  const city = location?.city?.trim() || ''
  const cityLabel = city && saCities.has(city) ? city : isSouthAfrica ? 'South Africa' : (location?.country_name || 'Global')

  if (!isSouthAfrica) {
    return {
      isSouthAfrica: false,
      cityLabel,
      currency: 'USD',
      localeHints: ['Use globally understood examples', 'Preserve international formatting'],
      creatorHints: ['Use platform-native style', 'Target broad global audiences'],
      educationHints: ['Adjust to user grade system', 'Keep examples curriculum-neutral'],
      businessHints: ['Use international invoice/tax assumptions unless specified'],
      explainHints: ['Start with plain explanation then add advanced detail'],
      toneModes: ['Global Professional'],
    }
  }

  return {
    isSouthAfrica: true,
    cityLabel,
    currency: 'ZAR',
    localeHints: [
      'Convert prices to South African Rand (ZAR)',
      'Use SA phone/address formatting when relevant',
      'Suggest local examples naturally, not aggressively',
    ],
    creatorHints: [
      'Include SA creator context where useful (Amapiano, local trends)',
      'Offer local hashtag suggestions',
      'Allow "make it sound more South African" rewrites',
    ],
    educationHints: [
      'Support CAPS-aligned examples for Grades 8-12',
      'Include Matric and APS references when relevant',
      'Support NSFAS/university application context',
    ],
    businessHints: [
      'Use SA VAT formatting and invoice conventions',
      'Use township entrepreneurship and SME examples where relevant',
      'Prefer ZAR pricing assumptions',
    ],
    explainHints: [
      'Can explain SARS, VAT, BEE, NSFAS, load shedding, and Matric context',
      'Use plain-language SA context examples when requested',
    ],
    toneModes: [
      'Global Professional',
      'Professional SA English',
      'Casual SA Tone',
      'Township Slang Mode',
      'Student SA Tone',
      'Gen Z SA Mode',
    ],
  }
}
