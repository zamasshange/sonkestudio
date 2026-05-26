import type { Tool } from '@/lib/tools-data'
import type { UserPreferences } from '@/lib/user-preferences'
import type { GeoLocationData, SeasonalContext } from '@/lib/geolocation'

function toolScore(tool: Tool) {
  return (tool.trending ? 3 : 0) + (tool.featured ? 2 : 0) + (tool.new ? 1 : 0)
}

// Country-specific tool priority maps
const countryToolPriority: Record<string, string[]> = {
  ZA: ['currency-converter', 'timezone-converter', 'cv-generator', 'biz-resume', 'ai-humanizer', 'ai-email', 'qr-generator'],
  IN: ['ai-essay', 'ai-grammar', 'math-solver', 'flashcard-generator', 'exam-prep', 'ai-paraphraser'],
  US: ['ai-resume', 'ai-email', 'ai-headline', 'marketing-generator', 'business-name', 'pitch-deck'],
  GB: ['cv-generator', 'ai-grammar', 'ai-essay', 'cover-letter', 'business-name'],
  NG: ['biz-resume', 'business-name', 'caption-generator', 'invoice-generator', 'marketing-generator'],
  KE: ['currency-converter', 'flashcard-generator', 'ai-essay', 'caption-generator', 'qr-generator'],
  AU: ['ai-resume', 'ai-email', 'currency-converter', 'timezone-converter', 'json-formatter'],
  CA: ['cv-generator', 'ai-essay', 'ai-grammar', 'cover-letter', 'qr-generator'],
  BR: ['caption-generator', 'viral-tweet', 'youtube-title', 'biz-resume', 'ai-bio'],
  PK: ['ai-essay', 'math-solver', 'ai-grammar', 'json-formatter', 'cv-generator'],
  PH: ['caption-generator', 'hashtag-generator', 'biz-resume', 'youtube-title', 'ai-email'],
  BD: ['flashcard-generator', 'ai-essay', 'json-formatter', 'cv-generator', 'ai-paraphraser'],
}

// Season-specific tool boosts
const seasonalToolBoosts: Record<string, string[]> = {
  exam: ['ai-essay', 'ai-paraphraser', 'flashcard-generator', 'math-solver', 'exam-prep', 'citation-generator', 'homework-explainer', 'ai-grammar', 'ai-simplify'],
  holiday: ['caption-generator', 'viral-tweet', 'youtube-title', 'tiktok-hook', 'hashtag-generator', 'ai-bio', 'biz-resume', 'business-name'],
  backToSchool: ['planner-generator', 'flashcard-generator', 'ai-essay', 'citation-generator', 'ai-grammar', 'homework-explainer'],
}

export function filterToolsForUser(allTools: Tool[], prefs: UserPreferences | null): Tool[] {
  if (!prefs?.toolCategories?.length) {
    return allTools
  }

  const filtered = allTools.filter((tool) => prefs.toolCategories.includes(tool.category))
  return filtered.length > 0 ? filtered : allTools
}

export function pickToolsForUser(
  pool: Tool[],
  prefs: UserPreferences | null,
  limit = 6,
): Tool[] {
  const filtered = filterToolsForUser(pool, prefs)
  return [...filtered].sort((a, b) => toolScore(b) - toolScore(a)).slice(0, limit)
}

export function matchesUserCategories(tool: Tool, prefs: UserPreferences | null): boolean {
  if (!prefs?.toolCategories?.length) return true
  return prefs.toolCategories.includes(tool.category)
}

/**
 * Smart sort tools for a user based on location, season, preferences, and trending.
 * Returns a new sorted array without mutating the input.
 */
export function sortToolsForUser(
  pool: Tool[],
  options: {
    location?: GeoLocationData | null
    season?: SeasonalContext | null
    prefs?: UserPreferences | null
  },
): Tool[] {
  const { location, season, prefs } = options
  const country = location?.country || ''
  const priorityIds = countryToolPriority[country] || []

  // Determine seasonal boost list
  let seasonalIds: string[] = []
  if (season?.isExamSeason) seasonalIds = seasonalToolBoosts.exam
  else if (season?.isHolidaySeason) seasonalIds = seasonalToolBoosts.holiday
  else if (season?.isBackToSchool) seasonalIds = seasonalToolBoosts.backToSchool

  const userCategoryIds = new Set(prefs?.toolCategories || [])

  function computeScore(tool: Tool): number {
    let score = 0

    // Base score from trending/featured/new
    score += toolScore(tool)

    // Usage count popularity (normalized to 0-5)
    score += Math.min(5, Math.floor((tool.usageCount || 0) / 50000))

    // Country-specific boost (+8)
    const countryIndex = priorityIds.indexOf(tool.id)
    if (countryIndex !== -1) score += 8 - countryIndex

    // Seasonal boost (+6)
    const seasonalIndex = seasonalIds.indexOf(tool.id)
    if (seasonalIndex !== -1) score += 6 - seasonalIndex

    // User preference category match (+4)
    if (userCategoryIds.has(tool.category)) score += 4

    // User favorite tools boost (+10)
    if (prefs?.favoriteTools?.includes(tool.id)) score += 10

    return score
  }

  return [...pool].sort((a, b) => computeScore(b) - computeScore(a))
}

/**
 * Get personalized lead tools for the tools page.
 */
export function getPersonalizedLeadTools(
  pool: Tool[],
  options: {
    location?: GeoLocationData | null
    season?: SeasonalContext | null
    prefs?: UserPreferences | null
  },
  limit = 8,
): Tool[] {
  const sorted = sortToolsForUser(pool, options)
  return sorted.slice(0, limit)
}
