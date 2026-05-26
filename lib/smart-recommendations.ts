import type { GeoLocationData, SeasonalContext } from './geolocation'
import { tools } from './tools-data'

export interface SmartRecommendation {
  id: string
  title: string
  subtitle: string
  tools: typeof tools
  badge?: string
  priority: number
}

export function getSmartRecommendations(
  location: GeoLocationData | null,
  season: SeasonalContext,
  userRole?: string,
  recentTools?: string[],
): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = []
  const country = location?.country || ''

  // 1. Seasonal / Contextual picks (highest priority)
  if (season.isExamSeason) {
    recommendations.push({
      id: 'exam-season',
      title: 'Exam Season Toolkit',
      subtitle: `It's crunch time — here's everything you need`,
      tools: getToolsByTags(['exam', 'study', 'flashcards', 'quiz', 'notes', 'citation', 'planner']),
      badge: '🔥 Trending',
      priority: 100,
    })
  }

  if (season.isHolidaySeason) {
    recommendations.push({
      id: 'holiday-mode',
      title: 'Holiday Mode Activated',
      subtitle: 'Side hustles, content creation & skill building',
      tools: getToolsByTags(['caption', 'hashtags', 'youtube-title', 'tiktok-hook', 'viral-tweet', 'bio', 'resume']),
      badge: '✨ Seasonal',
      priority: 95,
    })
  }

  if (season.isBackToSchool) {
    recommendations.push({
      id: 'back-to-school',
      title: 'Back to School Ready',
      subtitle: 'Start the term strong with these essentials',
      tools: getToolsByTags(['planner', 'flashcards', 'notes', 'essay', 'citation', 'assignment']),
      badge: '🎒 Fresh Start',
      priority: 90,
    })
  }

  // 2. Location-based recommendations
  const countryRecs = getCountryRecommendations(country)
  if (countryRecs) {
    recommendations.push({
      id: 'near-you',
      title: countryRecs.title,
      subtitle: countryRecs.subtitle,
      tools: countryRecs.tools,
      badge: `📍 ${location?.city || location?.country_name || country}`,
      priority: 85,
    })
  }

  // 3. Role-based recommendations
  if (userRole) {
    const roleRecs = getRoleRecommendations(userRole)
    if (roleRecs) {
      recommendations.push({
        id: 'for-you',
        title: roleRecs.title,
        subtitle: roleRecs.subtitle,
        tools: roleRecs.tools,
        badge: '🎯 Personalized',
        priority: 80,
      })
    }
  }

  // 4. Recently used (if available)
  if (recentTools && recentTools.length > 0) {
    const recent = tools.filter((t) => recentTools.includes(t.id)).slice(0, 6)
    if (recent.length > 0) {
      recommendations.push({
        id: 'recent',
        title: 'Jump Back In',
        subtitle: 'Continue where you left off',
        tools: recent,
        badge: '🕐 Recent',
        priority: 75,
      })
    }
  }

  // 5. Default trending
  recommendations.push({
    id: 'trending',
    title: 'Trending Now',
    subtitle: 'What everyone is using this week',
    tools: getToolsByTags(['ai', 'pdf', 'image', 'qr', 'resume', 'email']),
    badge: '🔥 Popular',
    priority: 70,
  })

  // 6. Discovery
  recommendations.push({
    id: 'discover',
    title: 'You Might Like',
    subtitle: 'Based on your activity',
    tools: getToolsByTags(['script', 'hook', 'headline', 'grammar', 'paraphraser', 'simplify']),
    badge: '💡 Discover',
    priority: 60,
  })

  return recommendations.sort((a, b) => b.priority - a.priority)
}

function getToolsByTags(tags: string[]) {
  return tools
    .filter((t) => tags.some((tag) => t.tags.includes(tag) || t.id.includes(tag) || t.category.includes(tag)))
    .slice(0, 6)
}

