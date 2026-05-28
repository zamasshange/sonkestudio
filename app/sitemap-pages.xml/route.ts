import { absoluteUrl, sitemapXml, staticSeoPages, xmlResponse } from '@/lib/seo'

export function GET() {
  const now = new Date().toISOString()
  return xmlResponse(sitemapXml(staticSeoPages.map((page) => ({
    loc: absoluteUrl(page.path),
    lastmod: now,
    changefreq: page.changeFrequency,
    priority: page.priority,
  }))))
}
