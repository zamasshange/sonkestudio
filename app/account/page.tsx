'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUser, UserProfile } from '@clerk/nextjs'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  PreferencePicker,
  type PreferenceDraft,
} from '@/components/auth/preference-picker'
import { Button } from '@/components/ui/button'
import { pickToolsForUser } from '@/lib/filter-tools'
import { tools } from '@/lib/tools-data'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import {
  personaOptions,
  type UserPersona,
} from '@/lib/user-preferences'
import logoImage from '@/app/images/logo.png'

export default function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { prefs, persona } = useUserPreferences()
  const router = useRouter()
  const [draft, setDraft] = useState<PreferenceDraft>({
    persona: 'student',
    toolCategories: personaOptions[0].defaultCategories,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSecurity, setShowSecurity] = useState(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.replace('/sign-in')
      return
    }
    if (prefs) {
      setDraft({
        persona: prefs.persona,
        toolCategories: prefs.toolCategories,
      })
    }
  }, [isLoaded, isSignedIn, prefs, router])

  const deskTools = pickToolsForUser(tools, prefs, 8)

  const saveDesk = async () => {
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
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-28 sm:px-8">
        <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-muted-foreground">Your account</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">
              {user?.firstName ? `${user.firstName}'s desk` : 'My desk'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {persona?.label ?? 'Member'} · tools filtered to what you picked at sign-up
            </p>
          </div>
          <Link
            href="/tools?desk=1"
            className="inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold uppercase text-primary-foreground transition hover:bg-foreground"
          >
            Open my tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="border border-border bg-white p-5 sm:p-7">
              <p className="text-sm font-semibold uppercase text-muted-foreground">Desk filter</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Change your lane and tool systems — the tools page and homepage previews update to match.
              </p>
              <div className="mt-6">
                <PreferencePicker
                  showContinueButton={false}
                  compact
                  initialPersona={draft.persona as UserPersona}
                  initialCategories={draft.toolCategories}
                  onChange={setDraft}
                />
              </div>
              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
              <Button
                type="button"
                onClick={saveDesk}
                disabled={saving || draft.toolCategories.length === 0}
                className="mt-6 bg-primary text-primary-foreground hover:bg-foreground"
              >
                {saving ? 'Saving…' : 'Save desk preferences'}
              </Button>
            </section>

            <section className="border border-border bg-white p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase text-muted-foreground">On your desk now</p>
                <Link href="/tools?desk=1" className="text-xs font-semibold uppercase text-primary hover:text-foreground">
                  View all
                </Link>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {deskTools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="group flex items-center gap-3 border border-border bg-background p-3 transition hover:border-primary/40"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-white">
                        <Icon className="h-5 w-5" style={{ color: tool.iconColor }} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{tool.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">{tool.description}</span>
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="border border-border bg-foreground p-5 text-background sm:p-6">
              <Image src={logoImage} alt="" className="h-8 w-28 object-contain object-left brightness-0 invert" />
              <p className="mt-6 text-2xl font-semibold leading-tight">
                {user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'SONKE member'}
              </p>
              <p className="mt-2 text-sm text-background/65">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            <div className="border border-border bg-white p-5">
              <button
                type="button"
                onClick={() => setShowSecurity((value) => !value)}
                className="flex w-full items-center justify-between text-sm font-semibold uppercase text-foreground"
              >
                Security & profile
                <ArrowRight className={`h-4 w-4 transition ${showSecurity ? 'rotate-90' : ''}`} />
              </button>
              {showSecurity && (
                <div className="mt-4 overflow-hidden rounded-sm border border-border">
                  <UserProfile routing="hash" />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  )
}
