'use client'

import { useState } from 'react'
import { SignUp } from '@clerk/nextjs'
import { AuthShell } from '@/components/auth/auth-shell'
import { useClerkMode } from '@/components/auth/clerk-mode-provider'
import { PreferencePicker } from '@/components/auth/preference-picker'
import { sonkeClerkAppearance } from '@/lib/clerk-appearance'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignUpPage() {
  const [step, setStep] = useState<'preferences' | 'account'>('preferences')
  const { disabled } = useClerkMode()

  if (disabled) {
    return (
      <AuthShell title="Get started locally" subtitle="Clerk is disabled on localhost">
        <div className="max-w-xl border border-border bg-white p-8">
          <p className="text-sm leading-7 text-muted-foreground">
            Local development is running in safe fallback mode, so the hosted Clerk sign-up widget is hidden here.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
              <Link href="/">Back home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-in">
                Go to sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Get started"
      subtitle={
        step === 'preferences'
          ? 'Tell us how you work'
          : 'Create your SONKE account'
      }
      sideContent={
        step === 'account' ? (
          <button
            type="button"
            onClick={() => setStep('preferences')}
            className="mb-6 text-sm font-semibold uppercase text-primary transition hover:text-foreground"
          >
            Edit preferences
          </button>
        ) : null
      }
    >
      {step === 'preferences' ? (
        <PreferencePicker onContinue={() => setStep('account')} />
      ) : (
        <SignUp
          appearance={sonkeClerkAppearance}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/onboarding"
        />
      )}
    </AuthShell>
  )
}
