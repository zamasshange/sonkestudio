"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, RefreshCw, Save, ShieldCheck, Trash2 } from 'lucide-react'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'

type SavedPassword = {
  id: string
  label: string
  value: string
  score: number
}

const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
  readable: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789',
}

function scorePassword(password: string) {
  let score = 0
  if (password.length >= 12) score += 25
  if (password.length >= 18) score += 20
  if (/[a-z]/.test(password)) score += 15
  if (/[A-Z]/.test(password)) score += 15
  if (/\d/.test(password)) score += 15
  if (/[^A-Za-z0-9]/.test(password)) score += 20
  if (/(.)\1{2,}/.test(password)) score -= 20
  return Math.max(0, Math.min(100, score))
}

export function PasswordWorkspaceLayout({ tool }: { tool: Tool }) {
  const isChecker = tool.id === 'password-checker'
  const [length, setLength] = useState(18)
  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)
  const [readable, setReadable] = useState(false)
  const [label, setLabel] = useState('New login')
  const [password, setPassword] = useState('')
  const [saved, setSaved] = useState<SavedPassword[]>([])
  const [copied, setCopied] = useState(false)

  const pool = useMemo(() => {
    if (readable) return charSets.readable
    return [
      uppercase ? charSets.uppercase : '',
      lowercase ? charSets.lowercase : '',
      numbers ? charSets.numbers : '',
      symbols ? charSets.symbols : '',
    ].join('') || charSets.lowercase
  }, [lowercase, numbers, readable, symbols, uppercase])

  const score = scorePassword(password)
  const strengthLabel = score >= 85 ? 'Excellent' : score >= 65 ? 'Strong' : score >= 40 ? 'Fair' : 'Weak'

  const generate = () => {
    const bytes = new Uint32Array(length)
    crypto.getRandomValues(bytes)
    let next = ''
    for (let i = 0; i < length; i++) {
      next += pool[bytes[i] % pool.length]
    }
    setPassword(next)
  }

  const copy = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  const save = () => {
    if (!password) return
    setSaved((current) => [{ id: Date.now().toString(), label, value: password, score }, ...current])
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Utility bench"
        eyebrow="UT"
        statusTitle={isChecker ? 'Strength check' : 'Password recipe'}
        statusText="Tune password rules, check strength, copy results, and keep saved candidates in one focused utility."
      />

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)_340px]">
          <aside className="rounded-none border border-border bg-white p-6 h-fit xl:sticky xl:top-44">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Password recipe</p>
            <div className="mt-6 grid gap-5">
              <label className="grid gap-2 text-sm font-medium">
                Length: {length}
                <input type="range" min="6" max="64" value={length} onChange={(event) => setLength(Number(event.target.value))} />
              </label>
              {[
                ['Uppercase', uppercase, setUppercase],
                ['Lowercase', lowercase, setLowercase],
                ['Numbers', numbers, setNumbers],
                ['Symbols', symbols, setSymbols],
                ['Readable mode', readable, setReadable],
              ].map(([name, value, setter]) => (
                <label key={name as string} className="flex items-center justify-between rounded-none border border-border bg-muted px-3 py-2 text-sm">
                  {name as string}
                  <input type="checkbox" checked={value as boolean} onChange={(event) => (setter as (next: boolean) => void)(event.target.checked)} />
                </label>
              ))}
              <label className="grid gap-2 text-sm font-medium">
                Save label
                <input value={label} onChange={(event) => setLabel(event.target.value)} className="rounded-none border border-border bg-white px-3 py-2 text-sm" />
              </label>
            </div>
          </aside>

          <main className="space-y-6">
            <section className="rounded-none border border-border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">{isChecker ? 'Check password' : 'Generated password'}</p>
                  <h2 className="mt-2 text-xl font-semibold">Security workspace</h2>
                </div>
                <ShieldCheck className="h-6 w-6 text-muted-foreground" />
              </div>

              <textarea
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={isChecker ? 'Paste a password to check its strength...' : 'Generate a password or type one to inspect it...'}
                className="mt-6 min-h-[140px] w-full resize-none rounded-none border border-border bg-muted p-5 font-mono text-lg"
              />

              <div className="mt-5 h-3 w-full overflow-hidden bg-muted">
                <div className="h-full bg-primary transition-all" style={{ width: `${score}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold">{strengthLabel}</span>
                <span className="text-muted-foreground">{score}/100</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={generate} className="rounded-none bg-primary text-primary-foreground gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Generate
                </Button>
                <Button onClick={copy} disabled={!password} variant="outline" className="rounded-none bg-white gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button onClick={save} disabled={!password} variant="outline" className="rounded-none bg-white gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </section>

            <section className="rounded-none border border-border bg-white p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Security notes</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  password.length >= 12 ? 'Length is solid' : 'Use at least 12 characters',
                  /[A-Z]/.test(password) && /[a-z]/.test(password) ? 'Mixed case included' : 'Add mixed case',
                  /\d/.test(password) ? 'Numbers included' : 'Add numbers',
                  /[^A-Za-z0-9]/.test(password) ? 'Symbols included' : 'Add symbols',
                ].map((note) => (
                  <div key={note} className="rounded-none border border-border bg-muted p-3 text-sm">{note}</div>
                ))}
              </div>
            </section>
          </main>

          <aside className="rounded-none border border-border bg-white p-6 h-fit">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Saved passwords</p>
            <div className="mt-5 grid gap-3">
              {saved.length === 0 && <p className="text-sm text-muted-foreground">Saved passwords stay in this page session only.</p>}
              {saved.map((item) => (
                <div key={item.id} className="rounded-none border border-border bg-muted p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{item.label}</p>
                      <p className="font-mono text-xs text-muted-foreground">{item.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Score {item.score}/100</p>
                    </div>
                    <button onClick={() => setSaved((current) => current.filter((savedItem) => savedItem.id !== item.id))}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
