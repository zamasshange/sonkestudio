import { NextRequest, NextResponse } from 'next/server'
import { tools } from '@/lib/tools-data'

export const runtime = 'nodejs'

type SectionConfig = {
  id: string
  title: string
  subtitle: string
  badge: string
  priority: number
  tags: string[]
}

function normalizeList(value: string | null) {
  return (value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

function noise(key: string, seed: number) {
  let hash = seed || 17
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 33 + key.charCodeAt(index)) % 10007
  }
  return hash / 10007
}

function toolMatches(tool: (typeof tools)[number], tags: string[]) {
  const haystack = `${tool.id} ${tool.name} ${tool.description} ${tool.category} ${tool.tags.join(' ')}`.toLowerCase()
  return tags.reduce((score, tag) => score + (haystack.includes(tag) ? 1 : 0), 0)
}

function pickTools(tags: string[], seed: number, recentIds: string[]) {
  return tools
    .map((tool) => {
      const matches = toolMatches(tool, tags)
      const trendWeight = (tool.usageCount || 0) / 1500
      const recencyPenalty = recentIds.includes(tool.id) ? -18 : 0
      const score =
        matches * 90 +
        trendWeight +
        (tool.trending ? 42 : 0) +
        (tool.featured ? 24 : 0) +
        (tool.new ? 18 : 0) +
        recencyPenalty +
        noise(tool.id, seed) * 60
      return { tool, score }
    })
    .filter((item) => item.score > 15)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => item.tool.id)
}

function buildSections(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const country = (params.get('country') || '').toUpperCase()
  const city = params.get('city') || ''
  const role = (params.get('role') || '').toLowerCase()
  const recentIds = normalizeList(params.get('recent'))
  const seed = Number(params.get('seed')) || Math.floor(Date.now() / 300000)
  const isExamSeason = params.get('exam') === 'true'
  const isHolidaySeason = params.get('holiday') === 'true'
  const isBackToSchool = params.get('backToSchool') === 'true'

  const sections: SectionConfig[] = []

  if (isExamSeason) {
    sections.push({
      id: 'exam-season',
      title: 'Exam Season Toolkit',
      subtitle: "It's crunch time - refreshed study tools for this moment",
      badge: 'Trending',
      priority: 100,
      tags: ['exam', 'study', 'flashcards', 'quiz', 'notes', 'citation', 'planner', 'math', 'homework'],
    })
  }

  if (isHolidaySeason) {
    sections.push({
      id: 'holiday-mode',
      title: 'Holiday Mode Activated',
      subtitle: 'Side hustles, creator workflows, and skill-building tools',
      badge: 'Seasonal',
      priority: 96,
      tags: ['caption', 'hashtags', 'youtube', 'tiktok', 'viral', 'bio', 'resume', 'business'],
    })
  }

  if (isBackToSchool) {
    sections.push({
      id: 'back-to-school',
      title: 'Back to School Ready',
      subtitle: 'Fresh tools for a strong term start',
      badge: 'Fresh',
      priority: 94,
      tags: ['planner', 'flashcards', 'notes', 'essay', 'citation', 'assignment', 'quiz'],
    })
  }

  if (country === 'ZA') {
    sections.push({
      id: 'near-you',
      title: city ? `Trending near ${city}` : 'Trending in South Africa',
      subtitle: 'Local study, career, ZAR, and creator workflows',
      badge: 'ZA pulse',
      priority: 92,
      tags: ['career', 'resume', 'cv', 'internship', 'flashcards', 'math', 'invoice', 'currency', 'caption'],
    })
  }

  if (role) {
    const roleTags: Record<string, string[]> = {
      student: ['flashcards', 'essay', 'citation', 'notes', 'quiz', 'planner', 'exam', 'assignment'],
      creator: ['caption', 'hashtags', 'youtube', 'tiktok', 'viral', 'script', 'bio', 'hook'],
      developer: ['api', 'json', 'html', 'css', 'regex', 'base64', 'diff', 'curl', 'jwt'],
      freelancer: ['resume', 'cover', 'email', 'invoice', 'contract', 'business'],
      business: ['business', 'marketing', 'swot', 'competitor', 'pitch', 'invoice'],
    }
    sections.push({
      id: 'for-you',
      title: 'For Your Desk',
      subtitle: 'Personalized from your SONKE role',
      badge: 'Personalized',
      priority: 88,
      tags: roleTags[role] || [role, 'ai', 'pdf', 'resume', 'email'],
    })
  }

  sections.push(
    {
      id: 'trending',
      title: 'Trending Now',
      subtitle: 'What SONKE users are opening this week',
      badge: 'Popular',
      priority: 80,
      tags: ['ai', 'pdf', 'resume', 'email', 'qr', 'currency', 'career', 'humanizer'],
    },
    {
      id: 'discover',
      title: 'You Might Like',
      subtitle: 'A rotating mix from the live SONKE toolbox',
      badge: 'Refreshing',
      priority: 70,
      tags: ['script', 'hook', 'headline', 'grammar', 'paraphraser', 'simplify', 'creator', 'student'],
    },
  )

  return sections
    .map((section, index) => ({
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      badge: section.badge,
      priority: section.priority,
      tools: pickTools(section.tags, seed + index * 101, recentIds),
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      sections: buildSections(request),
      refreshedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  )
}
