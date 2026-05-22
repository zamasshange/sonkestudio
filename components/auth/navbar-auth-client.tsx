'use client'

import Link from 'next/link'
import { useAuth, UserButton } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'
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
      <div className="flex items-center gap-2">
        {hasDesk && (
          <Link
            href="/tools?desk=1"
            className="inline-flex max-w-[9.5rem] items-center gap-2 whitespace-nowrap rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-semibold uppercase leading-none tracking-wide text-foreground transition hover:border-primary/40 sm:max-w-none sm:px-3.5 sm:text-xs"
            title={persona ? `${persona.label} workspace` : 'My desk'}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span className="truncate">
              {persona ? `${persona.label}` : 'My desk'}
            </span>
          </Link>
        )}
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'h-9 w-9 rounded-full border border-border sm:h-10 sm:w-10',
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
