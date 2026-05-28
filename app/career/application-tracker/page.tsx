import type { Metadata } from 'next'
import { CareerHub } from '@/components/career/career-hub'
import { JsonLd } from '@/components/json-ld'
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Career Application Tracker | SONKE Studio',
  description: 'Track saved jobs, applications, interviews, offers, reminders, and notes with a clean career workflow board inside SONKE Studio.',
  path: '/career/application-tracker',
  keywords: ['job application tracker', 'career tracker', 'interview tracker', 'saved jobs', 'application status'],
})

export default function ApplicationTrackerCareerPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'SONKE Studio', url: absoluteUrl('/') }, { name: 'Career Hub', url: absoluteUrl('/career') }, { name: 'Application Tracker', url: absoluteUrl('/career/application-tracker') }])} />
      <CareerHub initialMode="tracker" />
    </>
  )
}
