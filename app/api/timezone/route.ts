import { NextRequest, NextResponse } from 'next/server'

type TimeZoneDbResponse = {
  status?: string
  message?: string
  fromZoneName?: string
  toZoneName?: string
  fromTimestamp?: number
  toTimestamp?: number
  offset?: number
}

function formatLocalParts(timeZone: string, timestamp: number) {
  const date = new Date(timestamp * 1000)
  const formatter = new Intl.DateTimeFormat('en-ZA', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  })

  return formatter.format(date)
}

function offsetMinutes(timeZone: string, timestamp: number) {
  const date = new Date(timestamp * 1000)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const zonedUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  )

  return Math.round((zonedUtc - date.getTime()) / 60000)
}

function timestampFromLocalWallTime(timeZone: string, localTime: string) {
  const match = localTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/)
  if (!match) return null

  const [, year, month, day, hour, minute] = match
  const wallUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    0,
  )
  let offset = offsetMinutes(timeZone, Math.floor(wallUtc / 1000))
  let utcMillis = wallUtc - offset * 60000
  offset = offsetMinutes(timeZone, Math.floor(utcMillis / 1000))
  utcMillis = wallUtc - offset * 60000

  return Math.floor(utcMillis / 1000)
}

function fallbackConversion(from: string, to: string, timestamp: number) {
  const fromOffset = offsetMinutes(from, timestamp)
  const toOffset = offsetMinutes(to, timestamp)

  return {
    provider: 'intl',
    from,
    to,
    timestamp,
    fromTime: formatLocalParts(from, timestamp),
    toTime: formatLocalParts(to, timestamp),
    offsetMinutes: toOffset - fromOffset,
    updatedAt: new Date().toISOString(),
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from') || 'Africa/Johannesburg'
  const to = searchParams.get('to') || 'America/New_York'
  const localTime = searchParams.get('localTime')
  const timestamp = localTime
    ? timestampFromLocalWallTime(from, localTime)
    : Number(searchParams.get('timestamp') || Math.floor(Date.now() / 1000))

  if (timestamp === null || !Number.isFinite(timestamp)) {
    return NextResponse.json({ error: 'Time must be a valid date/time value.' }, { status: 400 })
  }

  const apiKey = process.env.TIMEZONEDB_API_KEY || process.env.NEXT_PUBLIC_TIMEZONEDB_API_KEY

  if (apiKey) {
    try {
      const params = new URLSearchParams({
        key: apiKey,
        format: 'json',
        from,
        to,
        time: String(Math.floor(timestamp)),
      })

      const response = await fetch(`https://api.timezonedb.com/v2.1/convert-time-zone?${params}`, {
        next: { revalidate: 60 },
      })
      const data = (await response.json()) as TimeZoneDbResponse

      if (response.ok && data.status === 'OK' && data.toTimestamp) {
        return NextResponse.json({
          provider: 'timezonedb',
          from: data.fromZoneName || from,
          to: data.toZoneName || to,
          timestamp: data.fromTimestamp || timestamp,
          convertedTimestamp: data.toTimestamp,
          fromTime: formatLocalParts(from, data.fromTimestamp || timestamp),
          toTime: formatLocalParts(to, data.toTimestamp),
          offsetMinutes: typeof data.offset === 'number' ? Math.round(data.offset / 60) : offsetMinutes(to, timestamp) - offsetMinutes(from, timestamp),
          updatedAt: new Date().toISOString(),
        })
      }
    } catch {
      return NextResponse.json(fallbackConversion(from, to, timestamp))
    }
  }

  return NextResponse.json(fallbackConversion(from, to, timestamp))
}
