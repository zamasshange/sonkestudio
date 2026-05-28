"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Copy,
  Fingerprint,
  IdCard,
  Info,
  LockKeyhole,
  ScanLine,
  ShieldCheck,
  ShieldX,
  UserRound,
} from 'lucide-react'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'

type ValidationStep = {
  label: string
  detail: string
  valid: boolean
  pending: boolean
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '').slice(0, 13)
}

function formatId(value: string) {
  const digits = digitsOnly(value)
  return [
    digits.slice(0, 6),
    digits.slice(6, 10),
    digits.slice(10, 11),
    digits.slice(11, 12),
    digits.slice(12, 13),
  ].filter(Boolean).join(' ')
}

function parseDatePart(digits: string) {
  if (digits.length < 6) return null
  const yy = Number(digits.slice(0, 2))
  const mm = Number(digits.slice(2, 4))
  const dd = Number(digits.slice(4, 6))
  const currentYear = new Date().getFullYear()
  const currentYY = currentYear % 100
  const fullYear = yy <= currentYY ? 2000 + yy : 1900 + yy
  const date = new Date(fullYear, mm - 1, dd)
  const valid = date.getFullYear() === fullYear && date.getMonth() === mm - 1 && date.getDate() === dd
  return { valid, date: valid ? date : null, fullYear, month: mm, day: dd }
}

