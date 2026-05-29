import type { Metadata } from 'next'
import { categories, tools, type Category, type Tool } from '@/lib/tools-data'

export const siteUrl = 'https://www.sonkestudio.co.za'
export const defaultOgImage = `${siteUrl}/og-image.png`

export const sonkeSocialProfiles = [
  'https://www.instagram.com/sonkestudio.co.za/',
  'https://x.com/sonkestudio',
  'https://www.tiktok.com/@sonkestudio',
  'https://www.linkedin.com/in/zama-shange-344166298/',
] as const

export const staticSeoPages = [
  { path: '/', title: 'SONKE Studio | South African AI Productivity Platform', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', title: 'About SONKE Studio', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/tools', title: 'SONKE Tools', priority: 0.95, changeFrequency: 'daily' },
  { path: '/career', title: 'Career Opportunity Hub', priority: 0.92, changeFrequency: 'daily' },
  { path: '/blog', title: 'SONKE Blog', priority: 0.84, changeFrequency: 'weekly' },
  { path: '/learn', title: 'SONKE Learn', priority: 0.84, changeFrequency: 'weekly' },
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

export function toolCanonicalPath(tool: Tool) {
  return tool.href.startsWith('/tools/') ? `/tools/${tool.id}` : tool.href
}

export function toolPathSegments(tool: Tool) {
  return toolCanonicalPath(tool).replace(/^\/tools\//, '').split('/').filter(Boolean)
}

export function toolSeoTitle(tool: Tool) {
  const titleOverrides: Record<string, string> = {
    'json-formatter': 'JSON Formatter & Validator Online | SONKE Studio',
    'pdf-to-word': 'PDF to Word Converter Online | SONKE Studio',
    'word-to-pdf': 'Word to PDF Converter Online | SONKE Studio',
    'south-african-id-validator': 'South African ID Validator | SONKE Studio',
    'ai-resume-feedback': 'AI Resume Feedback Tool | SONKE Studio',
    'internship-finder': 'Internship Finder for Students & Graduates | SONKE Studio',
    'cover-letter': 'AI Cover Letter Generator | SONKE Studio',
    'explain-code': 'Explain Code Online with AI | SONKE Studio',
    'api-tester': 'API Tester Online for Developers | SONKE Studio',
    'base64-encode': 'Base64 Encoder Online | SONKE Studio',
  }
  if (titleOverrides[tool.id]) return titleOverrides[tool.id]
  const suffix = tool.category === 'career' ? 'South African Career Tools' : 'SONKE Studio'
  return `${tool.name} Online | ${suffix}`
}

export function toolSeoDescription(tool: Tool) {
  const category = categories.find((item) => item.id === tool.category)?.name || 'AI tool'
  return `${tool.description}. Use SONKE Studio's ${tool.name} to complete ${category.toLowerCase()} work faster with focused features, related tools, and mobile-friendly workflows built in South Africa by BDL Corp.`
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
    path: toolCanonicalPath(tool),
    keywords: [
      tool.name,
      ...tool.tags,
      category?.name || '',
      'SONKE Studio',
      'AI tools South Africa',
      'AI productivity tools',
      'developer tools online',
      'student productivity tools',
      'business tools online',
      'free online tool',
    ].filter(Boolean),
  })
}

export function categoryMetadata(category: Category): Metadata {
  return buildMetadata({
    title: `${category.name} Online | SONKE Studio`,
    description: `${category.description}. Browse indexable ${category.name.toLowerCase()} on SONKE Studio with related tools, search-focused workflows, and South African-built AI productivity features.`,
    path: `/tools/category/${category.id}`,
    keywords: [category.name, category.description, 'SONKE Studio', 'AI productivity tools', 'South African AI tools', 'online productivity tools'],
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
    sameAs: sonkeSocialProfiles,
  }
}

export function toolJsonLd(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: toolSeoDescription(tool),
    url: absoluteUrl(toolCanonicalPath(tool)),
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

export function faqPageJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function articleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified = datePublished,
}: {
  title: string
  description: string
  path: string
  datePublished: string
  dateModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: 'Zama Shange',
    },
    publisher: organizationJsonLd(),
    mainEntityOfPage: absoluteUrl(path),
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
