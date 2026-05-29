import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { Tool } from '@/lib/tools-data'
import { buildToolSeoContent } from '@/lib/tool-seo-content'

function toolHref(tool: Tool) {
  return tool.href.startsWith('/tools/') ? `/tools/${tool.id}` : tool.href
}

export function ToolSeoSections({ tool }: { tool: Tool }) {
  const content = buildToolSeoContent(tool)

  return (
    <section className="bg-background px-5 pb-24 pt-4 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <article className="rounded-2xl border border-border bg-white p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">About this tool</p>
          <h2 className="mt-3 text-3xl font-semibold text-foreground">{tool.name} by SONKE Studio</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-muted-foreground">{content.about}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {content.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                {keyword}
              </span>
            ))}
          </div>
        </article>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-foreground">Features</h2>
            <ul className="mt-5 grid gap-3">
              {content.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-foreground">How It Works</h2>
            <ol className="mt-5 grid gap-3">
              {content.howItWorks.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-foreground text-xs font-semibold text-background">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-foreground">Use Cases</h2>
            <ul className="mt-5 grid gap-3">
              {content.useCases.map((useCase) => (
                <li key={useCase} className="border-l-2 border-primary pl-4 text-sm leading-6 text-muted-foreground">
                  {useCase}
                </li>
              ))}
            </ul>
            <h2 className="mt-8 text-2xl font-semibold text-foreground">Why Use SONKE Studio</h2>
            <ul className="mt-5 grid gap-3">
              {content.benefits.map((benefit) => (
                <li key={benefit} className="text-sm leading-6 text-muted-foreground">{benefit}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-border bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-foreground">Frequently Asked Questions</h2>
            <div className="mt-5 grid gap-4">
              {content.faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl border border-border bg-background p-4">
                  <h3 className="text-base font-semibold text-foreground">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article className="rounded-2xl border border-border bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Related tools</p>
              <h2 className="mt-3 text-2xl font-semibold text-foreground">Continue your workflow</h2>
            </div>
            <Link href="/tools" className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-foreground">
              Browse all tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.relatedTools.map((relatedTool) => (
              <Link key={relatedTool.id} href={toolHref(relatedTool)} className="group flex min-h-[118px] flex-col justify-between rounded-xl border border-border bg-background p-4 transition hover:border-primary/50 hover:bg-white">
                <span>
                  <span className="block text-base font-semibold text-foreground">{relatedTool.name}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">{relatedTool.description}</span>
                </span>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase text-primary">
                  Open tool <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
