import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CareerHub } from '@/components/career/career-hub'
import { JsonLd } from '@/components/json-ld'
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, careerJobLandingPages } from '@/lib/seo'

type CareerJobLandingProps = {
  params: Promise<{ slug: string }>
}

function findLanding(slug: string) {
  return careerJobLandingPages.find((page) => page.slug === slug)
}

export function generateStaticParams() {
  return careerJobLandingPages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: CareerJobLandingProps): Promise<Metadata> {
  const { slug } = await params
  const page = findLanding(slug)
  if (!page) return { title: 'Career Jobs | SONKE Studio', robots: { index: false, follow: true } }
  return buildMetadata({
    title: `${page.title} | SONKE Studio`,
    description: page.description,
    path: `/career/jobs/${page.slug}`,
    keywords: [page.title, 'jobs near me', 'South Africa jobs', 'internships South Africa', 'graduate jobs', 'learnerships'],
  })
}

export default async function CareerJobLandingPage({ params }: CareerJobLandingProps) {
  const { slug } = await params
  const page = findLanding(slug)
  if (!page) notFound()

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'SONKE Studio', url: absoluteUrl('/') }, { name: 'Career Hub', url: absoluteUrl('/career') }, { name: page.title, url: absoluteUrl(`/career/jobs/${page.slug}`) }])} />
      <CareerHub initialMode="discover" initialQuery={page.query} initialLocation={page.location} />
    </>
  )
}
