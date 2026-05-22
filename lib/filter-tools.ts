import type { Tool } from '@/lib/tools-data'
import type { UserPreferences } from '@/lib/user-preferences'

function toolScore(tool: Tool) {
  return (tool.trending ? 3 : 0) + (tool.featured ? 2 : 0) + (tool.new ? 1 : 0)
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
