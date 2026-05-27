import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Tools for Creators | SONKE Studio',
  description: 'SONKE Studio offers AI tools for creators including captions, hooks, content ideas, and platform-specific creative workflows.',
  keywords: ['AI tools for creators', 'creator AI tools', 'SONKE creator tools', 'caption generator AI'],
}

export default function Page() {
  return (
    <main className="bg-background px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-white p-8 sm:p-10">
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">AI Tools for Creators</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">SONKE Studio helps creators produce better content faster with category-focused tools for captions, hooks, planning, and ideation.</p>
        <p className="mt-3 text-base leading-7 text-muted-foreground">Designed for practical creator workflows that feel modern, human, and ready for real publishing needs.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/tools?category=creator" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">Open Creator Tools</Link>
          <Link href="/tools/creator/caption" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground">Try Caption Tool</Link>
        </div>
      </div>
    </main>
  )
}
