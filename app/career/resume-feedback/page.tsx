import type { Metadata } from 'next'
import { CareerHub } from '@/components/career/career-hub'
import { JsonLd } from '@/components/json-ld'
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'AI Resume Feedback Tool | CV & ATS Checker South Africa | SONKE Studio',
  description: 'Upload your CV for AI resume feedback, ATS analysis, keyword optimization, formatting checks, and job-readiness guidance for South African opportunities.',
  path: '/career/resume-feedback',
  keywords: ['AI resume feedback', 'CV checker South Africa', 'ATS resume checker', 'resume optimizer', 'CV feedback'],
})

export default function ResumeFeedbackCareerPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'SONKE Studio', url: absoluteUrl('/') }, { name: 'Career Hub', url: absoluteUrl('/career') }, { name: 'Resume Feedback', url: absoluteUrl('/career/resume-feedback') }])} />
      <CareerHub initialMode="resume" />
    </>
  )
}
