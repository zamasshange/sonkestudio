import { sitemapIndexXml, xmlResponse } from '@/lib/seo'

export function GET() {
  return xmlResponse(sitemapIndexXml([
    '/sitemap-pages.xml',
    '/sitemap-tools.xml',
    '/sitemap-categories.xml',
    '/sitemap-careers.xml',
    '/sitemap-blog.xml',
  ]))
}
