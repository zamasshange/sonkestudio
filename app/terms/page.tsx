import type { Metadata } from 'next'
import { SitePageShell } from '@/components/site-layout'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Use | SONKE Studio',
  description: 'Terms of Use for SONKE Studio by BDL Corp, including responsible use of AI tools, content, outputs, and platform services.',
  path: '/terms',
  keywords: ['SONKE Studio terms', 'BDL Corp terms', 'AI tools terms of use'],
})

export default function TermsPage() {
  return (
    <SitePageShell eyebrow="SONKE policy" title="Terms of Use" maxWidth="max-w-[980px]">
        <p className="mt-4 text-sm leading-7 text-muted-foreground">Effective date: May 27, 2026</p>
        <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
          <p>By using SONKE Studio, you agree to use the platform responsibly and in compliance with applicable laws.</p>
          <p>SONKE and BDL Corp may update tools, features, and policies over time to improve quality and security.</p>
          <p>You are responsible for content you submit and for reviewing outputs before relying on them in academic, business, legal, or technical contexts.</p>
          <p>These terms may be updated periodically. Continued use of the platform indicates acceptance of revised terms.</p>
        </div>
    </SitePageShell>
  )
}
