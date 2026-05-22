'use client'

import { useMemo } from 'react'
import { useUser } from '@clerk/nextjs'
import {
  parseUserPreferences,
  personaOptions,
  type UserPreferences,
} from '@/lib/user-preferences'

export function useUserPreferences() {
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
