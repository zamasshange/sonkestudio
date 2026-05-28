import { tools } from '@/lib/tools-data'
import { absoluteUrl, sitemapXml, xmlResponse } from '@/lib/seo'

export function GET() {
  const now = new Date().toISOString()
  return xmlResponse(sitemapXml(tools.map((tool) => ({
    loc: absoluteUrl(tool.href),
    lastmod: now,
    changefreq: tool.trending || tool.featured ? 'weekly' : 'monthly',
    priority: tool.featured ? 0.9 : tool.trending ? 0.82 : 0.72,
  }))))
}
