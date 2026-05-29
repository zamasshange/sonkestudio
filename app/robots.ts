import type { MetadataRoute } from 'next'

const siteUrl = 'https://www.sonkestudio.co.za'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account/', '/onboarding/', '/sign-in/', '/sign-up/'],
      },
    ],
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/sitemap-pages.xml`,
      `${siteUrl}/sitemap-tools.xml`,
      `${siteUrl}/sitemap-categories.xml`,
      `${siteUrl}/sitemap-careers.xml`,
      `${siteUrl}/sitemap-blog.xml`,
    ],
    host: siteUrl,
  }
}
