'use client'

import { Suspense, useEffect } from 'react'
import posthog from 'posthog-js'
import { usePathname, useSearchParams } from 'next/navigation'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!POSTHOG_KEY || !POSTHOG_HOST) return

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: true,
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug()
      },
    })
  }, [])

  useEffect(() => {
    if (!POSTHOG_KEY) return
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  )
}

export { posthog }
