import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Tools South Africa | SONKE Studio',
  description: 'Discover SONKE Studio, a South African AI tools ecosystem by BDL Corp and Zama Shange for students, creators, developers, and businesses.',
  keywords: ['AI tools South Africa', 'South African AI tools', 'SONKE Studio', 'BDL Corp', 'Zama Shange'],
}

export default function Page() {
  return (
    <main className="bg-background px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-white p-8 sm:p-10">
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">AI Tools South Africa</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">SONKE Studio is a South African AI tools platform built by Zama Shange under BDL Corp. It brings productivity, education, and creativity into one practical ecosystem.</p>
        <p className="mt-3 text-base leading-7 text-muted-foreground">Instead of generic AI wrappers, SONKE offers category-focused systems for students, creators, developers, businesses, and everyday users.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/tools" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">Explore SONKE Tools</Link>
          <Link href="/about" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground">About SONKE</Link>
        </div>
      </div>
    </main>
  )
}
