const globalCareer = globalThis as typeof globalThis & {
  __sonkeJsearchPausedUntil?: number
}

const JSEARCH_COOLDOWN_MS = 60 * 60 * 1000

export function isJSearchPaused() {
  const until = globalCareer.__sonkeJsearchPausedUntil || 0
  return Date.now() < until
}

export function pauseJSearch(durationMs = JSEARCH_COOLDOWN_MS) {
  globalCareer.__sonkeJsearchPausedUntil = Date.now() + durationMs
}

export function sanitizeProviderError(provider: 'jsearch' | 'adzuna', message: string | null) {
  if (!message) return null
  const lower = message.toLowerCase()
  if (provider === 'jsearch' && (lower.includes('429') || lower.includes('quota') || lower.includes('rate limit'))) {
    return 'Temporarily unavailable (API quota). Using Adzuna for live listings.'
  }
  if (lower.includes('not configured') || lower.includes('missing')) return message
  if (message.length > 120) return `${message.slice(0, 117)}…`
  return message
}

export function isRateLimitMessage(message: string) {
  const lower = message.toLowerCase()
  return lower.includes('429') || lower.includes('quota') || lower.includes('rate limit') || lower.includes('too many')
}
