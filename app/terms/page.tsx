import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use | SONKE Studio',
  description: 'Terms of Use for SONKE Studio by BDL Corp.',
}

export default function TermsPage() {
  return (
    <main className="bg-background px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-[980px] border border-border bg-white p-8 sm:p-10">
        <h1 className="text-4xl font-semibold text-foreground">Terms of Use</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">Effective date: May 27, 2026</p>
        <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
          <p>By using SONKE Studio, you agree to use the platform responsibly and in compliance with applicable laws.</p>
          <p>SONKE and BDL Corp may update tools, features, and policies over time to improve quality and security.</p>
          <p>You are responsible for content you submit and for reviewing outputs before relying on them in academic, business, legal, or technical contexts.</p>
          <p>These terms may be updated periodically. Continued use of the platform indicates acceptance of revised terms.</p>
        </div>
      </div>
    </main>
  )
}
