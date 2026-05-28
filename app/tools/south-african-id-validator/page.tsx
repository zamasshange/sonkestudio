import type { Metadata } from 'next'
import { JsonLd } from '@/components/json-ld'
import { ToolRuntimePage } from '@/components/tool-pages/tool-runtime-page'
import { absoluteUrl, breadcrumbJsonLd } from '@/lib/seo'

const title = 'South African ID Validator - SA ID Checker'
const description = 'Check South African ID number format locally. Validate birth date, exact age, gender, citizenship, and SA ID Luhn checksum without connecting to Home Affairs.'
const url = absoluteUrl('/tools/south-african-id-validator')

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'South African ID checker',
    'SA ID validator',
    'South African ID Number Validator',
    'SA ID Verification Tool',
    'check ID number South Africa',
    'verify SA ID',
    'SA ID age checker',
    'South African identity validator',
  ],
  alternates: { canonical: url },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url,
    siteName: 'SONKE Studio',
    title,
    description,
    images: [{ url: absoluteUrl('/og-image.png'), width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [absoluteUrl('/og-image.png')],
  },
}

export default function SouthAfricanIdValidatorPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'South African ID Validator',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Web',
          url,
          description,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'ZAR' },
          featureList: [
            'South African ID checker',
            'SA ID age checker',
            'Local SA ID checksum validation',
            'Birth date, gender, and citizenship extraction',
          ],
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'SONKE Studio', url: absoluteUrl('/') },
          { name: 'Tools', url: absoluteUrl('/tools') },
          { name: 'South African ID Validator', url },
        ])}
      />
      <ToolRuntimePage toolId="south-african-id-validator" />
    </>
  )
}
