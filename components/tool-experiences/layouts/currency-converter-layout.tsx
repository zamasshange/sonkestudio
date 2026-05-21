"use client"

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightLeft, Loader2 } from 'lucide-react'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'

const currencies = [
  { code: 'ZAR', name: 'South African Rand', country: 'South Africa', countryCode: 'za' },
  { code: 'USD', name: 'US Dollar', country: 'United States', countryCode: 'us' },
  { code: 'EUR', name: 'Euro', country: 'European Union', countryCode: 'eu' },
  { code: 'GBP', name: 'British Pound', country: 'United Kingdom', countryCode: 'gb' },
  { code: 'NGN', name: 'Nigerian Naira', country: 'Nigeria', countryCode: 'ng' },
  { code: 'KES', name: 'Kenyan Shilling', country: 'Kenya', countryCode: 'ke' },
  { code: 'BWP', name: 'Botswana Pula', country: 'Botswana', countryCode: 'bw' },
  { code: 'NAD', name: 'Namibian Dollar', country: 'Namibia', countryCode: 'na' },
  { code: 'MZN', name: 'Mozambican Metical', country: 'Mozambique', countryCode: 'mz' },
  { code: 'CAD', name: 'Canadian Dollar', country: 'Canada', countryCode: 'ca' },
  { code: 'AUD', name: 'Australian Dollar', country: 'Australia', countryCode: 'au' },
  { code: 'JPY', name: 'Japanese Yen', country: 'Japan', countryCode: 'jp' },
  { code: 'CNY', name: 'Chinese Yuan', country: 'China', countryCode: 'cn' },
  { code: 'INR', name: 'Indian Rupee', country: 'India', countryCode: 'in' },
  { code: 'BRL', name: 'Brazilian Real', country: 'Brazil', countryCode: 'br' },
]

const presets = [
  ['USD', 'ZAR'],
  ['EUR', 'ZAR'],
  ['GBP', 'ZAR'],
  ['ZAR', 'USD'],
  ['ZAR', 'NGN'],
]

function getCurrency(code: string) {
  return currencies.find((currency) => currency.code === code) || currencies[0]
}

function Flag({ countryCode, country, className = 'h-8 w-11' }: { countryCode: string; country: string; className?: string }) {
  return (
    <img
      src={`https://flagcdn.com/${countryCode}.svg`}
      alt={`${country} flag`}
      className={`${className} rounded-sm border border-border object-cover`}
      loading="lazy"
    />
  )
}

export function CurrencyConverterLayout({ tool }: { tool: Tool }) {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('ZAR')
  const [result, setResult] = useState<number | null>(null)
  const [rate, setRate] = useState<number | null>(null)
  const [updatedAt, setUpdatedAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fromCurrency = useMemo(() => getCurrency(from), [from])
  const toCurrency = useMemo(() => getCurrency(to), [to])

  useEffect(() => {
    const controller = new AbortController()

    async function convert() {
      const numericAmount = Number(amount)
      if (!Number.isFinite(numericAmount)) return

      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams({ amount, from, to })
        const response = await fetch(`/api/currency?${params}`, { signal: controller.signal })
        const data = await response.json()

        if (!response.ok) throw new Error(data.error || 'Conversion failed.')

        setResult(data.result)
        setRate(data.rate)
        setUpdatedAt(data.updatedAt)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Conversion failed.')
      } finally {
        setLoading(false)
      }
    }

    convert()
    return () => controller.abort()
  }, [amount, from, to])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Utility bench"
        eyebrow="UT"
        statusTitle={`${from} to ${to}`}
        statusText="Convert currencies with visible countries, live rates, and quick regional presets."
      />

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-none border border-border bg-white p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
              <div>
                <label className="text-sm font-semibold text-foreground">From</label>
                <div className="mt-3 rounded-none border border-border bg-background p-4">
                  <div className="mb-3 flex items-center gap-3 text-lg font-semibold">
                    <Flag countryCode={fromCurrency.countryCode} country={fromCurrency.country} />
                    <span>{fromCurrency.code}</span>
                    <span className="text-sm font-normal text-muted-foreground">{fromCurrency.country}</span>
                  </div>
                  <select value={from} onChange={(event) => setFrom(event.target.value)} className="w-full rounded-none border border-border bg-white px-3 py-2 text-sm">
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>{currency.code} - {currency.name} ({currency.country})</option>
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
                <label className="text-sm font-semibold text-foreground">To</label>
                <div className="mt-3 rounded-none border border-border bg-background p-4">
                  <div className="mb-3 flex items-center gap-3 text-lg font-semibold">
                    <Flag countryCode={toCurrency.countryCode} country={toCurrency.country} />
                    <span>{toCurrency.code}</span>
                    <span className="text-sm font-normal text-muted-foreground">{toCurrency.country}</span>
                  </div>
                  <select value={to} onChange={(event) => setTo(event.target.value)} className="w-full rounded-none border border-border bg-white px-3 py-2 text-sm">
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>{currency.code} - {currency.name} ({currency.country})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-foreground">Amount</label>
              <input
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                inputMode="decimal"
                className="mt-3 w-full rounded-none border border-border bg-background px-4 py-4 text-3xl font-semibold outline-none focus:border-primary"
              />
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </section>

          <aside className="rounded-none border border-border bg-white p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Live conversion</p>
            <div className="mt-6 rounded-none border border-border bg-background p-5">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Flag countryCode={fromCurrency.countryCode} country={fromCurrency.country} className="h-6 w-9" />
                {Number(amount || 0).toLocaleString()} {from}
              </div>
              <div className="mt-4 text-4xl font-semibold text-foreground">
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : (
                  <span className="inline-flex items-center gap-3">
                    <Flag countryCode={toCurrency.countryCode} country={toCurrency.country} className="h-8 w-12" />
                    {(result ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              <p className="mt-2 text-muted-foreground">{to}</p>
            </div>

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p>Rate: {rate ? `1 ${from} = ${rate.toFixed(6)} ${to}` : 'Loading...'}</p>
              <p>Updated: {updatedAt || 'Loading...'}</p>
            </div>

            <div className="mt-6 grid gap-2">
              {presets.map(([presetFrom, presetTo]) => {
                const presetFromCurrency = getCurrency(presetFrom)
                const presetToCurrency = getCurrency(presetTo)

                return (
                  <button
                    key={`${presetFrom}-${presetTo}`}
                    onClick={() => {
                      setFrom(presetFrom)
                      setTo(presetTo)
                    }}
                    className="rounded-none border border-border px-3 py-2 text-left text-sm hover:border-primary"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Flag countryCode={presetFromCurrency.countryCode} country={presetFromCurrency.country} className="h-4 w-6" />
                      {presetFrom} to
                      <Flag countryCode={presetToCurrency.countryCode} country={presetToCurrency.country} className="h-4 w-6" />
                      {presetTo}
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
