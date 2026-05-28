'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { ArrowRight, Loader2, Globe, BookOpen, Heart, Wrench } from 'lucide-react'
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
import { tools } from '@/lib/tools-data'
import { useClerkMode } from '@/components/auth/clerk-mode-provider'

type OnboardingStep = 'persona' | 'details' | 'tools'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'af', label: 'Afrikaans' },
  { code: 'zu', label: 'isiZulu' },
  { code: 'xh', label: 'isiXhosa' },
  { code: 'st', label: 'Sesotho' },
  { code: 'tn', label: 'Setswana' },
]

const interestOptions = [
  'AI & Automation',
  'Content Creation',
  'Coding & Development',
  'Studying & Learning',
  'Business & Marketing',
  'Design & Media',
  'Social Media Growth',
  'Productivity',
]

const gradeOptions = [
  'Grade 8-9',
  'Grade 10-11',
  'Grade 12 (Matric)',
  'University / College',
  'Postgraduate',
]

export default function OnboardingPage() {
  const { disabled } = useClerkMode()

  if (disabled) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-xl border border-border bg-white p-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Onboarding unavailable locally</p>
          <h1 className="mt-4 text-3xl font-semibold text-foreground">Clerk is disabled on localhost</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            The app falls back to a local-safe mode on your machine so the site can open without the live Clerk key.
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
  const [step, setStep] = useState<OnboardingStep>('persona')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<PreferenceDraft>({
    persona: 'student',
    toolCategories: personaOptions[0].defaultCategories,
  })
  const [grade, setGrade] = useState('')
  const [language, setLanguage] = useState('en')
  const [interests, setInterests] = useState<string[]>([])
  const [favoriteTools, setFavoriteTools] = useState<string[]>([])

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

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const toggleFavoriteTool = (toolId: string) => {
    setFavoriteTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    )
  }

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
          grade: draft.persona === 'student' ? grade : undefined,
          language,
          interests,
          favoriteTools,
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

  const progress = step === 'persona' ? 33 : step === 'details' ? 66 : 100

  return (
    <main className="min-h-screen bg-background px-5 pb-16 pt-32 sm:px-8 lg:pt-36">
      <div className="mx-auto max-w-[760px]">
        <Link href="/" className="inline-flex h-14 w-40 items-center">
          <Image src={logoImage} alt="SONKE logo" className="h-full w-full object-contain object-left" />
        </Link>

        <div className="mt-10 border border-border bg-white p-6 sm:p-8">
          {/* Progress bar */}
          <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {step === 'persona' && (
            <>
              <p className="text-sm font-semibold uppercase text-muted-foreground">Step 1 of 3</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                What best describes you?
              </h1>
              <p className="mt-3 text-muted-foreground">
                SONKE adapts your homepage, recommendations, and tool priority based on your role.
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
              <Button
                type="button"
                onClick={() => setStep('details')}
                className="mt-6 w-full bg-primary text-primary-foreground hover:bg-foreground"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {step === 'details' && (
            <>
              <p className="text-sm font-semibold uppercase text-muted-foreground">Step 2 of 3</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Tell us a bit more
              </h1>
              <p className="mt-3 text-muted-foreground">
                This helps us personalize your experience even further.
              </p>

              <div className="mt-8 space-y-6">
                {/* Language */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Globe className="h-4 w-4 text-primary" />
                    Preferred language
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                          language === lang.code
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-background text-foreground hover:border-foreground/30'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grade (only for students) */}
                {draft.persona === 'student' && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <BookOpen className="h-4 w-4 text-primary" />
                      What grade / level?
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {gradeOptions.map((g) => (
                        <button
                          key={g}
                          onClick={() => setGrade(g)}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                            grade === g
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background text-foreground hover:border-foreground/30'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Heart className="h-4 w-4 text-primary" />
                    What are you interested in?
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                          interests.includes(interest)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-background text-foreground hover:border-foreground/30'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('persona')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep('tools')}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-foreground"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {step === 'tools' && (
            <>
              <p className="text-sm font-semibold uppercase text-muted-foreground">Step 3 of 3</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Pick your favorite tools
              </h1>
              <p className="mt-3 text-muted-foreground">
                Select up to 5 tools you use most. We'll pin them to your dashboard.
              </p>

              <div className="mt-8">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Wrench className="h-4 w-4 text-primary" />
                  Select tools ({favoriteTools.length}/5)
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {tools.slice(0, 20).map((tool) => {
                    const Icon = tool.icon
                    const selected = favoriteTools.includes(tool.id)
                    return (
                      <button
                        key={tool.id}
                        onClick={() => toggleFavoriteTool(tool.id)}
                        className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                          selected
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-background text-foreground hover:border-foreground/30'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-medium">{tool.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm font-medium text-destructive">{error}</p>
              )}

              <div className="mt-8 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('details')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={savePreferences}
                  disabled={saving}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-foreground"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Open my tools
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
