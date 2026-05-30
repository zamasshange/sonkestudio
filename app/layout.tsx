import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { ClerkModeProvider } from '@/components/auth/clerk-mode-provider'
import { ScrollRestoration } from '@/components/scroll-restoration'
import { PostHogProvider } from '@/components/posthog-provider'
import { OneSignalProvider } from '@/components/onesignal-provider'
import { StreakBadge } from '@/components/streak-badge'
import { SiteShell } from '@/components/site-layout'
import { sonkeSocialProfiles } from '@/lib/seo'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-geist-sans',
})

const siteUrl = 'https://www.sonkestudio.co.za'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SONKE Studio | South African AI Productivity Platform',
    template: '%s | SONKE',
  },
  description: 'SONKE Studio is a South African AI platform and productivity ecosystem built by Zama Shange under BDL Corp. Purpose-built AI tools for students, creators, developers, businesses, and everyday users.',
  generator: 'Next.js',
  keywords: [
    'SONKE',
    'SONKE Studio',
    'BDL Corp',
    'Zama Shange',
    'sonke studio',
    'sonkestudio.co.za',
    'AI tools South Africa',
    'South African AI platform',
    'South African AI tools',
    'free AI tools',
    'online AI tools',
    'AI productivity platform',
    'AI tools for students',
    'AI tools for creators',
    'AI workspace tools',
    'PDF tools',
    'PDF converter South Africa',
    'image compression',
    'QR code generator',
    'file converter',
    'AI tools',
    'document tools',
    'email writer AI',
    'resume builder',
    'CV builder South Africa',
    'ATS resume checker',
    'cover letter generator',
    'caption generator',
    'hashtag generator',
    'TikTok caption generator',
    'flashcard maker',
    'quiz generator',
    'math solver',
    'CAPS study tools',
    'matric study tools',
    'NSFAS guidance tools',
    'bio generator',
    'SEO tools',
    'marketing tools',
    'developer tools',
    'JSON formatter',
    'API tester',
    'regex tester',
    'unit converter',
    'password generator',
    'link shortener',
    'ZAR invoice generator',
    'South African CV format',
    'VAT invoice South Africa',
  ],
  authors: [{ name: 'SONKE Studio' }, { name: 'Zama Shange' }],
  creator: 'Zama Shange',
  publisher: 'BDL Corp',
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
    title: 'SONKE Studio | Built in South Africa for a Global Generation',
    description: 'One intelligent ecosystem where productivity, creativity, education, and AI come together.',
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
    title: 'SONKE Studio | South African AI Platform',
    description: 'Purpose-built AI systems for students, creators, developers, businesses, and everyday users.',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const host = requestHeaders.get('host') || ''
  const localHost = host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('[::1]')
  const disableClerk = localHost

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'SONKE',
        url: siteUrl,
        inLanguage: ['en-ZA', 'en'],
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
        name: 'BDL Corp',
        url: siteUrl,
        logo: `${siteUrl}/icon.png`,
        brand: {
          '@type': 'Brand',
          name: 'SONKE Studio',
        },
        sameAs: sonkeSocialProfiles,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+27-XX-XXX-XXXX',
          contactType: 'customer service',
          availableLanguage: ['en', 'af', 'zu', 'xh'],
        },
      },
      {
        '@type': 'Person',
        name: 'Zama Shange',
        worksFor: {
          '@type': 'Organization',
          name: 'BDL Corp',
        },
        knowsAbout: [
          'AI productivity platforms',
          'South African AI innovation',
          'Digital product development',
        ],
      },
    ],
  }

  return (
    <ClerkModeProvider disabled={disableClerk}>
      {disableClerk ? (
        <PostHogProvider>
          <OneSignalProvider>
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
                <SiteShell>{children}</SiteShell>
                <StreakBadge />
                <Analytics />
              </body>
            </html>
          </OneSignalProvider>
        </PostHogProvider>
      ) : (
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          afterSignOutUrl="/"
        >
          <PostHogProvider>
            <OneSignalProvider>
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
                  <SiteShell>{children}</SiteShell>
                  <StreakBadge />
                  <Analytics />
                </body>
              </html>
            </OneSignalProvider>
          </PostHogProvider>
        </ClerkProvider>
      )}
    </ClerkModeProvider>
  )
}