function getCountryRecommendations(country: string): { title: string; subtitle: string; tools: typeof tools } | null {
  const map: Record<string, { title: string; subtitle: string; tags: string[] }> = {
    ZA: {
      title: 'Made for South Africa',
      subtitle: 'CV Builder, NSFAS tools, CAPS curriculum & more',
      tags: ['resume', 'cv', 'essay', 'flashcards', 'pdf', 'qr'],
    },
    IN: {
      title: 'Popular in India',
      subtitle: 'Exam prep, coding tools, freelancing essentials',
      tags: ['exam', 'code', 'json', 'html', 'css', 'resume'],
    },
    US: {
      title: 'Trending in the US',
      subtitle: 'Resume builders, AI writing, developer tools',
      tags: ['resume', 'ai', 'email', 'grammar', 'code', 'api'],
    },
    GB: {
      title: 'UK Favorites',
      subtitle: 'CV tools, essay help, exam prep',
      tags: ['resume', 'essay', 'citation', 'grammar', 'pdf'],
    },
    NG: {
      title: 'Nigeria Top Picks',
      subtitle: 'Business tools, CV builder, content creation',
      tags: ['resume', 'business', 'email', 'caption', 'hashtags'],
    },
    KE: {
      title: 'Kenya Essentials',
      subtitle: 'Study tools, business docs, social media',
      tags: ['flashcards', 'essay', 'resume', 'caption', 'qr'],
    },
    AU: {
      title: 'Australia Best Picks',
      subtitle: 'Resume, AI tools, developer utilities',
      tags: ['resume', 'ai', 'code', 'pdf', 'image'],
    },
    CA: {
      title: 'Canada Top Tools',
      subtitle: 'Resume builder, study aids, AI writing',
      tags: ['resume', 'essay', 'grammar', 'pdf', 'qr'],
    },
    BR: {
      title: 'Brazil Favorites',
      subtitle: 'Creator tools, resume, social media',
      tags: ['caption', 'hashtags', 'resume', 'bio', 'youtube-title'],
    },
    PK: {
      title: 'Pakistan Popular',
      subtitle: 'Exam prep, coding, freelancing tools',
      tags: ['exam', 'code', 'resume', 'pdf', 'essay'],
    },
    PH: {
      title: 'Philippines Top Picks',
      subtitle: 'Content creation, resume, study tools',
      tags: ['caption', 'hashtags', 'resume', 'flashcards', 'essay'],
    },
    BD: {
      title: 'Bangladesh Essentials',
      subtitle: 'Study tools, resume, coding help',
      tags: ['flashcards', 'essay', 'code', 'resume', 'pdf'],
    },
  }

  const rec = map[country]
  if (!rec) return null

  return {
    title: rec.title,
    subtitle: rec.subtitle,
    tools: getToolsByTags(rec.tags),
  }
}

function getRoleRecommendations(role: string): { title: string; subtitle: string; tools: typeof tools } | null {
  const map: Record<string, { title: string; subtitle: string; tags: string[] }> = {
    student: {
      title: 'Student Power Pack',
      subtitle: 'Everything you need to ace your studies',
      tags: ['flashcards', 'essay', 'citation', 'notes', 'quiz', 'planner', 'exam', 'assignment'],
    },
    creator: {
      title: 'Creator Studio',
      subtitle: 'Tools to grow your audience and content',
      tags: ['caption', 'hashtags', 'youtube-title', 'tiktok-hook', 'viral-tweet', 'script', 'bio', 'hook'],
    },
    developer: {
      title: 'Dev Toolbox',
      subtitle: 'Utilities to speed up your workflow',
      tags: ['api', 'json', 'html', 'css', 'regex', 'base64', 'diff', 'curl', 'jwt'],
    },
    freelancer: {
      title: 'Freelancer Kit',
      subtitle: 'Proposals, contracts, invoices & more',
      tags: ['resume', 'cover-letter', 'email', 'invoice', 'contract', 'proposal'],
    },
    business: {
      title: 'Business Essentials',
      subtitle: 'Grow your business with smart tools',
      tags: ['business', 'marketing', 'swot', 'competitor', 'pitch-deck', 'invoice'],
    },
  }

  const rec = map[role.toLowerCase()]
  if (!rec) return null

  return {
    title: rec.title,
    subtitle: rec.subtitle,
    tools: getToolsByTags(rec.tags),
  }
}

export function getHeroMessage(location?: GeoLocationData | null, season?: SeasonalContext): string {
  if (season?.isExamSeason) {
    return "You've got this. Let's crush those exams."
  }
  if (season?.isHolidaySeason) {
    return 'Time to create, hustle, and level up.'
  }
  if (season?.isBackToSchool) {
    return 'New term, new goals. Start strong.'
  }
  if (location?.country === 'ZA') {
    return 'Built with South African creators in mind.'
  }
  if (location?.country === 'IN') {
    return 'Tools that understand your grind.'
  }
  return 'The right workspace appears when the job changes.'
}
