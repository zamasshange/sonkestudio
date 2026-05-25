import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { ScrollRestoration } from '@/components/scroll-restoration'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-geist-sans',
})

const siteUrl = 'https://sonkestudio.co.za'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SONKE - AI-Powered Utility Tools',
    template: '%s | SONKE',
  },
  description: 'Your bestie for file conversions, image editing, and more. Free, fast, and actually fun to use. SONKE offers AI-powered tools for students, creators, developers, and businesses.',
  generator: 'Next.js',
  keywords: [
    'PDF tools',
    'image compression',
    'QR code generator',
    'file converter',
    'AI tools',
    'resume builder',
    'caption generator',
    'flashcard maker',
    'bio generator',
    'SEO tools',
    'marketing tools',
    'developer tools',
  ],
  authors: [{ name: 'SONKE' }],
  creator: 'SONKE',
  publisher: 'SONKE',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: siteUrl,
    siteName: 'SONKE',
    title: 'SONKE - AI-Powered Utility Tools',
    description: 'Your bestie for file conversions, image editing, and more. Free, fast, and actually fun to use.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'SONKE - AI-Powered Utility Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SONKE - AI-Powered Utility Tools',
    description: 'Your bestie for file conversions, image editing, and more. Free, fast, and actually fun to use.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@sonkestudio',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'en': siteUrl,
      'en-ZA': siteUrl,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
        sizes: '32x32',
      },
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
    ],
    shortcut: '/favicon.ico',
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: {
      rel: 'manifest',
      url: '/site.webmanifest',
    },
  },
  verification: {
    google: '2lzaFk4ZwUdTuws9kS-4gwpgi1Lpgbd8oOYJX0dks38',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f5' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1f' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'SONKE',
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        name: 'SONKE',
        url: siteUrl,
        logo: `${siteUrl}/icon.png`,
        sameAs: [
          'https://twitter.com/sonkestudio',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+27-XX-XXX-XXXX',
          contactType: 'customer service',
          availableLanguage: ['en', 'af', 'zu', 'xh'],
        },
      },
    ],
  }

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <html lang="en" className="bg-background" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/site.webmanifest" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </head>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ScrollRestoration />
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8021272939133910"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </body>
      </html>
    </ClerkProvider>
  )
}
