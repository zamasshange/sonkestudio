"use client"

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightLeft, Clock3, Loader2, Plane, RefreshCw } from 'lucide-react'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'

const zones = [
  { id: 'Africa/Johannesburg', city: 'Johannesburg', country: 'South Africa', code: 'za', region: 'SAST' },
  { id: 'America/New_York', city: 'New York', country: 'United States', code: 'us', region: 'ET' },
  { id: 'America/Los_Angeles', city: 'Los Angeles', country: 'United States', code: 'us', region: 'PT' },
  { id: 'Europe/London', city: 'London', country: 'United Kingdom', code: 'gb', region: 'GMT/BST' },
  { id: 'Europe/Paris', city: 'Paris', country: 'France', code: 'fr', region: 'CET/CEST' },
  { id: 'Africa/Lagos', city: 'Lagos', country: 'Nigeria', code: 'ng', region: 'WAT' },
  { id: 'Africa/Nairobi', city: 'Nairobi', country: 'Kenya', code: 'ke', region: 'EAT' },
  { id: 'Asia/Dubai', city: 'Dubai', country: 'United Arab Emirates', code: 'ae', region: 'GST' },
  { id: 'Asia/Kolkata', city: 'Mumbai', country: 'India', code: 'in', region: 'IST' },
  { id: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', code: 'jp', region: 'JST' },
  { id: 'Australia/Sydney', city: 'Sydney', country: 'Australia', code: 'au', region: 'AET' },
  { id: 'America/Sao_Paulo', city: 'Sao Paulo', country: 'Brazil', code: 'br', region: 'BRT' },
]

const meetingPresets = [
  { label: 'Morning call', hour: 9, minute: 0 },
  { label: 'Lunch check-in', hour: 12, minute: 30 },
  { label: 'Afternoon sync', hour: 15, minute: 0 },
  { label: 'Evening handoff', hour: 18, minute: 0 },
]

function Flag({ code, country, className = 'h-8 w-11' }: { code: string; country: string; className?: string }) {
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={`${country} flag`}
      className={`${className} rounded-sm border border-border object-cover`}
      loading="lazy"
    />
  )
}

function getZone(id: string) {
  return zones.find((zone) => zone.id === id) || zones[0]
}

