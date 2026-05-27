import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Productivity Platform | SONKE Studio',
  description: 'SONKE Studio is an AI productivity platform for students, creators, teams, and professionals who need practical outputs fast.',
  keywords: ['AI productivity platform', 'SONKE Studio', 'AI workflow tools', 'productivity AI South Africa'],
}

export default function Page() {
  return (
    <main className="bg-background px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-white p-8 sm:p-10">
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">AI Productivity Platform</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">SONKE Studio combines AI writing, document tools, student systems, developer utilities, and creator workflows in one intelligent platform.</p>
        <p className="mt-3 text-base leading-7 text-muted-foreground">The goal is simple: help people move from task to finished output with less friction and better usability.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/tools" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">Launch Tools</Link>
          <Link href="/" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground">Back Home</Link>
        </div>
      </div>
    </main>
  )
}
