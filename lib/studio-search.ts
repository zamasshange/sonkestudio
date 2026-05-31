import { careerInterestTracks } from '@/lib/career-opportunities'
import { categories, searchTools, type Tool } from '@/lib/tools-data'

export type StudioSearchCareerHit = {
  type: 'career'
  id: string
  label: string
  query: string
  href: string
}

export type StudioSearchPageHit = {
  type: 'page'
  id: string
  label: string
  description: string
  href: string
}

export type StudioSearchToolHit = {
  type: 'tool'
  tool: Tool
}

export type StudioSearchHit = StudioSearchToolHit | StudioSearchCareerHit | StudioSearchPageHit

const studioPages: StudioSearchPageHit[] = [
  { type: 'page', id: 'tools', label: 'All tools', description: 'Browse the full SONKE toolbox', href: '/tools' },
  { type: 'page', id: 'career', label: 'Career Hub', description: 'Live jobs, internships, and application AI', href: '/career' },
  { type: 'page', id: 'learn', label: 'Learn', description: 'Guides for students and builders', href: '/learn' },
  { type: 'page', id: 'blog', label: 'Blog', description: 'Workflow tips and platform updates', href: '/blog' },
]

function matchesCareerTrack(query: string) {
  const q = query.toLowerCase()
  return careerInterestTracks.filter(
    (track) =>
      track.label.toLowerCase().includes(q) ||
      track.query.toLowerCase().includes(q) ||
      track.id.includes(q),
  )
}

export function searchStudio(query: string, limit = 8): StudioSearchHit[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const q = trimmed.toLowerCase()
  const hits: StudioSearchHit[] = []

  const pageHits = studioPages.filter(
    (page) =>
      page.label.toLowerCase().includes(q) ||
      page.description.toLowerCase().includes(q),
  )
  hits.push(...pageHits)

  const categoryHits = categories
    .filter((cat) => cat.name.toLowerCase().includes(q) || cat.id.includes(q))
    .slice(0, 2)
    .map(
      (cat): StudioSearchPageHit => ({
        type: 'page',
        id: `cat-${cat.id}`,
        label: `${cat.name} tools`,
        description: cat.description,
        href: `/tools/category/${cat.id}`,
      }),
    )
  hits.push(...categoryHits)

  matchesCareerTrack(trimmed).slice(0, 3).forEach((track) => {
    hits.push({
      type: 'career',
      id: track.id,
      label: track.label,
      query: track.query,
      href: `/career?query=${encodeURIComponent(track.query)}`,
    })
  })

  if (/job|career|intern|learnership|bursary|graduate|cv|resume|apply/i.test(trimmed)) {
    hits.push({
      type: 'career',
      id: 'career-search',
      label: `Search careers for “${trimmed}”`,
      query: trimmed,
      href: `/career?query=${encodeURIComponent(trimmed)}`,
    })
  }

  searchTools(trimmed)
    .slice(0, limit)
    .forEach((tool) => hits.push({ type: 'tool', tool }))

  const seen = new Set<string>()
  return hits.filter((hit) => {
    const key =
      hit.type === 'tool'
        ? `tool-${hit.tool.id}`
        : hit.type === 'career'
          ? `career-${hit.id}`
          : `page-${hit.id}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, limit)
}

export function studioSearchHref(query: string) {
  const trimmed = query.trim()
  if (!trimmed) return '/tools'
  if (/job|career|intern|learnership|bursary|graduate|apply/i.test(trimmed)) {
    return `/career?query=${encodeURIComponent(trimmed)}`
  }
  return `/tools?q=${encodeURIComponent(trimmed)}`
}
