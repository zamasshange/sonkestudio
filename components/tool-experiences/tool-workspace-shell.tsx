"use client"

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getToolsCategoryHref, Tool } from '@/lib/tools-data'

type ToolWorkspaceHeroProps = {
  tool: Tool
  label: string
  eyebrow?: string
  statusTitle?: string
  statusText?: string
}

export function ToolWorkspaceHero({
  tool,
  label,
  eyebrow,
  statusTitle = 'Focused workspace',
  statusText,
}: ToolWorkspaceHeroProps) {
  const Icon = tool.icon
  const marker = eyebrow || tool.category.replace('-', ' ')
  const backHref = getToolsCategoryHref(tool.category)
  const iconFilter = tool.id === 'tiktok-hook'
    ? 'drop-shadow(-1.2px 0 #00F2EA) drop-shadow(1.2px 0 #FF0050)'
    : undefined

  return (
    <section className="px-5 pb-6 pt-24 sm:px-8">
      <div className="mx-auto max-w-[1720px]">
        <Link href={backHref} className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>

        <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
          <div className="relative overflow-hidden rounded-[1.2rem] border border-border bg-white p-6 sm:p-8">
            <div className="absolute right-8 top-8 max-w-[48%] truncate text-[5rem] font-semibold uppercase leading-none text-muted/60 sm:text-[8rem]">
              {marker}
            </div>
            <div className="relative z-10">
              <p className="flex items-center gap-3 text-sm font-semibold uppercase text-muted-foreground">
                <span className="h-2.5 w-2.5 bg-primary" />
                {label}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-none text-foreground sm:text-6xl">
                {tool.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                {tool.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {tool.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-sm border border-border bg-background px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="sonke-hero-field relative min-h-[220px] overflow-hidden rounded-[1.2rem] border border-border p-6 text-background">
            <div className="sonke-hero-mesh absolute inset-0" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase text-background/70">{label}</span>
                <span
                  className={`inline-flex h-14 w-14 items-center justify-center ${
                    tool.iconColor ? 'bg-transparent text-foreground' : 'rounded-sm border border-black/5 bg-background/90 text-foreground'
                  }`}
                  style={{ background: tool.iconColor ? undefined : tool.iconBg, color: tool.iconColor }}
                >
                  <Icon className={tool.iconColor ? 'h-10 w-10' : 'h-7 w-7'} style={{ filter: iconFilter }} />
                </span>
              </div>
              <div>
                <p className="text-3xl font-semibold">{statusTitle}</p>
                <p className="mt-3 text-sm leading-6 text-background/75">
                  {statusText || 'Add context, tune the workspace, and generate a clean result without leaving the tool.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
