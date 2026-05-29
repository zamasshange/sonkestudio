import { blogPosts } from '@/lib/blog-data'
import { absoluteUrl, sitemapXml, xmlResponse } from '@/lib/seo'

export function GET() {
  const now = new Date().toISOString()
  return xmlResponse(sitemapXml(blogPosts.map((post) => ({
    loc: absoluteUrl(`/blog/${post.slug}`),
    lastmod: now,
    changefreq: 'monthly',
    priority: 0.78,
  }))))
}
