'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { AccountWorkspace } from '@/components/account/account-workspace'
import type { PreferenceDraft } from '@/components/auth/preference-picker'

export default function AccountPage() {
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
      <Navbar />
      <AccountWorkspace user={user} onSaveDesk={saveDesk} saving={saving} error={error} />
      <Footer />
    </main>
  )
}
