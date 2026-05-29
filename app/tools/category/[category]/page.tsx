import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { categories, getToolsByCategory } from '@/lib/tools-data'
import { absoluteUrl, breadcrumbJsonLd, categoryMetadata, toolCanonicalPath } from '@/lib/seo'

type CategoryPageProps = {
  params: Promise<{ category: string }>
}

function findCategory(categoryId: string) {
  return categories.find((category) => category.id === categoryId)
}

const categoryTargets: Record<string, { heading: string; copy: string; keywords: string[] }> = {
  developer: {
    heading: 'Online developer tools, coding utilities, JSON tools, and API testing tools',
    copy: 'Use SONKE Studio developer tools to format JSON, test APIs, decode JWTs, convert Base64, beautify code, preview Markdown, and debug everyday developer workflows from one crawlable category page.',
    keywords: ['online developer tools', 'coding utilities', 'JSON tools', 'API testing tools'],
  },
  student: {
    heading: 'Productivity tools for students, study tools, and student AI tools',
    copy: 'SONKE student tools help learners plan assignments, summarize notes, create flashcards, generate quizzes, explain homework, and prepare for exams with focused AI workflows.',
    keywords: ['productivity tools for students', 'study tools', 'student AI tools'],
  },
  career: {
    heading: 'Internships South Africa, graduate opportunities, AI resume tools, and CV tools',
    copy: 'The SONKE Career Hub connects internship discovery, live South African opportunities, AI resume feedback, cover letter generation, and application tracking.',
    keywords: ['internships South Africa', 'graduate opportunities', 'AI resume tools', 'CV tools'],
  },
  document: {
    heading: 'Document tools, PDF converters, OCR tools, and online file workflows',
    copy: 'Use SONKE document tools to convert PDFs, summarize documents, extract OCR text, generate invoices, simplify contracts, and prepare business-ready files.',
    keywords: ['PDF to Word converter', 'document tools online', 'PDF tools'],
  },
  business: {
    heading: 'Business tools online for names, plans, pitches, and job applications',
    copy: 'SONKE business tools help founders, freelancers, job seekers, and teams create business names, SWOT analyses, marketing plans, cover letters, formulas, and pitch content.',
    keywords: ['business tools online', 'startup tools', 'AI business tools'],
  },
}

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categoryId } = await params
  const category = findCategory(categoryId)
  if (!category) return { title: 'Tools Category | SONKE Studio', robots: { index: false, follow: true } }
  return categoryMetadata(category)
}

export default async function ToolCategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId } = await params
  const category = findCategory(categoryId) || categories[0]
  const categoryTools = getToolsByCategory(category.id)
  const Icon = category.icon
  const targets = categoryTargets[category.id] || {
    heading: `${category.name} for AI productivity, search discovery, and everyday workflows`,
    copy: `${category.description}. SONKE Studio groups related tools into category pages so search engines and users can understand what each workspace specializes in.`,
    keywords: [category.name, 'AI productivity tools', 'SONKE Studio'],
  }

  return (
    <main className="bg-background px-5 pb-20 pt-32 sm:px-8 lg:pt-36">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'SONKE Studio', url: absoluteUrl('/') },
          { name: 'Tools', url: absoluteUrl('/tools') },
          { name: category.name, url: absoluteUrl(`/tools/category/${category.id}`) },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${category.name} | SONKE Studio`,
          description: category.description,
          url: absoluteUrl(`/tools/category/${category.id}`),
          hasPart: categoryTools.map((tool) => ({
            '@type': 'WebApplication',
            name: tool.name,
            url: absoluteUrl(tool.href),
            description: tool.description,
          })),
        }}
      />
      <section className="mx-auto max-w-[1720px]">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-border bg-foreground p-7 text-background sm:p-10">
            <p className="flex items-center gap-3 text-sm font-semibold uppercase text-background/60">
              <span className="h-2.5 w-2.5 bg-primary" />
              SONKE category
            </p>
            <Icon className="mt-10 h-12 w-12 text-primary" />
            <h1 className="mt-6 text-5xl font-semibold leading-none sm:text-7xl">{category.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-background/70">{category.description}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-background/65">{targets.heading}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="border border-background/15 bg-background/5 p-4">
                <p className="text-2xl font-semibold">{categoryTools.length}</p>
                <p className="mt-1 text-xs font-semibold uppercase text-background/50">tools</p>
              </div>
              <div className="border border-background/15 bg-background/5 p-4">
                <p className="text-2xl font-semibold">SEO</p>
                <p className="mt-1 text-xs font-semibold uppercase text-background/50">indexable</p>
              </div>
              <div className="border border-background/15 bg-background/5 p-4">
                <p className="text-2xl font-semibold">Mobile</p>
                <p className="mt-1 text-xs font-semibold uppercase text-background/50">ready</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {categoryTools.slice(0, 8).map((tool, index) => {
              const ToolIcon = tool.icon
              return (
                <Link key={tool.id} href={toolCanonicalPath(tool)} className="group flex min-h-[180px] flex-col justify-between rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-background" style={{ color: tool.iconColor }}>
                      <ToolIcon className="h-6 w-6" />
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="mt-8">
                    <h2 className="text-2xl font-semibold leading-tight text-foreground">{tool.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase text-foreground">
                    Open tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-white p-6 sm:p-8">
          <h2 className="text-3xl font-semibold">All {category.name}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => (
              <Link key={tool.id} href={toolCanonicalPath(tool)} className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4 transition hover:border-primary/50 hover:bg-white">
                <span>
                  <span className="block text-sm font-semibold text-foreground">{tool.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{tool.tags.slice(0, 3).join(' / ')}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>

        <section className="mt-8 grid gap-6 rounded-3xl border border-border bg-white p-6 sm:p-8 lg:grid-cols-[1fr_0.85fr]">
          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Category SEO guide</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">{targets.heading}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{targets.copy}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {targets.keywords.map((keyword) => (
                <span key={keyword} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {keyword}
                </span>
              ))}
            </div>
          </article>
          <article>
            <h2 className="text-2xl font-semibold text-foreground">Popular {category.name} searches</h2>
            <div className="mt-5 grid gap-3">
              {categoryTools.slice(0, 5).map((tool) => (
                <Link key={tool.id} href={toolCanonicalPath(tool)} className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4 transition hover:border-primary/50 hover:bg-white">
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{tool.name}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{tool.description}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}
