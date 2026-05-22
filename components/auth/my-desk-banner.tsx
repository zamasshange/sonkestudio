'use client'

import Link from 'next/link'
import { SlidersHorizontal, X } from 'lucide-react'
import { categories } from '@/lib/tools-data'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { cn } from '@/lib/utils'

interface MyDeskBannerProps {
  activeCategory: string | null
  onClearCategory: () => void
  showMyDesk: boolean
  onToggleMyDesk: (value: boolean) => void
  className?: string
}

export function MyDeskBanner({
  activeCategory,
  onClearCategory,
  showMyDesk,
  onToggleMyDesk,
  className,
}: MyDeskBannerProps) {
  const { prefs, persona, hasDesk, isSignedIn } = useUserPreferences()

  if (!isSignedIn || !hasDesk || !prefs) {
    return null
  }

  const activeCategories = prefs.toolCategories
    .map((id) => categories.find((category) => category.id === id))
    .filter(Boolean)

  return (
    <div
      className={cn(
        'border border-primary/25 bg-primary/5 px-4 py-4 sm:px-5',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-primary">Your desk</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {persona?.label ?? 'Custom'} workspace
            {showMyDesk && !activeCategory ? ' — filtered to your picks' : ''}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeCategories.map((category) => (
              <span
                key={category!.id}
                className="border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground"
              >
                {category!.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleMyDesk(!showMyDesk)}
            className={cn(
              'inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold uppercase transition',
              showMyDesk
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-white text-foreground hover:border-primary/50',
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            My desk
          </button>
          <button
            type="button"
            onClick={() => onToggleMyDesk(false)}
            className="inline-flex items-center gap-2 border border-border bg-white px-3 py-2 text-xs font-semibold uppercase text-foreground transition hover:bg-muted"
          >
            All tools
          </button>
          {activeCategory && (
            <button
              type="button"
              onClick={onClearCategory}
              className="inline-flex items-center gap-1 border border-border bg-white px-3 py-2 text-xs font-semibold uppercase text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Clear filter
            </button>
          )}
          <Link
            href="/account"
            className="border border-border bg-white px-3 py-2 text-xs font-semibold uppercase text-foreground transition hover:border-primary/50"
          >
            Edit desk
          </Link>
        </div>
      </div>
    </div>
  )
}
