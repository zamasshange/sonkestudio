'use client'

import { useMemo } from 'react'
import { useUser } from '@clerk/nextjs'
import {
  parseUserPreferences,
  personaOptions,
  type UserPreferences,
} from '@/lib/user-preferences'
import { useClerkMode } from '@/components/auth/clerk-mode-provider'

export function useUserPreferences() {
  const { disabled } = useClerkMode()

  if (disabled) {
    return {
      prefs: null,
      persona: undefined,
      hasDesk: false,
      isLoaded: true,
      isSignedIn: false,
    }
  }

  const { user, isLoaded, isSignedIn } = useUser()

  const prefs = useMemo<UserPreferences | null>(() => {
    if (!isSignedIn || !user) return null
    return parseUserPreferences(user.publicMetadata as Record<string, unknown>)
  }, [isSignedIn, user])

  const persona = useMemo(
    () => personaOptions.find((option) => option.id === prefs?.persona),
    [prefs?.persona],
  )

  const hasDesk = Boolean(prefs?.onboardingComplete && prefs.toolCategories.length > 0)

  return {
    prefs,
    persona,
    hasDesk,
    isLoaded,
    isSignedIn,
  }
}
