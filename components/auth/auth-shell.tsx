'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import logoImage from '@/app/images/logo.png'

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
  backHref = '/',
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, oklch(0.885 0.004 260) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.885 0.004 260) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-16 h-56 w-56 rounded-full bg-foreground/5 blur-3xl" />

      <div className="relative mx-auto max-w-[640px] px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-10 flex items-center justify-between gap-4 border-b border-border pb-6">
          <Link href="/" className="inline-flex h-12 w-36 items-center" aria-label="SONKE home">
            <Image src={logoImage} alt="SONKE" className="h-full w-full object-contain object-left" priority />
          </Link>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>

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
