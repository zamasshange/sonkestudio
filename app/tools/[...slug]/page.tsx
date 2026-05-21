"use client"

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ToolExperienceSystem } from '@/components/tool-experiences/tool-layout-system'
import { tools } from '@/lib/tools-data'

interface ToolPageProps {
  params: Promise<{ slug?: string[] }>
}

export default function ToolFallbackPage({ params }: ToolPageProps) {
  const resolvedParams = React.use(params)
  const slug = resolvedParams.slug ?? []
  const requestPath = slug.join('/')
  const href = `/tools/${requestPath}`
  const tool = tools.find((tool) => tool.href === href)
    || tools.find((tool) => tool.id === requestPath)
    || tools.find((tool) => tool.href.replace(/^\/tools\//, '').endsWith(requestPath))

  if (!tool) {
    return (
      <div className="min-h-screen bg-background px-6 py-32">
        <div className="max-w-4xl mx-auto rounded-none border border-border bg-white p-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-accent mb-6">Tool unavailable</p>
          <h1 className="text-4xl font-semibold mb-4 text-foreground">Tool not found</h1>
          <p className="text-muted-foreground mb-8">
            The tool you are trying to access does not have a dedicated page yet.
            Please return to the Tools page and choose another tool.
          </p>
          <Link href="/tools" className="inline-flex items-center gap-2 rounded-sm border border-border bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:bg-foreground/90">
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
        </div>
      </div>
    )
  }

  // Use the new tool experience system that routes to category-specific layouts
  return <ToolExperienceSystem tool={tool} />
}
