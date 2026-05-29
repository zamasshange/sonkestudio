import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { blogPosts } from '@/lib/blog-data'
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'SONKE Learn | Guides for AI Tools, Careers, Students & Developers',
  description: 'Learn how to use SONKE Studio for AI productivity, student study tools, internships, resume feedback, developer tools, document tools, and business workflows.',
  path: '/learn',
  keywords: ['SONKE Learn', 'AI writing tools', 'student productivity tools', 'developer tools online', 'AI resume feedback'],
})

export default function LearnPage() {
  const learningPaths = [
    { title: 'Career Hub', text: 'Internships South Africa, graduate opportunities, AI resume feedback, CV tools, and cover letters.', href: '/career' },
    { title: 'Developer Tools', text: 'JSON formatter, API tester, Base64 encoder, JWT decoder, regex tester, and coding utilities.', href: '/tools/category/developer' },
    { title: 'Student Tools', text: 'Study planners, flashcards, homework explainers, AI tutor tools, notes summaries, and quiz generation.', href: '/tools/category/student' },
    { title: 'Document Tools', text: 'PDF to Word, Word to PDF, OCR extraction, PDF summaries, invoices, contracts, and document workflows.', href: '/tools/category/document' },
  ]

  return (
    <main className="bg-background px-5 pb-20 pt-32 sm:px-8">
      <JsonLd data={breadcrumbJsonLd([{ name: 'SONKE Studio', url: absoluteUrl('/') }, { name: 'Learn', url: absoluteUrl('/learn') }])} />
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">SONKE Learn</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight text-foreground sm:text-7xl">
          Search-focused learning paths for the SONKE ecosystem.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
          Learn what SONKE Studio is, what each tool specializes in, and how the South African-built AI productivity ecosystem connects students, creators, developers, businesses, career workflows, and documents.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {learningPaths.map((path) => (
            <Link key={path.href} href={path.href} className="group rounded-2xl border border-border bg-white p-6 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
              <h2 className="text-3xl font-semibold text-foreground">{path.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{path.text}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase text-foreground">
                Open path <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-white p-6 sm:p-8">
          <h2 className="text-3xl font-semibold text-foreground">Latest guides</h2>
          <div className="mt-5 grid gap-3">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4 transition hover:border-primary/50 hover:bg-white">
                <span>
                  <span className="block text-sm font-semibold text-foreground">{post.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{post.category}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
