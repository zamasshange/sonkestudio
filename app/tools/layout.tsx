import { Suspense } from 'react'
import { Metadata } from 'next'

const siteUrl = 'https://sonkestudio.co.za'

export const metadata: Metadata = {
  title: {
    default: 'SONKE Tools',
    template: '%s | SONKE Tools',
  },
  description: 'Free AI-powered utility tools for students, creators, developers, and businesses. Convert files, generate content, and boost productivity.',
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: `${siteUrl}/tools`,
    siteName: 'SONKE',
    title: 'SONKE Tools - AI-Powered Utility Tools',
    description: 'Free AI-powered utility tools for students, creators, developers, and businesses. Convert files, generate content, and boost productivity.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SONKE Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SONKE Tools - AI-Powered Utility Tools',
    description: 'Free AI-powered utility tools for students, creators, developers, and businesses.',
  },
  alternates: {
    canonical: `${siteUrl}/tools`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <main className="flex-1 pt-24">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-none animate-spin" />
          </div>
        }>
          {children}
        </Suspense>
      </main>
    </div>
  )
}
