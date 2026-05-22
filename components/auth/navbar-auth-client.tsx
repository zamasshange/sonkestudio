'use client'

import Link from 'next/link'
import { useAuth, UserButton } from '@clerk/nextjs'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserPreferences } from '@/hooks/use-user-preferences'

export function NavbarAuthClient() {
  const { isLoaded, isSignedIn } = useAuth()
  const { persona, hasDesk } = useUserPreferences()

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        {hasDesk && (
          <Link
            href="/tools?desk=1"
            className="hidden items-center gap-2 border border-border bg-white px-3 py-2 text-xs font-semibold uppercase text-foreground transition hover:border-primary/50 sm:inline-flex"
          >
            <LayoutGrid className="h-3.5 w-3.5 text-primary" />
            My desk
          </Link>
        )}
        {persona && (
          <span className="hidden rounded-sm border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[11px] font-semibold uppercase text-primary md:inline">
            {persona.label}
          </span>
        )}
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-9 w-9 border border-border rounded-sm sm:h-10 sm:w-10',
            },
          }}
          userProfileUrl="/account"
          afterSignOutUrl="/"
        />
      </div>
    )
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="hidden font-semibold uppercase sm:inline-flex">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button
        asChild
        size="sm"
        className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-foreground"
      >
        <Link href="/sign-up">
          <span className="hidden sm:inline">Get started</span>
          <span className="sm:hidden">Join</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </>
  )
}
