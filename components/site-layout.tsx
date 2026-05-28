"use client"

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <Navbar />
      <motion.div
        className="min-h-screen flex-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
      <Footer />
    </div>
  )
}

export function SitePageShell({
  eyebrow,
  title,
  description,
  children,
  maxWidth = 'max-w-[1180px]',
}: {
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
  maxWidth?: string
}) {
  return (
    <main className="bg-background px-5 pb-20 pt-32 sm:px-8 lg:pt-36">
      <div className={`mx-auto ${maxWidth}`}>
        <section className="border border-border bg-white p-7 shadow-sm sm:p-10">
          {eyebrow ? (
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-2.5 w-2.5 bg-primary" />
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-4xl text-base leading-8 text-muted-foreground">
              {description}
            </p>
          ) : null}
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  )
}

export function SiteSection({
  children,
  className = '',
  maxWidth = 'max-w-[1720px]',
}: {
  children: ReactNode
  className?: string
  maxWidth?: string
}) {
  return (
    <section className={`px-5 py-20 sm:px-8 ${className}`}>
      <div className={`mx-auto ${maxWidth}`}>{children}</div>
    </section>
  )
}
