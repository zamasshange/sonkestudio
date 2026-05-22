"use client"

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

function scrollToHashOrTop() {
  const hash = window.location.hash

  if (hash) {
    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (target) {
      target.scrollIntoView({ block: 'start' })
      return
    }
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

function ScrollRestorationInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(scrollToHashOrTop)
  }, [pathname, searchParams])

  useEffect(() => {
    const handleHashChange = () => requestAnimationFrame(scrollToHashOrTop)

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return null
}

export function ScrollRestoration() {
  return (
    <Suspense fallback={null}>
      <ScrollRestorationInner />
    </Suspense>
  )
}
