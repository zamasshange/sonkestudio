'use client'

import { useState } from 'react'
import { SignUp } from '@clerk/nextjs'
import { AuthShell } from '@/components/auth/auth-shell'
import { PreferencePicker } from '@/components/auth/preference-picker'
import { sonkeClerkAppearance } from '@/lib/clerk-appearance'

export default function SignUpPage() {
  const [step, setStep] = useState<'preferences' | 'account'>('preferences')

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
