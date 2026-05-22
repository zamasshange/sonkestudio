import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ScrollRestoration } from '@/components/scroll-restoration'
import faviconImage from './images/favicon.png'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: 'SONKE - AI-Powered Utility Tools',
  description: 'Your bestie for file conversions, image editing, and more. Free, fast, and actually fun to use.',
  generator: 'v0.app',
  keywords: ['PDF tools', 'image compression', 'QR code generator', 'file converter', 'AI tools'],
  authors: [{ name: 'SONKE' }],
  icons: {
    icon: [
      {
        url: faviconImage.src,
        type: 'image/png',
        sizes: '32x32',
      },
    ],
    shortcut: faviconImage.src,
    apple: faviconImage.src,
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
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      <html lang="en" className="bg-background" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <ScrollRestoration />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </body>
      </html>
    </ClerkProvider>
  )
}
