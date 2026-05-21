import { AITool } from '@/components/ai-tool'

const categoryThemes: Record<string, { label: string; description: string; accent: string; highlight: string }> = {
  ai: {
    label: 'AI Writing Lab',
    description: 'Smart text transformation, idea generation, and creative writing in one place.',
    accent: 'from-violet-500 to-fuchsia-500',
    highlight: 'Write faster with AI flair',
  },
  student: {
    label: 'Study Assistant',
    description: 'Homework help, exam prep, and academic support tailored to your learning.',
    accent: 'from-sky-500 to-cyan-500',
    highlight: 'Learn smarter with step-by-step guidance',
  },
  creator: {
    label: 'Creator Studio',
    description: 'Content ideas, social hooks, and viral copy built for creators.',
    accent: 'from-rose-500 to-orange-500',
    highlight: 'Create content that stands out',
  },
  document: {
    label: 'Document Assistant',
    description: 'Simplify documents, polish writing, and generate professional content.',
    accent: 'from-emerald-500 to-teal-500',
    highlight: 'Document tasks done effortlessly',
  },
  pdf: {
    label: 'PDF Toolbox',
    description: 'Merge, convert, and manage PDFs without friction.',
    accent: 'from-slate-500 to-slate-700',
    highlight: 'PDF work made easy',
  },
  utility: {
    label: 'Utility Suite',
    description: 'Everyday tools and quick helpers for productive workflows.',
    accent: 'from-amber-500 to-orange-500',
    highlight: 'Fast tools for daily tasks',
  },
  dev: {
    label: 'Developer Toolkit',
    description: 'Code helpers, formatting tools, and developer workflows powered by AI.',
    accent: 'from-slate-600 to-slate-900',
    highlight: 'Developer tools with instant output',
  },
  business: {
    label: 'Business Growth',
    description: 'Professional business tools for pitches, plans, and career growth.',
    accent: 'from-indigo-500 to-blue-600',
    highlight: 'Build your business with smart support',
  },
  explain: {
    label: 'Explain This',
    description: 'Understand errors, documents, and ideas with clear explanations.',
    accent: 'from-fuchsia-500 to-pink-500',
    highlight: 'Clarity for every question',
  },
  image: {
    label: 'Image Studio',
    description: 'Image resizing, compression, and export tools for visuals.',
    accent: 'from-cyan-500 to-blue-600',
    highlight: 'Manage images instantly',
  },
  qr: {
    label: 'QR Maker',
    description: 'Generate QR codes quickly and customize them for sharing.',
    accent: 'from-emerald-500 to-lime-500',
    highlight: 'Create QR codes in seconds',
  },
}

interface ToolPageProps {
  title: string
  description: string
  toolId: string
  category?: string
  inputPlaceholder: string
}

export function ToolPage({ title, description, toolId, category = 'ai', inputPlaceholder }: ToolPageProps) {
  const theme = categoryThemes[category] || categoryThemes.ai

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_30px_90px_-70px_rgba(15,23,42,0.25)]">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] p-8 md:p-12">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">{theme.label}</p>
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">{title}</h1>
                  <p className="max-w-2xl text-base leading-8 text-muted-foreground">{description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1rem] border border-border bg-muted p-5">
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="mt-3 text-xl font-semibold text-foreground capitalize">{category}</p>
                  </div>
                  <div className="rounded-[1rem] border border-border bg-muted p-5">
                    <p className="text-sm text-muted-foreground">Best for</p>
                    <p className="mt-3 text-xl font-semibold text-foreground">{theme.highlight}</p>
                  </div>
                </div>
              </div>
              <div className={`rounded-[2rem] bg-gradient-to-br ${theme.accent} p-8 shadow-lg shadow-slate-950/15 text-white`}>
                <p className="text-sm uppercase tracking-[0.35em] text-white/80">Instant AI Boost</p>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight">{theme.highlight}</h2>
                <p className="mt-4 text-sm leading-7 text-white/80">Use the tool below to get a fast, polished output that feels premium and professional.</p>
                <div className="mt-8 rounded-[1rem] bg-white/10 p-5 ring-1 ring-white/10">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/70">Tip</p>
                  <p className="mt-3 text-sm text-white/90">Start with a clear prompt and the tool will do the rest. You can refine your request after the first result.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8 shadow-[0_20px_80px_-50px_rgba(15,23,42,0.15)]">
            <AITool
              title={title}
              description={description}
              inputPlaceholder={inputPlaceholder}
              toolId={toolId}
              toolTitle={title}
              toolDescription={description}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
