import type { Appearance } from '@clerk/types'

export const sonkeClerkAppearance: Appearance = {
  variables: {
    colorPrimary: 'oklch(0.65 0.18 35)',
    colorText: 'oklch(0.15 0.01 280)',
    colorTextSecondary: 'oklch(0.5 0.02 280)',
    colorBackground: 'oklch(1 0 0)',
    colorInputBackground: 'oklch(0.985 0.003 260)',
    colorInputText: 'oklch(0.15 0.01 280)',
    borderRadius: '0.25rem',
    fontFamily: 'var(--font-geist-sans), Inter, system-ui, sans-serif',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full shadow-none',
    card: 'border border-border bg-white shadow-none rounded-sm p-0 gap-0',
    headerTitle: 'text-2xl font-semibold tracking-tight text-foreground',
    headerSubtitle: 'text-sm text-muted-foreground',
    socialButtonsBlockButton:
      'border border-border bg-background text-foreground hover:bg-muted rounded-sm h-11',
    socialButtonsBlockButtonText: 'font-semibold text-sm',
    dividerLine: 'bg-border',
    dividerText: 'text-muted-foreground text-xs uppercase font-semibold',
    formFieldLabel: 'text-xs font-semibold uppercase text-muted-foreground',
    formFieldInput:
      'border border-border bg-background rounded-sm h-11 text-foreground focus:ring-2 focus:ring-primary/30',
    formButtonPrimary:
      'bg-primary text-primary-foreground hover:bg-foreground rounded-sm h-11 text-sm font-semibold normal-case',
    footerActionLink: 'text-primary font-semibold hover:text-foreground',
    identityPreviewEditButton: 'text-primary',
    formFieldAction: 'text-primary font-semibold',
    otpCodeFieldInput: 'border border-border rounded-sm',
    alertText: 'text-sm',
    navbar: 'hidden',
    footer: 'bg-transparent',
    footerAction: 'justify-center py-4',
  },
}
