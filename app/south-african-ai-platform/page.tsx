import type { Metadata } from 'next'
import Link from 'next/link'
import { SitePageShell } from '@/components/site-layout'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'South African AI Platform | SONKE Studio',
  description: 'SONKE Studio is a South African AI platform built for a global generation with practical tools for productivity, education, creativity, business, and development.',
  path: '/south-african-ai-platform',
  keywords: ['South African AI platform', 'SONKE Studio', 'AI platform South Africa', 'BDL Corp'],
})

export default function Page() {
  return (
    <SitePageShell eyebrow="SONKE Studio" title="South African AI Platform" maxWidth="max-w-5xl">
        <p className="text-base leading-7 text-muted-foreground">SONKE Studio is built in South Africa for a global generation. The platform is designed to make AI useful, accessible, and workflow-ready.</p>
        <p className="mt-3 text-base leading-7 text-muted-foreground">Founded by Zama Shange and developed under BDL Corp, SONKE focuses on real outcomes through specialized systems, not random tool overload.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/tools" className="rounded-sm bg-foreground px-5 py-3 text-sm font-semibold text-background">Open Platform</Link>
          <Link href="/about" className="rounded-sm border border-border px-5 py-3 text-sm font-semibold text-foreground">Founder + Company</Link>
        </div>
    </SitePageShell>
  )
}
