import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { blogPosts } from '@/lib/blog-data'
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'SONKE Blog | AI Productivity, Career, Student & Developer Tools',
  description: 'Read SONKE Studio guides about AI productivity tools, internships in South Africa, resume feedback, developer tools, document workflows, and student productivity.',
  path: '/blog',
  keywords: ['SONKE blog', 'AI productivity tools', 'internship finder South Africa', 'developer tools online', 'student productivity tools'],
})

export default function BlogPage() {
  return (
    <main className="bg-background px-5 pb-20 pt-32 sm:px-8">
      <JsonLd data={breadcrumbJsonLd([{ name: 'SONKE Studio', url: absoluteUrl('/') }, { name: 'Blog', url: absoluteUrl('/blog') }])} />
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">SONKE Blog</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight text-foreground sm:text-7xl">
          Learn how SONKE Studio tools solve real searches.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
          Guides for AI productivity, South African career discovery, student tools, developer utilities, business workflows, creator tools, and document automation.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex min-h-[300px] flex-col justify-between rounded-2xl border border-border bg-white p-6 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
              <span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{post.category}</span>
                <h2 className="mt-4 text-2xl font-semibold leading-tight text-foreground">{post.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.description}</p>
              </span>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase text-foreground">
                Read guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
