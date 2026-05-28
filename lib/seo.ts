import type { Metadata } from 'next'
import { categories, tools, type Category, type Tool } from '@/lib/tools-data'

export const siteUrl = 'https://sonkestudio.co.za'
export const defaultOgImage = `${siteUrl}/og-image.png`

export const staticSeoPages = [
  { path: '/', title: 'SONKE Studio | South African AI Productivity Platform', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', title: 'About SONKE Studio', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/tools', title: 'SONKE Tools', priority: 0.95, changeFrequency: 'daily' },
  { path: '/career', title: 'Career Opportunity Hub', priority: 0.92, changeFrequency: 'daily' },
  { path: '/ai-tools-south-africa', title: 'AI Tools South Africa', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/south-african-ai-platform', title: 'South African AI Platform', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/ai-productivity-platform', title: 'AI Productivity Platform', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/ai-tools-for-students', title: 'AI Tools for Students', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/ai-tools-for-creators', title: 'AI Tools for Creators', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/privacy', title: 'Privacy Policy', priority: 0.35, changeFrequency: 'yearly' },
  { path: '/terms', title: 'Terms of Use', priority: 0.35, changeFrequency: 'yearly' },
] as const

export const careerSeoPages = [
  {
    path: '/career/internships',
    mode: 'internships',
    title: 'Internship Finder for South African Students',
    description: 'Find internships, learnerships, bursaries, and graduate programmes across South Africa with live job data and SONKE career AI.',
    keywords: ['internships South Africa', 'learnerships', 'graduate programmes', 'student jobs', 'bursaries'],
    query: 'internship learnership graduate programme bursary South Africa',
    location: 'South Africa',
  },
  {
    path: '/career/cover-letter',
    mode: 'cover',
    title: 'Free AI Cover Letter Generator',
    description: 'Generate tailored cover letters from live job listings with conversational AI editing, tone changes, and job-specific guidance.',
    keywords: ['cover letter generator', 'AI cover letter', 'job application letter', 'South Africa jobs'],
    query: 'graduate internship entry level South Africa',
    location: 'South Africa',
  },
  {
    path: '/career/resume-feedback',
    mode: 'resume',
    title: 'AI Resume Feedback Tool',
    description: 'Upload your CV for ATS guidance, formatting checks, keyword analysis, and job-readiness feedback for South African opportunities.',
    keywords: ['AI resume feedback', 'CV feedback South Africa', 'ATS resume checker', 'resume optimizer'],
    query: 'graduate internship entry level South Africa',
    location: 'South Africa',
  },
  {
    path: '/career/application-tracker',
    mode: 'tracker',
    title: 'Career Application Tracker',
    description: 'Track saved jobs, applications, interviews, offers, reminders, and notes inside the SONKE Career Hub.',
    keywords: ['application tracker', 'job tracker', 'interview tracker', 'saved jobs'],
    query: 'graduate internship entry level South Africa',
    location: 'South Africa',
  },
] as const

export const careerJobLandingPages = [
  {
    slug: 'internships-johannesburg',
    title: 'Internships in Johannesburg',
    description: 'Browse live internships, learnerships, and graduate opportunities in Johannesburg with SONKE Studio.',
    query: 'internship learnership graduate Johannesburg',
    location: 'Johannesburg',
  },
  {
    slug: 'cape-town-graduate-jobs',
    title: 'Cape Town Graduate Jobs',
    description: 'Discover Cape Town graduate jobs, entry-level roles, internships, and student opportunities refreshed from live providers.',
    query: 'graduate jobs internship entry level Cape Town',
    location: 'Cape Town',
  },
  {
    slug: 'durban-learnerships',
    title: 'Learnerships in Durban',
    description: 'Find Durban learnerships, internships, and youth career opportunities with AI application support.',
    query: 'learnership internship student opportunity Durban',
    location: 'Durban',
  },
  {
    slug: 'pretoria-student-jobs',
    title: 'Student Jobs in Pretoria',
    description: 'Search student jobs, internships, bursaries, and graduate programmes in Pretoria.',
    query: 'student jobs internship bursary graduate Pretoria',
    location: 'Pretoria',
  },
  {
    slug: 'remote-jobs-south-africa',
    title: 'Remote Jobs South Africa',
    description: 'Explore remote jobs, junior roles, internships, and work-from-home opportunities for South African talent.',
    query: 'remote jobs junior entry level South Africa',
    location: 'Remote Africa',
  },
] as const

export function absoluteUrl(path: string) {
  return `${siteUrl}${path === '/' ? '' : path}`
}

export function toolPathSegments(tool: Tool) {
  return tool.href.replace(/^\/tools\//, '').split('/').filter(Boolean)
}

export function toolSeoTitle(tool: Tool) {
  const suffix = tool.category === 'career' ? 'Jobs in South Africa' : 'SONKE Studio'
  return `${tool.name} | ${suffix}`
}

export function toolSeoDescription(tool: Tool) {
  const category = categories.find((item) => item.id === tool.category)?.name || 'AI tool'
  return `${tool.description}. Use ${tool.name} inside SONKE Studio, a fast ${category.toLowerCase()} workspace built for students, creators, developers, businesses, and South African users.`
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  type = 'website',
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  type?: 'website' | 'article'
}): Metadata {
  const url = absoluteUrl(path)
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: 'SONKE Studio',
      title,
      description,
      images: [{ url: defaultOgImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function toolMetadata(tool: Tool): Metadata {
  const category = categories.find((item) => item.id === tool.category)
  return buildMetadata({
    title: toolSeoTitle(tool),
    description: toolSeoDescription(tool),
    path: tool.href,
    keywords: [
      tool.name,
      ...tool.tags,
      category?.name || '',
      'SONKE Studio',
      'AI tools South Africa',
      'free online tool',
    ].filter(Boolean),
  })
}

export function categoryMetadata(category: Category): Metadata {
  return buildMetadata({
    title: `${category.name} | SONKE Studio`,
    description: `${category.description}. Browse ${category.name.toLowerCase()} in SONKE Studio with purpose-built workflows, related tools, and fast mobile-friendly pages.`,
    path: `/tools/category/${category.id}`,
    keywords: [category.name, category.description, 'SONKE Studio', 'AI productivity tools', 'South African AI tools'],
  })
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SONKE Studio',
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    parentOrganization: {
      '@type': 'Organization',
      name: 'BDL Corp',
    },
    founder: {
      '@type': 'Person',
      name: 'Zama Shange',
    },
    sameAs: [
      'https://twitter.com/sonkestudio',
      'https://www.instagram.com/sonkestudio',
      'https://www.linkedin.com/company/sonkestudio',
    ],
  }
}

export function toolJsonLd(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: toolSeoDescription(tool),
    url: absoluteUrl(tool.href),
    applicationCategory: categories.find((item) => item.id === tool.category)?.name || 'ProductivityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ZAR',
    },
    publisher: organizationJsonLd(),
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function sitemapXml(entries: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }>) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map((entry) => `  <url>\n    <loc>${entry.loc}</loc>\n${entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>\n` : ''}${entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>\n` : ''}${entry.priority ? `    <priority>${entry.priority.toFixed(2)}</priority>\n` : ''}  </url>`)
    .join('\n')}\n</urlset>`
}

export function sitemapIndexXml(paths: string[]) {
  const now = new Date().toISOString()
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((path) => `  <sitemap>\n    <loc>${absoluteUrl(path)}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`)
    .join('\n')}\n</sitemapindex>`
}

export function xmlResponse(body: string) {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
