import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Tools for Students | SONKE Studio',
  description: 'Discover AI tools for students in SONKE Studio, including tutoring, flashcards, homework help, and exam prep workflows.',
  keywords: ['AI tools for students', 'student AI tools South Africa', 'SONKE student tools', 'flashcard generator'],
}

export default function Page() {
  return (
    <main className="bg-background px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-white p-8 sm:p-10">
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">AI Tools for Students</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">SONKE Studio includes student-first AI workflows for tutoring, concept explaining, flashcards, assignments, and exam prep.</p>
        <p className="mt-3 text-base leading-7 text-muted-foreground">Built for practical learning outcomes, not generic prompts, so learners can study with structure and confidence.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/tools?category=student" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">Open Student Tools</Link>
          <Link href="/tools/student/tutor" className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground">Try AI Tutor</Link>
        </div>
      </div>
    </main>
  )
}
