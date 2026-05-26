import { NextResponse } from 'next/server'
import { getLocationByIP, getSeasonalContext } from '@/lib/geolocation'

export async function GET(request: Request) {
  try {
    // Get client IP from headers (works with Vercel, Netlify, etc.)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || undefined

    const location = await getLocationByIP(ip)
    const season = getSeasonalContext(location?.timezone)

    return NextResponse.json({ location, season })
  } catch (err) {
    console.error('Location API error:', err)
    return NextResponse.json(
      { location: null, season: null, error: 'Location detection failed' },
      { status: 500 },
    )
  }
}
