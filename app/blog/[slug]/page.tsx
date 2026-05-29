import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { JsonLd } from '@/components/json-ld'
import { blogPosts, findBlogPost } from '@/lib/blog-data'
import { absoluteUrl, articleJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = findBlogPost(slug)
  if (!post) return { title: 'Article Not Found | SONKE Studio', robots: { index: false, follow: true } }
  return buildMetadata({
    title: `${post.title} | SONKE Studio`,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    type: 'article',
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = findBlogPost(slug)
  if (!post) notFound()

  return (
    <main className="bg-background px-5 pb-20 pt-32 sm:px-8">
      <JsonLd data={articleJsonLd({ title: post.title, description: post.description, path: `/blog/${post.slug}`, datePublished: post.date })} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'SONKE Studio', url: absoluteUrl('/') },
          { name: 'Blog', url: absoluteUrl('/blog') },
          { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
        ])}
      />
      <article className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{post.category}</p>
        <h1 className="mt-4 text-5xl font-semibold leading-tight text-foreground sm:text-6xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.keywords.map((keyword) => (
            <span key={keyword} className="rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-muted-foreground">
              {keyword}
            </span>
          ))}
        </div>

        <div className="mt-10 space-y-8 rounded-2xl border border-border bg-white p-6 sm:p-8">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-3xl font-semibold text-foreground">{section.heading}</h2>
              <p className="mt-3 text-base leading-8 text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-foreground">Related SONKE tools</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {post.relatedTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4 transition hover:border-primary/50 hover:bg-white">
                <span className="text-sm font-semibold text-foreground">{tool.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  )
}
