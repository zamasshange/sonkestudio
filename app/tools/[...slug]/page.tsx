import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/json-ld'
import { ToolRuntimePage } from '@/components/tool-pages/tool-runtime-page'
import { tools } from '@/lib/tools-data'
import { absoluteUrl, breadcrumbJsonLd, toolJsonLd, toolMetadata, toolPathSegments } from '@/lib/seo'

type ToolPageProps = {
  params: Promise<{ slug?: string[] }>
}

function findTool(slug: string[] = []) {
  const requestPath = slug.join('/')
  const href = `/tools/${requestPath}`
  return tools.find((tool) => tool.href === href)
    || tools.find((tool) => tool.id === requestPath)
    || tools.find((tool) => tool.href.replace(/^\/tools\//, '').endsWith(requestPath))
}

export function generateStaticParams() {
  return tools
    .filter((tool) => tool.href.startsWith('/tools/'))
    .map((tool) => ({ slug: toolPathSegments(tool) }))
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug = [] } = await params
  const tool = findTool(slug)
  if (!tool) {
    return {
      title: 'Tool Not Found | SONKE Studio',
      robots: { index: false, follow: false },
    }
  }
  return toolMetadata(tool)
}

export default async function ToolFallbackPage({ params }: ToolPageProps) {
  const { slug = [] } = await params
  const tool = findTool(slug)
  if (!tool) notFound()

  return (
    <>
      <JsonLd data={toolJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'SONKE Studio', url: absoluteUrl('/') },
          { name: 'Tools', url: absoluteUrl('/tools') },
          { name: tool.name, url: absoluteUrl(tool.href) },
        ])}
      />
      <ToolRuntimePage toolId={tool.id} />
    </>
  )
}
