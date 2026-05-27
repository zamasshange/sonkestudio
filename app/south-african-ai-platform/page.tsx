import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'South African AI Platform | SONKE Studio',
  description: 'SONKE Studio is a South African AI platform designed as a long-term productivity ecosystem for modern users globally.',
  keywords: ['South African AI platform', 'SONKE Studio', 'AI platform South Africa', 'BDL Corp'],
}

export default function Page() {
  return (
    <main className="bg-background px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-white p-8 sm:p-10">
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">South African AI Platform</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">SONKE Studio is built in South Africa for a global generation. The platform is designed to make AI useful, accessible, and workflow-ready.</p>
        <p className="mt-3 text-base leading-7 text-muted-foreground">Founded by Zama Shange and developed under BDL Corp, SONKE focuses on real outcomes through specialized systems, not random tool overload.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/tools" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">Open Platform</Link>
          <Link href="/about" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground">Founder + Company</Link>
        </div>
      </div>
    </main>
  )
}
