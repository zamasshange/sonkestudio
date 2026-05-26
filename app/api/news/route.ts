import { NextResponse } from 'next/server'

const API_KEY = process.env.NEWS_API_KEY

export async function GET(request: Request) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'News API key not configured' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'technology'
  const country = searchParams.get('country') || 'za'
  const query = searchParams.get('q')
  const pageSize = searchParams.get('pageSize') || '6'

  const params = new URLSearchParams({
    apiKey: API_KEY,
    pageSize,
    sortBy: 'publishedAt',
  })

  if (query) {
    params.append('q', query)
  } else {
    params.append('category', category)
    params.append('country', country.toLowerCase())
  }

  try {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?${params.toString()}`, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    })
    const data = await res.json()

    if (data.status !== 'ok') {
      return NextResponse.json(
        { error: data.message || 'News API error' },
        { status: 502 },
      )
    }

    return NextResponse.json({ articles: data.articles || [] })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch news' },
      { status: 500 },
    )
  }
}
