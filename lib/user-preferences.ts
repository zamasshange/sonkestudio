import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Code2,
  GraduationCap,
  Palette,
  Wrench,
} from 'lucide-react'

export type UserPersona =
  | 'student'
  | 'creator'
  | 'business'
  | 'developer'
  | 'everyday'

export interface PersonaOption {
  id: UserPersona
  label: string
  description: string
  icon: LucideIcon
  defaultCategories: string[]
}

export const personaOptions: PersonaOption[] = [
  {
    id: 'student',
    label: 'Student',
    description: 'Homework, study planners, citations, and exam prep.',
    icon: GraduationCap,
    defaultCategories: ['student', 'ai-text', 'explain'],
  },
  {
    id: 'creator',
    label: 'Creator',
    description: 'Captions, hooks, scripts, and social content workflows.',
    icon: Palette,
    defaultCategories: ['creator', 'ai-text', 'document'],
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Pitch decks, meetings, market research, and proposals.',
    icon: Briefcase,
    defaultCategories: ['business', 'document', 'ai-text'],
  },
  {
    id: 'developer',
    label: 'Developer',
    description: 'Formatters, regex, JWT helpers, and API debugging.',
    icon: Code2,
    defaultCategories: ['developer', 'explain', 'everyday'],
  },
  {
    id: 'everyday',
    label: 'Everyday',
    description: 'PDFs, QR codes, utilities, and quick daily fixes.',
    icon: Wrench,
    defaultCategories: ['everyday', 'document', 'ai-text'],
  },
]

export interface UserPreferences {
  persona: UserPersona
  toolCategories: string[]
  onboardingComplete: boolean
}

export const SIGNUP_PREFS_KEY = 'sonke_signup_preferences'

export function parseUserPreferences(
  metadata: Record<string, unknown> | undefined,
): UserPreferences | null {
  if (!metadata?.persona || !Array.isArray(metadata.toolCategories)) {
    return null
  }

  return {
    persona: metadata.persona as UserPersona,
    toolCategories: metadata.toolCategories as string[],
    onboardingComplete: Boolean(metadata.onboardingComplete),
  }
}
