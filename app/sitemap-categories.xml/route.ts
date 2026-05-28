import { categories } from '@/lib/tools-data'
import { absoluteUrl, sitemapXml, xmlResponse } from '@/lib/seo'

export function GET() {
  const now = new Date().toISOString()
  return xmlResponse(sitemapXml([
    {
      loc: absoluteUrl('/tools'),
      lastmod: now,
      changefreq: 'daily',
      priority: 0.95,
    },
    ...categories.map((category) => ({
      loc: absoluteUrl(`/tools/category/${category.id}`),
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.84,
    })),
  ]))
}
