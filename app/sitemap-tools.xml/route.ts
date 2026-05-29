import { tools } from '@/lib/tools-data'
import { absoluteUrl, sitemapXml, toolCanonicalPath, xmlResponse } from '@/lib/seo'

export function GET() {
  const now = new Date().toISOString()
  return xmlResponse(sitemapXml(tools.filter((tool) => tool.href.startsWith('/tools/')).map((tool) => ({
    loc: absoluteUrl(toolCanonicalPath(tool)),
    lastmod: now,
    changefreq: tool.trending || tool.featured ? 'weekly' : 'monthly',
    priority: tool.featured ? 0.9 : tool.trending ? 0.82 : 0.72,
  }))))
}
