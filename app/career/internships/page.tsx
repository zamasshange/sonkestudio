import type { Metadata } from 'next'
import { CareerHub } from '@/components/career/career-hub'
import { JsonLd } from '@/components/json-ld'
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Internship Finder for South African Students | SONKE Studio',
  description: 'Find internships, learnerships, bursaries, student jobs, and graduate programmes across Johannesburg, Cape Town, Durban, Pretoria, and remote South Africa.',
  path: '/career/internships',
  keywords: ['internships South Africa', 'learnerships South Africa', 'student jobs', 'graduate programmes', 'bursaries South Africa'],
})

export default function InternshipFinderPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'SONKE Studio', url: absoluteUrl('/') }, { name: 'Career Hub', url: absoluteUrl('/career') }, { name: 'Internships', url: absoluteUrl('/career/internships') }])} />
      <CareerHub initialMode="internships" initialQuery="internship learnership graduate programme bursary South Africa" />
    </>
  )
}
