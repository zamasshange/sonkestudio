import { Metadata } from 'next'
import { CareerHub } from '@/components/career/career-hub'

export const metadata: Metadata = {
  title: 'Student Career & Opportunity Hub | SONKE Studio',
  description: 'Discover South African internships, learnerships, graduate programs, junior jobs, remote work, CV feedback, cover letters, and interview prep with SONKE Studio.',
}

export default function CareerPage() {
  return <CareerHub />
}
