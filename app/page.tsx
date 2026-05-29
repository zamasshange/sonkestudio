import type { Metadata } from 'next'
import { SmartRecommendations } from '@/components/smart-recommendations'
import {
  HeroSection,
  BrandStorySection,
  LogoMarquee,
  ServicesSection,
  FeaturedWorkSection,
  CareersSection,
  StatsSection,
  CTASection
} from '@/components/home-sections'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'SONKE Studio | AI Productivity Ecosystem Built in South Africa',
  description: 'SONKE Studio is a South African-built AI productivity ecosystem by BDL Corp and Zama Shange with AI writing tools, developer tools, student tools, career tools, business tools, document tools, creator tools, and AI workflows.',
  path: '/',
  keywords: [
    'SONKE Studio',
    'AI productivity ecosystem',
    'AI productivity tools',
    'developer tools online',
    'student productivity tools',
    'business tools online',
    'AI writing tools',
    'South African AI platform',
  ],
})

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Avoora-inspired Hero */}
      <HeroSection />
      
      {/* Logo Marquee */}
      <LogoMarquee />

      {/* Smart Personalized Recommendations */}
      <SmartRecommendations />

      {/* Services/Categories */}
      <ServicesSection />
      
      {/* Featured Work/Tools */}
      <FeaturedWorkSection />

      {/* Careers Ecosystem */}
      <CareersSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* CTA */}
      <CTASection />

      {/* About + Vision (kept lower priority) */}
      <BrandStorySection />
    </main>
  )
}
