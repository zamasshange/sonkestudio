'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { AccountWorkspace } from '@/components/account/account-workspace'
import { useClerkMode } from '@/components/auth/clerk-mode-provider'
import type { PreferenceDraft } from '@/components/auth/preference-picker'

export default function AccountPage() {
  const { disabled } = useClerkMode()

  if (disabled) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-xl border border-border bg-white p-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Account unavailable locally</p>
          <h1 className="mt-4 text-3xl font-semibold text-foreground">Clerk is disabled on localhost</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            The live Clerk key only works on the deployed domain, so the local app skips auth and uses fallback mode.
          </p>
          <Link href="/" className="mt-6 inline-flex items-center justify-center border border-border bg-foreground px-5 py-3 text-sm font-semibold text-background">
            Return home
          </Link>
        </div>
      </main>
    )
  }

  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.replace('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  const saveDesk = async (draft: PreferenceDraft) => {
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
        throw new Error('Could not update your desk')
      }
      await user?.reload()
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
    <main className="min-h-screen overflow-x-hidden bg-background">
      <AccountWorkspace user={user} onSaveDesk={saveDesk} saving={saving} error={error} />
    </main>
  )
}
