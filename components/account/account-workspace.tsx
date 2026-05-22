'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useUser, UserProfile } from '@clerk/nextjs'
import { ArrowRight, LayoutGrid, Loader2, Shield, Sparkles } from 'lucide-react'
import {
  PreferencePicker,
  type PreferenceDraft,
} from '@/components/auth/preference-picker'
import { Button } from '@/components/ui/button'
import { sonkeClerkProfileAppearance } from '@/lib/clerk-appearance'
import { pickToolsForUser } from '@/lib/filter-tools'
import { tools } from '@/lib/tools-data'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import {
  personaOptions,
  type UserPersona,
} from '@/lib/user-preferences'
import { cn } from '@/lib/utils'
import logoImage from '@/app/images/logo.png'

type AccountTab = 'desk' | 'security'

interface AccountWorkspaceProps {
  user: ReturnType<typeof useUser>['user']
  onSaveDesk: (draft: PreferenceDraft) => Promise<void>
  saving: boolean
  error: string | null
}

export function AccountWorkspace({ user, onSaveDesk, saving, error }: AccountWorkspaceProps) {
  const { prefs, persona } = useUserPreferences()
  const [draft, setDraft] = useState<PreferenceDraft>({
    persona: 'student',
    toolCategories: personaOptions[0].defaultCategories,
  })
  const [tab, setTab] = useState<AccountTab>('desk')

  useEffect(() => {
    if (prefs) {
      setDraft({
        persona: prefs.persona,
        toolCategories: prefs.toolCategories,
      })
    }
  }, [prefs])

  const deskTools = pickToolsForUser(tools, prefs, 6)
  const displayName =
    user?.fullName ?? user?.firstName ?? user?.primaryEmailAddress?.emailAddress ?? 'SONKE member'
  const email = user?.primaryEmailAddress?.emailAddress
  const PersonaIcon = persona?.icon

  const scrollToSection = (section: AccountTab) => {
    setTab(section)
    const id = section === 'desk' ? 'account-desk' : 'account-security'
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const tabButtonClass = (active: boolean) =>
    cn(
      'inline-flex flex-1 items-center justify-center gap-2 border px-4 py-2.5 text-xs font-semibold uppercase transition sm:flex-none sm:px-4',
      active
        ? 'border-primary bg-primary/10 text-foreground'
        : 'border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground',
    )

  const jumpPillClass = (active: boolean) =>
    cn(
      'inline-flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase transition',
      active
        ? 'border-foreground bg-foreground text-background'
        : 'border-border bg-white text-foreground hover:border-primary/50',
    )

  return (
    <div className="mx-auto w-full max-w-[1320px] px-5 pb-16 pt-24 sm:px-8 sm:pt-28">
      {/* Welcome header — light (restored) */}
      <div className="relative overflow-hidden border border-border bg-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-cyan-600/80 to-foreground/80" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/8 blur-3xl" />

        <div className="relative p-5 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground">
              <span className="h-2 w-2 bg-primary" />
              Your workspace
            </p>
            <Image src={logoImage} alt="SONKE" className="h-6 w-24 object-contain object-right" />
          </div>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between lg:gap-8">
            <div className="flex min-w-0 items-center gap-4">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-full border border-border object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xl font-semibold sm:h-[4.5rem] sm:w-[4.5rem]">
                  {displayName.charAt(0)}
                </span>
              )}
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {displayName}
                </h1>
                {email && <p className="mt-0.5 truncate text-sm text-muted-foreground">{email}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {persona && PersonaIcon && (
                    <span className="inline-flex items-center gap-1.5 border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                      <PersonaIcon className="h-3 w-3" />
                      {persona.label}
                    </span>
                  )}
                  {prefs && (
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                      {prefs.toolCategories.length} systems
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" />
                    Live
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/tools?desk=1"
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 bg-primary px-5 py-3 text-sm font-semibold uppercase text-primary-foreground transition hover:bg-foreground sm:w-auto"
            >
              <LayoutGrid className="h-4 w-4" />
              Open my tools
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="mr-1 text-[10px] font-semibold uppercase text-muted-foreground">Jump to</span>
            <button type="button" className={jumpPillClass(tab === 'desk')} onClick={() => scrollToSection('desk')}>
              <LayoutGrid className="h-3.5 w-3.5" />
              My desk
            </button>
            <button
              type="button"
              className={jumpPillClass(tab === 'security')}
              onClick={() => scrollToSection('security')}
            >
              <Shield className="h-3.5 w-3.5" />
              Security
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2 lg:hidden">
        <button type="button" className={tabButtonClass(tab === 'desk')} onClick={() => setTab('desk')}>
          <LayoutGrid className="h-4 w-4" />
          My desk
        </button>
        <button type="button" className={tabButtonClass(tab === 'security')} onClick={() => setTab('security')}>
          <Shield className="h-4 w-4" />
          Security
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <div
          className={cn(
            'grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]',
            tab !== 'desk' && 'hidden lg:grid',
          )}
        >
          <section id="account-desk" className="scroll-mt-24 border border-border bg-white p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">My desk</h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              Choose your lane and which tool systems show first across SONKE.
            </p>
            <PreferencePicker
              showContinueButton={false}
              compact
              initialPersona={draft.persona as UserPersona}
              initialCategories={draft.toolCategories}
              onChange={setDraft}
            />
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <Button
              type="button"
              onClick={() => onSaveDesk(draft)}
              disabled={saving || draft.toolCategories.length === 0}
              className="mt-5 bg-primary text-primary-foreground hover:bg-foreground"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save desk filter'
              )}
            </Button>
          </section>

          {deskTools.length > 0 && (
            <aside className="hidden border border-border bg-white p-4 lg:block">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Quick open</p>
              <ul className="mt-3 space-y-1">
                {deskTools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <li key={tool.id}>
                      <Link
                        href={tool.href}
                        className="flex items-center gap-2 py-2 text-sm font-medium text-foreground transition hover:text-primary"
                      >
                        <Icon className="h-4 w-4 shrink-0" style={{ color: tool.iconColor }} />
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </aside>
          )}
        </div>

        <section
          id="account-security"
          className={cn(
            'scroll-mt-24 border border-border bg-white',
            tab !== 'security' && 'hidden lg:block',
          )}
        >
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">Security & profile</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Email, password, and connected accounts.
            </p>
          </div>
          <div className="overflow-x-auto px-3 py-4 sm:px-5 sm:py-6">
            <div className="sonke-clerk-profile mx-auto w-full min-w-0 max-w-4xl sm:min-w-[36rem]">
              <UserProfile appearance={sonkeClerkProfileAppearance} routing="hash" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
