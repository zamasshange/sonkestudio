"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ToolExperienceSystem } from '@/components/tool-experiences/tool-layout-system'
import { ToolSeoSections } from '@/components/tool-seo-sections'
import { tools } from '@/lib/tools-data'
import { trackToolOpen } from '@/lib/gamification'

export function ToolRuntimePage({ toolId }: { toolId?: string }) {
  const tool = toolId ? tools.find((item) => item.id === toolId) : undefined

  useEffect(() => {
    if (tool) {
      trackToolOpen(tool.id, tool.name, tool.category)
    }
  }, [tool])

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

  return (
    <>
      <ToolExperienceSystem tool={tool} />
      <ToolSeoSections tool={tool} />
    </>
  )
}
