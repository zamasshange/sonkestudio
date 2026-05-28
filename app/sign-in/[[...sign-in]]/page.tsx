"use client"

import Link from 'next/link'
import { SignIn } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { useClerkMode } from '@/components/auth/clerk-mode-provider'
import { Button } from '@/components/ui/button'
import { sonkeClerkAppearance } from '@/lib/clerk-appearance'

export default function SignInPage() {
  const { disabled } = useClerkMode()

  if (disabled) {
    return (
      <AuthShell title="Sign in unavailable locally" subtitle="Clerk is disabled on localhost">
        <div className="max-w-xl border border-border bg-white p-8">
          <p className="text-sm leading-7 text-muted-foreground">
            The live Clerk keys only work on the deployed domain, so local development uses a safe fallback instead of the hosted sign-in widget.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
              <Link href="/">Back home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sign-up">
                Go to sign up
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your SONKE desk">
      <SignInClient />
    </AuthShell>
  )
}

function SignInClient() {
  return (
    <SignIn
      appearance={sonkeClerkAppearance}
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      forceRedirectUrl="/onboarding"
    />
  )
}
