import type { Metadata } from 'next'
import Link from 'next/link'
import { SitePageShell } from '@/components/site-layout'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'AI Tools for Creators | SONKE Studio',
  description: 'Explore AI tools for creators including caption generators, hooks, hashtags, content calendars, LinkedIn posts, TikTok ideas, and YouTube title tools.',
  path: '/ai-tools-for-creators',
  keywords: ['AI tools for creators', 'creator AI tools', 'SONKE creator tools', 'caption generator AI'],
})

export default function Page() {
  return (
    <SitePageShell eyebrow="Creator system" title="AI Tools for Creators" maxWidth="max-w-5xl">
        <p className="text-base leading-7 text-muted-foreground">SONKE Studio helps creators produce better content faster with category-focused tools for captions, hooks, planning, and ideation.</p>
        <p className="mt-3 text-base leading-7 text-muted-foreground">Designed for practical creator workflows that feel modern, human, and ready for real publishing needs.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/tools?category=creator" className="rounded-sm bg-foreground px-5 py-3 text-sm font-semibold text-background">Open Creator Tools</Link>
          <Link href="/tools/creator/caption" className="rounded-sm border border-border px-5 py-3 text-sm font-semibold text-foreground">Try Caption Tool</Link>
        </div>
    </SitePageShell>
  )
}
