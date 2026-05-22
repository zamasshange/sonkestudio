import { SignIn } from '@clerk/nextjs'
import { AuthShell } from '@/components/auth/auth-shell'
import { sonkeClerkAppearance } from '@/lib/clerk-appearance'

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your SONKE desk">
      <SignIn
        appearance={sonkeClerkAppearance}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/onboarding"
      />
    </AuthShell>
  )
}
