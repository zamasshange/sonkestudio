import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SmartRecommendations } from '@/components/smart-recommendations'
import {
  HeroSection,
  BrandStorySection,
  LogoMarquee,
  ServicesSection,
  FeaturedWorkSection,
  StatsSection,
  CTASection
} from '@/components/home-sections'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      
      {/* Avoora-inspired Hero */}
      <HeroSection />
      
      {/* Logo Marquee */}
      <LogoMarquee />

      {/* Brand Story + Positioning */}
      <BrandStorySection />

      {/* Smart Personalized Recommendations */}
      <SmartRecommendations />

      {/* Services/Categories */}
      <ServicesSection />
      
      {/* Featured Work/Tools */}
      <FeaturedWorkSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* CTA */}
      <CTASection />
      
      <Footer />
    </main>
  )
}