function calculateAge(date: Date | null) {
  if (!date) return { years: '-', exact: '-' }
  const today = new Date()
  let years = today.getFullYear() - date.getFullYear()
  let months = today.getMonth() - date.getMonth()
  let days = today.getDate() - date.getDate()

  if (days < 0) {
    months -= 1
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  return { years: String(years), exact: `${years} years, ${months} months, ${days} days` }
}

function luhnCheck(id: string) {
  if (id.length !== 13) return { valid: false, checksumDigit: '-', expectedDigit: '-', sum: 0 }
  const oddSum = id
    .slice(0, 12)
    .split('')
    .filter((_, index) => index % 2 === 0)
    .reduce((sum, digit) => sum + Number(digit), 0)
  const evenConcat = id
    .slice(0, 12)
    .split('')
    .filter((_, index) => index % 2 === 1)
    .join('')
  const evenProduct = String(Number(evenConcat) * 2)
  const evenSum = evenProduct.split('').reduce((sum, digit) => sum + Number(digit), 0)
  const total = oddSum + evenSum
  const expectedDigit = (10 - (total % 10)) % 10
  const checksumDigit = Number(id[12])
  return {
    valid: checksumDigit === expectedDigit,
    checksumDigit: String(checksumDigit),
    expectedDigit: String(expectedDigit),
    sum: total,
  }
}

function validateSouthAfricanId(raw: string) {
  const id = digitsOnly(raw)
  const lengthValid = id.length === 13
  const dateInfo = parseDatePart(id)
  const sequence = id.slice(6, 10)
  const genderNumber = sequence.length === 4 ? Number(sequence) : null
  const gender = genderNumber === null ? '-' : genderNumber < 5000 ? 'Female' : 'Male'
  const citizenshipDigit = id[10]
  const citizenship = citizenshipDigit === '0'
    ? 'South African Citizen'
    : citizenshipDigit === '1'
      ? 'Permanent Resident'
      : '-'
  const citizenshipValid = citizenshipDigit === '0' || citizenshipDigit === '1'
  const checksum = luhnCheck(id)
  const age = calculateAge(dateInfo?.date || null)
  const valid = lengthValid && Boolean(dateInfo?.valid) && citizenshipValid && checksum.valid

  return {
    id,
    display: formatId(id),
    lengthValid,
    dateInfo,
    gender,
    genderNumber,
    citizenship,
    citizenshipDigit,
    citizenshipValid,
    checksum,
    age,
    valid,
    dob: dateInfo?.date
      ? dateInfo.date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' })
      : '-',
  }
}

function StatusPill({ valid, pending }: { valid: boolean; pending: boolean }) {
  if (pending) return <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">Waiting</span>
  return valid
    ? <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Passed</span>
    : <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">Failed</span>
}

export function SouthAfricanIdValidatorLayout({ tool }: { tool: Tool }) {
  const [rawId, setRawId] = useState('')
  const [copied, setCopied] = useState(false)
  const result = useMemo(() => validateSouthAfricanId(rawId), [rawId])

  const steps: ValidationStep[] = [
    { label: 'Structure Valid', detail: '13 numeric digits', valid: result.lengthValid, pending: result.id.length < 13 },
    { label: 'Date Valid', detail: 'YYMMDD calendar check', valid: Boolean(result.dateInfo?.valid), pending: result.id.length < 6 },
    { label: 'Citizenship Valid', detail: '0 citizen, 1 permanent resident', valid: result.citizenshipValid, pending: result.id.length < 11 },
    { label: 'Checksum Passed', detail: `Expected ${result.checksum.expectedDigit}, found ${result.checksum.checksumDigit}`, valid: result.checksum.valid, pending: result.id.length < 13 },
  ]
  const progress = Math.round((steps.filter((step) => step.valid).length / steps.length) * 100)

  const useExample = () => setRawId('8001015009087')
  const copyReport = async () => {
    const report = `South African ID validation report
ID: ${result.display || '-'}
Status: ${result.valid ? 'Valid format' : 'Invalid format'}
Date of birth: ${result.dob}
Age: ${result.age.exact}
Gender: ${result.gender}
Citizenship: ${result.citizenship}
Checksum: ${result.checksum.valid ? 'Passed' : 'Failed'}

Local format validation only. Not connected to Home Affairs.`
    await navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="South African identity tool"
        eyebrow="SA ID"
        statusTitle="Local ID validation"
        statusText="Check South African ID number structure, birth date, age, gender, citizenship, and checksum locally in your browser."
      />

      <div className="mx-auto max-w-[1720px] px-5 pb-10 sm:px-8">
        <section className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <strong>Important:</strong> This tool performs local format validation only and does not connect to Home Affairs.
          It can validate the structure of a South African ID number, but it cannot confirm that a person exists on DHA records.
        </section>

        <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)_390px]">
          <aside className="space-y-4 rounded-2xl border border-border bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Secure input</p>
              <h2 className="mt-1 text-xl font-semibold">Enter a South African ID number</h2>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              ID number
              <Input
                value={formatId(rawId)}
                onChange={(event) => setRawId(digitsOnly(event.target.value))}
                onPaste={(event) => {
                  event.preventDefault()
                  setRawId(digitsOnly(event.clipboardData.getData('text')))
                }}
                inputMode="numeric"
                autoComplete="off"
                placeholder="YYMMDD SSSS C A Z"
                className="h-14 rounded-xl border-border bg-background font-mono text-lg tracking-wider"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={useExample}>Use example</Button>
              <Button variant="outline" onClick={() => setRawId('')}>Clear</Button>
            </div>
            <div className="rounded-xl border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
              Example structure: <span className="font-mono text-foreground">YYMMDD SSSS C A Z</span>.
              The first six digits are the birth date, the next four indicate gender, digit eleven indicates citizenship, and the last digit is the checksum.
            </div>
            <div className="rounded-xl border border-dashed border-border bg-background p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white">
                  <ScanLine className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Smart ID scan</p>
                  <p className="text-xs text-muted-foreground">OCR upload support is prepared for a future verification workflow.</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
              <LockKeyhole className="mb-2 h-5 w-5" />
              Your ID number is processed locally in this page. SONKE does not need an external API for this validation step.
            </div>
          </aside>

          <main className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Validation engine</p>
                  <h2 className="mt-1 text-2xl font-semibold">SA ID verification flow</h2>
                </div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${result.valid ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : result.id.length ? 'border-red-200 bg-red-50 text-red-700' : 'border-border bg-background text-muted-foreground'}`}>
                  {result.valid ? <ShieldCheck className="h-4 w-4" /> : result.id.length ? <ShieldX className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                  {result.valid ? 'Valid SA ID format' : result.id.length ? 'Needs attention' : 'Awaiting ID'}
                </div>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
                <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.35 }} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border ${step.valid ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : step.pending ? 'border-border bg-white text-muted-foreground' : 'border-red-200 bg-red-50 text-red-700'}`}>
                          {step.valid ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                        </span>
                        <div>
                          <p className="font-semibold">{step.label}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{step.detail}</p>
                        </div>
                      </div>
                      <StatusPill valid={step.valid} pending={step.pending} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-white p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Checksum walkthrough</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold">Odd-position sum</p>
                  <p className="mt-2 text-2xl font-semibold">{result.checksum.sum || '-'}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Combined Luhn calculation total.</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold">Expected digit</p>
                  <p className="mt-2 text-2xl font-semibold">{result.checksum.expectedDigit}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Calculated from the first 12 digits.</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold">Provided digit</p>
                  <p className="mt-2 text-2xl font-semibold">{result.checksum.checksumDigit}</p>
                  <p className="mt-1 text-xs text-muted-foreground">The final digit in the ID number.</p>
                </div>
              </div>
            </section>
          </main>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Extracted information</p>
                  <h2 className="mt-1 text-xl font-semibold">ID breakdown</h2>
                </div>
                <Fingerprint className="h-6 w-6 text-primary" />
              </div>
              <div className="mt-5 space-y-3">
                {[
                  { label: 'Full DOB', value: result.dob, icon: CalendarDays },
                  { label: 'Exact age', value: result.age.exact, icon: BadgeCheck },
                  { label: 'Gender', value: result.gender, icon: UserRound },
                  { label: 'Citizenship', value: result.citizenship, icon: IdCard },
                  { label: 'Validity status', value: result.valid ? 'Valid local format' : 'Not valid yet', icon: ShieldCheck },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
                      <Icon className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
                        <p className="mt-1 text-sm font-semibold">{item.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Button onClick={copyReport} disabled={!result.id} variant="outline" className="mt-4 w-full">
                <Copy className="mr-2 h-4 w-4" />
                {copied ? 'Copied report' : 'Copy report'}
              </Button>
            </section>

            <section className="rounded-2xl border border-border bg-white p-5">
              <p className="text-sm font-semibold">ID number anatomy</p>
              <div className="mt-4 grid grid-cols-[1.4fr_1fr_.45fr_.45fr_.45fr] overflow-hidden rounded-xl border border-border text-center font-mono text-xs">
                {['YYMMDD', 'SSSS', 'C', 'A', 'Z'].map((label) => <div key={label} className="border-b border-r border-border bg-background p-2 last:border-r-0">{label}</div>)}
                {[result.id.slice(0, 6) || 'birth', result.id.slice(6, 10) || 'gender', result.id[10] || 'citizen', result.id[11] || 'ctrl', result.id[12] || 'check'].map((value, index) => (
                  <div key={`${value}-${index}`} className="border-r border-border p-3 last:border-r-0">{value}</div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <SeoContent />
      </div>
    </motion.div>
  )
}

function SeoContent() {
  const faqs = [
    {
      q: 'How do South African ID numbers work?',
      a: 'A South African ID number has 13 digits. It includes the birth date, a gender sequence, citizenship status, a control digit, and a final Luhn checksum digit.',
    },
    {
      q: 'Can this tool verify age?',
      a: 'Yes. This SA ID age checker extracts the YYMMDD birth date and calculates the exact age from today.',
    },
    {
      q: 'Is this connected to Home Affairs?',
      a: 'No. This South African ID checker performs local format validation only and does not connect to Home Affairs or DHA databases.',
    },
    {
      q: 'Is my ID stored?',
      a: 'No ID number is stored by this page. The South African identity validator runs the format and checksum checks locally in your browser.',
    },
    {
      q: 'How is age calculated?',
      a: 'The tool converts the YY date prefix into a 1900s or 2000s year, validates the calendar date, then calculates years, months, and days from the current date.',
    },
  ]

  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-2xl border border-border bg-white p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">South African ID checker</p>
        <h2 className="mt-2 text-2xl font-semibold">Check ID number South Africa, locally and privately</h2>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground">
          SONKE Studio’s SA ID validator helps you verify SA ID format, check South African ID number structure,
          calculate age, identify citizenship status, and validate the Luhn checksum. It is built for everyday users,
          students, HR teams, onboarding workflows, internship age checks, and South African digital products that need
          fast local validation before any official process.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ['How it works', 'The tool reads the 13 digits, validates the birth date, interprets the gender sequence, checks citizenship, and runs the South African ID Luhn checksum.'],
          ['Privacy first', 'The validation runs locally without an external API. This makes it useful for quick checks where you do not need official DHA verification.'],
          ['Built to scale', 'The layout is ready for future OCR ID scanning, Smart ID uploads, AI fraud detection, and onboarding verification workflows.'],
        ].map(([title, text]) => (
          <section key={title} className="rounded-2xl border border-border bg-white p-5">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-white p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">FAQ</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {faqs.map((faq) => (
            <details key={faq.q} className="rounded-xl border border-border bg-background p-4" open>
              <summary className="cursor-pointer font-semibold">{faq.q}</summary>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
