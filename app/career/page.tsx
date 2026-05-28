import { Metadata } from 'next'
import { CareerHub } from '@/components/career/career-hub'
import { JsonLd } from '@/components/json-ld'
import { absoluteUrl, buildMetadata, breadcrumbJsonLd } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Career Opportunity Hub | Internships, Learnerships & Jobs South Africa | SONKE Studio',
  description: 'Discover live South African internships, learnerships, graduate programmes, remote jobs, student jobs, AI resume feedback, cover letters, and application tracking.',
  path: '/career',
  keywords: ['internships South Africa', 'graduate programmes', 'learnerships', 'remote jobs South Africa', 'student jobs', 'AI resume feedback', 'cover letter generator'],
})

export default function CareerPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'SONKE Studio', url: absoluteUrl('/') },
          { name: 'Career Hub', url: absoluteUrl('/career') },
        ])}
      />
      <CareerHub />
    </>
  )
}
