'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { categories } from '@/lib/tools-data'
import {
  personaOptions,
  SIGNUP_PREFS_KEY,
  type UserPersona,
  type UserPreferences,
} from '@/lib/user-preferences'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface PreferenceDraft {
  persona: UserPersona
  toolCategories: string[]
}

interface PreferencePickerProps {
  onContinue?: () => void
  showContinueButton?: boolean
  compact?: boolean
  onChange?: (draft: PreferenceDraft) => void
  initialPersona?: UserPersona
  initialCategories?: string[]
}

export function PreferencePicker({
  onContinue,
  showContinueButton = true,
  compact = false,
  onChange,
  initialPersona = 'student',
  initialCategories,
}: PreferencePickerProps) {
  const [persona, setPersona] = useState<UserPersona>(initialPersona)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategories ?? personaOptions[0].defaultCategories,
  )

  const selectPersona = (nextPersona: UserPersona) => {
    setPersona(nextPersona)
    const option = personaOptions.find((item) => item.id === nextPersona)
    if (option) {
      setSelectedCategories(option.defaultCategories)
    }
  }

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const draft: UserPreferences = {
      persona,
      toolCategories: selectedCategories,
      onboardingComplete: false,
    }
    sessionStorage.setItem(SIGNUP_PREFS_KEY, JSON.stringify(draft))
    onChangeRef.current?.({ persona, toolCategories: selectedCategories })
  }, [persona, selectedCategories])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    )
  }

  return (
    <div className={cn('space-y-6', compact && 'space-y-5')}>
      <div>
        <p className="text-sm font-semibold uppercase text-muted-foreground">I am a</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {personaOptions.map((option) => {
            const Icon = option.icon
            const isActive = persona === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectPersona(option.id)}
                className={cn(
                  'group border p-4 text-left transition',
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-background hover:border-primary/40 hover:bg-muted/40',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center border',
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-white text-primary',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {isActive && <Check className="h-5 w-5 text-primary" />}
                </div>
                <p className="mt-3 text-base font-semibold text-foreground">{option.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold uppercase text-muted-foreground">
          Tools I want on my desk
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a few systems — you can change these anytime.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategories.includes(category.id)
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  'inline-flex items-center gap-2 border px-3 py-2 text-sm font-semibold transition',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:border-primary/50',
                )}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {showContinueButton && onContinue && (
        <Button
          type="button"
          onClick={onContinue}
          disabled={selectedCategories.length === 0}
          className="w-full bg-primary text-primary-foreground hover:bg-foreground"
        >
          Continue to account setup
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
