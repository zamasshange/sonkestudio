'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
  sideContent?: ReactNode
  backHref?: string
}

export function AuthShell({
  title,
  subtitle,
  children,
  sideContent,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background px-5 pb-16 pt-32 sm:px-8 lg:pt-36">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, oklch(0.885 0.004 260) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.885 0.004 260) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative mx-auto max-w-[640px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground">
            <span className="h-2 w-2 bg-primary" />
            {title}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {subtitle}
          </h1>
          {sideContent}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 border border-border bg-white p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)] sm:p-7"
        >
          {children}
        </motion.div>
      </div>
    </main>
  )
}
