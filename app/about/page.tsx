import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About SONKE Studio',
  description:
    'SONKE Studio is a South African AI ecosystem founded by Zama Shange under BDL Corp, built to make AI useful, human, and practical for real people.',
}

export default function AboutPage() {
  return (
    <main className="bg-background px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-[1200px] space-y-6">
        <section className="border border-border bg-white p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">About SONKE</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Together, powered by AI.</h1>
          <p className="mt-5 max-w-4xl text-base leading-7 text-muted-foreground">
            SONKE means "together" in isiZulu. That meaning is our core philosophy: bringing people, productivity,
            creativity, education, and AI together in one intelligent ecosystem. SONKE was created because many AI
            platforms feel disconnected, generic, overwhelming, and built mostly for technical users.
          </p>
          <p className="mt-3 max-w-4xl text-base leading-7 text-muted-foreground">
            We built SONKE differently: category-focused systems, purpose-built workflows, and human-centered interfaces
            that help students, creators, developers, professionals, businesses, and everyday users get meaningful work done.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="border border-border bg-white p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Founder</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Zama Shange</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              SONKE was founded and developed by South African creator and developer Zama Shange under BDL Corp.
              The mission is to build globally competitive AI experiences from South Africa that are practical, modern,
              and accessible.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The long-term vision blends African innovation with global technology standards to empower the next generation
              of students, creators, entrepreneurs, and builders.
            </p>
          </article>

          <article className="border border-border bg-white p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">BDL Corp</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Technology + Innovation Company</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              BDL Corp is the technology company behind SONKE, focused on AI experiences, digital innovation,
              future-focused software, and intelligent productivity platforms.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Together, SONKE, BDL Corp, and Zama Shange represent one connected technology identity: building tools
              that feel human, useful, and globally ambitious.
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}
