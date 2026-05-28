import type { Metadata } from 'next'
import Link from 'next/link'
import { SitePageShell } from '@/components/site-layout'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'AI Tools for Students | SONKE Studio',
  description: 'Discover AI tools for students including tutoring, flashcards, homework help, citation tools, quiz generation, exam prep, and study planning.',
  path: '/ai-tools-for-students',
  keywords: ['AI tools for students', 'student AI tools South Africa', 'SONKE student tools', 'flashcard generator'],
})

export default function Page() {
  return (
    <SitePageShell eyebrow="Student system" title="AI Tools for Students" maxWidth="max-w-5xl">
        <p className="text-base leading-7 text-muted-foreground">SONKE Studio includes student-first AI workflows for tutoring, concept explaining, flashcards, assignments, and exam prep.</p>
        <p className="mt-3 text-base leading-7 text-muted-foreground">Built for practical learning outcomes, not generic prompts, so learners can study with structure and confidence.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/tools?category=student" className="rounded-sm bg-foreground px-5 py-3 text-sm font-semibold text-background">Open Student Tools</Link>
          <Link href="/tools/student/tutor" className="rounded-sm border border-border px-5 py-3 text-sm font-semibold text-foreground">Try AI Tutor</Link>
        </div>
    </SitePageShell>
  )
}