function toLocalInputValue(date: Date) {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

function describeOffset(minutes: number | null) {
  if (minutes === null) return 'Calculating offset'
  if (minutes === 0) return 'Same local time'

  const abs = Math.abs(minutes)
  const hours = Math.floor(abs / 60)
  const remainder = abs % 60
  const label = `${hours}h${remainder ? ` ${remainder}m` : ''}`

  return minutes > 0 ? `${label} ahead` : `${label} behind`
}

export function TimezoneConverterLayout({ tool }: { tool: Tool }) {
  const [from, setFrom] = useState('Africa/Johannesburg')
  const [to, setTo] = useState('America/New_York')
  const [dateTime, setDateTime] = useState(() => toLocalInputValue(new Date()))
  const [converted, setConverted] = useState<{ fromTime: string; toTime: string; offsetMinutes: number | null; provider: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fromZone = useMemo(() => getZone(from), [from])
  const toZone = useMemo(() => getZone(to), [to])

  useEffect(() => {
    const controller = new AbortController()
    async function convertTime() {
      if (!dateTime) return

      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams({
          from,
          to,
          localTime: dateTime,
        })
        const response = await fetch(`/api/timezone?${params}`, { signal: controller.signal })
        const data = await response.json()

        if (!response.ok) throw new Error(data.error || 'Time conversion failed.')

        setConverted({
          fromTime: data.fromTime,
          toTime: data.toTime,
          offsetMinutes: typeof data.offsetMinutes === 'number' ? data.offsetMinutes : null,
          provider: data.provider || 'intl',
        })
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Time conversion failed.')
      } finally {
        setLoading(false)
      }
    }

    convertTime()
    return () => controller.abort()
  }, [dateTime, from, to])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Utility bench"
        eyebrow="UT"
        statusTitle={`${fromZone.city} to ${toZone.city}`}
        statusText="Plan calls, travel handoffs, and deadlines across countries with live offsets and visible flags."
      />

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-none border border-border bg-white p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
              <div>
                <label className="text-sm font-semibold text-foreground">From city</label>
                <div className="mt-3 rounded-none border border-border bg-background p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <Flag code={fromZone.code} country={fromZone.country} />
                    <div>
                      <p className="font-semibold">{fromZone.city}</p>
                      <p className="text-sm text-muted-foreground">{fromZone.country} / {fromZone.region}</p>
                    </div>
                  </div>
                  <select value={from} onChange={(event) => setFrom(event.target.value)} className="w-full rounded-none border border-border bg-white px-3 py-2 text-sm">
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>{zone.city}, {zone.country} - {zone.id}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                variant="outline"
                className="rounded-none border-border"
                onClick={() => {
                  setFrom(to)
                  setTo(from)
                }}
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>

              <div>
                <label className="text-sm font-semibold text-foreground">To city</label>
                <div className="mt-3 rounded-none border border-border bg-background p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <Flag code={toZone.code} country={toZone.country} />
                    <div>
                      <p className="font-semibold">{toZone.city}</p>
                      <p className="text-sm text-muted-foreground">{toZone.country} / {toZone.region}</p>
                    </div>
                  </div>
                  <select value={to} onChange={(event) => setTo(event.target.value)} className="w-full rounded-none border border-border bg-white px-3 py-2 text-sm">
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>{zone.city}, {zone.country} - {zone.id}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <label className="text-sm font-semibold text-foreground">Date and time</label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(event) => setDateTime(event.target.value)}
                  className="mt-3 w-full rounded-none border border-border bg-background px-4 py-4 text-2xl font-semibold outline-none focus:border-primary"
                />
              </div>
              <Button variant="outline" className="rounded-none gap-2" onClick={() => setDateTime(toLocalInputValue(new Date()))}>
                <RefreshCw className="h-4 w-4" />
                Now
              </Button>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-4">
              {meetingPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    const next = new Date(dateTime)
                    next.setHours(preset.hour, preset.minute, 0, 0)
                    setDateTime(toLocalInputValue(next))
                  }}
                  className="rounded-none border border-border px-3 py-2 text-left text-sm hover:border-primary"
                >
                  <Clock3 className="mb-2 h-4 w-4 text-muted-foreground" />
                  {preset.label}
                </button>
              ))}
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </section>

          <aside className="rounded-none border border-border bg-white p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Converted time</p>
            <div className="mt-6 rounded-none border border-border bg-background p-5">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Flag code={fromZone.code} country={fromZone.country} className="h-5 w-8" />
                {fromZone.city}
              </div>
              <p className="mt-3 text-lg font-semibold">{converted?.fromTime || 'Loading...'}</p>
            </div>

            <div className="my-5 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <Plane className="h-4 w-4" />
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="rounded-none border border-border bg-foreground p-5 text-background">
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Flag code={toZone.code} country={toZone.country} className="h-5 w-8 border-background/20" />
                {toZone.city}
              </div>
              <div className="mt-3 text-3xl font-semibold leading-tight">
                {loading ? <Loader2 className="h-7 w-7 animate-spin" /> : converted?.toTime || 'Loading...'}
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
              <div className="rounded-none border border-border bg-background p-4">
                <p className="font-semibold text-foreground">Time difference</p>
                <p className="mt-1">{describeOffset(converted?.offsetMinutes ?? null)}</p>
              </div>
              <div className="rounded-none border border-border bg-background p-4">
                <p className="font-semibold text-foreground">Data source</p>
                <p className="mt-1">{converted?.provider === 'timezonedb' ? 'TimeZoneDB API with local Intl formatting' : 'Local Intl timezone engine'}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
