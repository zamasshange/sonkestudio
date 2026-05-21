import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-none animate-spin" />
          </div>
        }>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
