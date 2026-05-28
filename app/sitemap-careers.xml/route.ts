import { absoluteUrl, careerJobLandingPages, careerSeoPages, sitemapXml, xmlResponse } from '@/lib/seo'

export function GET() {
  const now = new Date().toISOString()
  return xmlResponse(sitemapXml([
    {
      loc: absoluteUrl('/career'),
      lastmod: now,
      changefreq: 'daily',
      priority: 0.92,
    },
    ...careerSeoPages.map((page) => ({
      loc: absoluteUrl(page.path),
      lastmod: now,
      changefreq: 'daily',
      priority: 0.86,
    })),
    ...careerJobLandingPages.map((page) => ({
      loc: absoluteUrl(`/career/jobs/${page.slug}`),
      lastmod: now,
      changefreq: 'daily',
      priority: 0.82,
    })),
  ]))
}
