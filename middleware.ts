import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  if (!userId || !isAuthRoute(request)) {
    return
  }

  return NextResponse.redirect(new URL('/onboarding', request.url))
})

// Only run Clerk middleware on auth-related routes (not every tool page)
export const config = {
  matcher: [
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/onboarding',
    '/account',
    '/api/user/preferences',
  ],
}
