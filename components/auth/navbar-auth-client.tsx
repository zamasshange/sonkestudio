'use client'

import Link from 'next/link'
import { useAuth, UserButton } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NavbarAuthClient() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'h-10 w-10 border border-border rounded-sm',
          },
        }}
        afterSignOutUrl="/"
      />
    )
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="font-semibold uppercase">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button
        asChild
        size="sm"
        className="bg-primary font-semibold uppercase text-primary-foreground hover:bg-foreground"
      >
        <Link href="/sign-up">
          Get started
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </>
  )
}
