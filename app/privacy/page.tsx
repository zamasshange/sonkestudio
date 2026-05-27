import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | SONKE Studio',
  description: 'Privacy Policy for SONKE Studio by BDL Corp.',
}

export default function PrivacyPage() {
  return (
    <main className="bg-background px-5 py-28 sm:px-8">
      <div className="mx-auto max-w-[980px] border border-border bg-white p-8 sm:p-10">
        <h1 className="text-4xl font-semibold text-foreground">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">Effective date: May 27, 2026</p>
        <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
          <p>SONKE Studio ("SONKE"), operated by BDL Corp, is committed to respecting your privacy.</p>
          <p>We collect only the information needed to run and improve our platform, including account details, usage analytics, and tool interaction data.</p>
          <p>We use data to provide platform features, improve performance, prevent abuse, and personalize experiences where enabled.</p>
          <p>We do not sell personal data. Limited third-party services may process data to support authentication, analytics, storage, and infrastructure.</p>
          <p>You can request account-related data updates or deletion by contacting the SONKE team through official support channels.</p>
        </div>
      </div>
    </main>
  )
}
