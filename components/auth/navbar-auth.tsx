'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NavbarAuthClient = dynamic(
  () => import('./navbar-auth-client').then((mod) => mod.NavbarAuthClient),
  {
    ssr: false,
    loading: () => (
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
    ),
  },
)

export function NavbarAuth() {
  return (
    <div className="hidden items-center gap-3 md:flex">
      <NavbarAuthClient />
    </div>
  )
}
