import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { 
  HeroSection, 
  LogoMarquee, 
  ServicesSection, 
  FeaturedWorkSection,
  StatsSection,
  CTASection
} from '@/components/home-sections'

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      {/* Avoora-inspired Hero */}
      <HeroSection />
      
      {/* Logo Marquee */}
      <LogoMarquee />
      
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
