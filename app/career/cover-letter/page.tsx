import type { Metadata } from 'next'
import { CareerHub } from '@/components/career/career-hub'
import { JsonLd } from '@/components/json-ld'
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Free AI Cover Letter Generator | SONKE Studio',
  description: 'Generate tailored cover letters from live job listings with conversational AI editing, tone switching, ATS-friendly rewrites, and export-ready text.',
  path: '/career/cover-letter',
  keywords: ['AI cover letter generator', 'cover letter South Africa', 'job application letter', 'ATS cover letter'],
})

export default function CoverLetterCareerPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'SONKE Studio', url: absoluteUrl('/') }, { name: 'Career Hub', url: absoluteUrl('/career') }, { name: 'Cover Letter Generator', url: absoluteUrl('/career/cover-letter') }])} />
      <CareerHub initialMode="cover" initialQuery="graduate internship entry level South Africa" />
    </>
  )
}
