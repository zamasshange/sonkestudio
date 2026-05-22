'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  PreferencePicker,
  type PreferenceDraft,
} from '@/components/auth/preference-picker'
import { Button } from '@/components/ui/button'
import logoImage from '@/app/images/logo.png'
import {
  SIGNUP_PREFS_KEY,
  personaOptions,
  type UserPersona,
} from '@/lib/user-preferences'

export default function OnboardingPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<PreferenceDraft>({
    persona: 'student',
    toolCategories: personaOptions[0].defaultCategories,
  })

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.replace('/sign-up')
      return
    }

    const onboardingComplete = Boolean(user?.publicMetadata?.onboardingComplete)
    if (onboardingComplete) {
      router.replace('/tools')
    }
  }, [isLoaded, isSignedIn, router, user?.publicMetadata?.onboardingComplete])

  useEffect(() => {
    const stored = sessionStorage.getItem(SIGNUP_PREFS_KEY)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored) as PreferenceDraft
      if (parsed.persona && parsed.toolCategories?.length) {
        setDraft(parsed)
      }
    } catch {
      // ignore invalid draft
    }
  }, [])

  const savePreferences = async () => {
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: draft.persona,
          toolCategories: draft.toolCategories,
          onboardingComplete: true,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error ?? 'Could not save your preferences')
      }

      sessionStorage.removeItem(SIGNUP_PREFS_KEY)
      await user?.reload()
      router.replace('/tools')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-[760px]">
        <Link href="/" className="inline-flex h-14 w-40 items-center">
          <Image src={logoImage} alt="SONKE logo" className="h-full w-full object-contain object-left" />
        </Link>

        <div className="mt-10 border border-border bg-white p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase text-muted-foreground">Almost there</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Finish setting up your desk
          </h1>
          <p className="mt-3 text-muted-foreground">
            Confirm your persona and tool systems so SONKE can prioritize what matters to you.
          </p>

          <div className="mt-8">
            <PreferencePicker
              showContinueButton={false}
              compact
              initialPersona={draft.persona as UserPersona}
              initialCategories={draft.toolCategories}
              onChange={setDraft}
            />
          </div>

          {error && (
            <p className="mt-4 text-sm font-medium text-destructive">{error}</p>
          )}

          <Button
            type="button"
            onClick={savePreferences}
            disabled={saving}
            className="mt-6 w-full bg-primary text-primary-foreground hover:bg-foreground"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving your desk...
              </>
            ) : (
              <>
                Open my tools
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}
