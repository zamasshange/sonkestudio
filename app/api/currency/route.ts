import { NextRequest, NextResponse } from 'next/server'

type RatesResponse = {
  result?: string
  base_code?: string
  rates?: Record<string, number>
  conversion_rates?: Record<string, number>
  time_last_update_utc?: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const from = (searchParams.get('from') || 'USD').toUpperCase()
  const to = (searchParams.get('to') || 'ZAR').toUpperCase()
  const amount = Number(searchParams.get('amount') || '1')

  if (!Number.isFinite(amount)) {
    return NextResponse.json({ error: 'Amount must be a valid number.' }, { status: 400 })
  }

  const apiKey = process.env.FREECURRENCY_API_KEY
    || process.env.EXCHANGE_RATE_API_KEY
    || process.env.EXCHANGERATE_API_KEY
    || process.env.CURRENCY_API_KEY
    || process.env.NEXT_PUBLIC_CURRENCY_API_KEY

  const endpoints = apiKey
    ? [
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`,
        `https://open.er-api.com/v6/latest/${from}`,
      ]
    : [`https://open.er-api.com/v6/latest/${from}`]

  let lastError = 'Unable to load exchange rates.'

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { next: { revalidate: 1800 } })
      const data = (await response.json()) as RatesResponse

      if (!response.ok || data.result === 'error') {
        lastError = 'Currency API returned an error.'
        continue
      }

      const rates = data.conversion_rates || data.rates || {}
      const rate = rates[to]

      if (!rate) {
        lastError = `No exchange rate found for ${from} to ${to}.`
        continue
      }

      return NextResponse.json({
        amount,
        from,
        to,
        rate,
        result: amount * rate,
        updatedAt: data.time_last_update_utc || new Date().toUTCString(),
      })
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError
    }
  }

  return NextResponse.json({ error: lastError }, { status: 502 })
}
