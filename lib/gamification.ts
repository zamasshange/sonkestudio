export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  totalToolsUsed: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  progress: number
  target: number
}

const STREAK_KEY = 'sonke-streak'
const ACHIEVEMENTS_KEY = 'sonke-achievements'

export function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: '', totalToolsUsed: 0 }
  }

  const raw = localStorage.getItem(STREAK_KEY)
  if (raw) {
    return JSON.parse(raw)
  }

  const initial: StreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    totalToolsUsed: 0,
  }
  localStorage.setItem(STREAK_KEY, JSON.stringify(initial))
  return initial
}

export function recordToolUsage(toolId: string) {
  if (typeof window === 'undefined') return

  const data = getStreakData()
  const today = new Date().toISOString().split('T')[0]

  data.totalToolsUsed += 1

  if (data.lastActiveDate === today) {
    // Already active today, just update total
    localStorage.setItem(STREAK_KEY, JSON.stringify(data))
    checkAchievements(data)
    return
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (data.lastActiveDate === yesterdayStr) {
    data.currentStreak += 1
  } else {
    data.currentStreak = 1
  }

  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak
  }

  data.lastActiveDate = today
  localStorage.setItem(STREAK_KEY, JSON.stringify(data))
  checkAchievements(data)
}

export function getAchievements(): Achievement[] {
  if (typeof window === 'undefined') return getDefaultAchievements()

  const raw = localStorage.getItem(ACHIEVEMENTS_KEY)
  if (raw) return JSON.parse(raw)

  const defaults = getDefaultAchievements()
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaults))
  return defaults
}

function getDefaultAchievements(): Achievement[] {
  return [
    {
      id: 'first-tool',
      title: 'First Steps',
      description: 'Use your first tool',
      icon: '🚀',
      unlocked: false,
      progress: 0,
      target: 1,
    },
    {
      id: 'explorer',
      title: 'AI Explorer',
      description: 'Use 10 different tools',
      icon: '🧭',
      unlocked: false,
      progress: 0,
      target: 10,
    },
    {
      id: 'power-user',
      title: 'Power User',
      description: 'Use 50 tools total',
      icon: '⚡',
      unlocked: false,
      progress: 0,
      target: 50,
    },
    {
      id: 'streak-3',
      title: 'On Fire',
      description: '3-day usage streak',
      icon: '🔥',
      unlocked: false,
      progress: 0,
      target: 3,
    },
    {
      id: 'streak-7',
      title: 'Study Warrior',
      description: '7-day usage streak',
      icon: '🔥🔥',
      unlocked: false,
      progress: 0,
      target: 7,
    },
    {
      id: 'streak-30',
      title: 'Productivity Beast',
      description: '30-day usage streak',
      icon: '👑',
      unlocked: false,
      progress: 0,
      target: 30,
    },
    {
      id: 'creator-pro',
      title: 'Creator Pro',
      description: 'Use 5 creator tools',
      icon: '🎨',
      unlocked: false,
      progress: 0,
      target: 5,
    },
    {
      id: 'dev-master',
      title: 'Dev Master',
      description: 'Use 5 developer tools',
      icon: '💻',
      unlocked: false,
      progress: 0,
      target: 5,
    },
    {
      id: 'resume-master',
      title: 'Resume Master',
      description: 'Build 3 resumes',
      icon: '📄',
      unlocked: false,
      progress: 0,
      target: 3,
    },
    {
      id: 'study-genius',
      title: 'Study Genius',
      description: 'Use 10 study tools',
      icon: '🎓',
      unlocked: false,
      progress: 0,
      target: 10,
    },
  ]
}

function checkAchievements(streak: StreakData) {
  const achievements = getAchievements()
  let updated = false

  for (const ach of achievements) {
    if (ach.unlocked) continue

    let newProgress = ach.progress

    switch (ach.id) {
      case 'first-tool':
      case 'explorer':
      case 'power-user':
        newProgress = streak.totalToolsUsed
        break
      case 'streak-3':
      case 'streak-7':
      case 'streak-30':
        newProgress = streak.currentStreak
        break
    }

    if (newProgress >= ach.target && !ach.unlocked) {
      ach.unlocked = true
      ach.unlockedAt = new Date().toISOString()
      updated = true
    }
    ach.progress = Math.min(newProgress, ach.target)
  }

  if (updated) {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements))
  }
}

export function trackToolOpen(toolId: string, toolName: string, category: string) {
  recordToolUsage(toolId)

  // Track in PostHog if available
  if (typeof window !== 'undefined') {
    try {
      // Dynamic import to avoid SSR issues
      import('posthog-js').then((posthogModule) => {
        const posthog = posthogModule.default
        if (posthog?.capture) {
          posthog.capture('tool_opened', {
            tool_id: toolId,
            tool_name: toolName,
            category,
          })
        }
      })
    } catch {
      // PostHog not available
    }
  }
}
