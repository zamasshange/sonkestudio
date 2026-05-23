import { NextRequest, NextResponse } from 'next/server'
import { getBitlyToken } from '@/lib/server/integrations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const longUrl = typeof body.url === 'string' ? body.url.trim() : ''
    const customDomain = typeof body.domain === 'string' ? body.domain.trim() : undefined

    if (!longUrl) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    let parsed: URL
    try {
      parsed = new URL(longUrl.startsWith('http') ? longUrl : `https://${longUrl}`)
    } catch {
      return NextResponse.json({ error: 'Enter a valid URL' }, { status: 400 })
    }

    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getBitlyToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        long_url: parsed.toString(),
        domain: customDomain || undefined,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      const message =
        typeof data.message === 'string'
          ? data.message
          : typeof data.description === 'string'
            ? data.description
            : 'Bitly could not shorten this link'
      return NextResponse.json({ error: message }, { status: response.status })
    }

    return NextResponse.json({
      id: data.id,
      link: data.link,
      longUrl: data.long_url,
    })
  } catch (error) {
    console.error('shorten error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to shorten URL' },
      { status: 500 },
    )
  }
}
