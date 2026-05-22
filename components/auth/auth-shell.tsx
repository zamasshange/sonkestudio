'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import logoImage from '@/app/images/logo.png'
import faviconImage from '@/app/images/favicon.png'

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
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-[1820px] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r border-border lg:block">
          <div className="absolute inset-0 sonke-hero-field" />
          <div className="absolute inset-0 sonke-hero-mesh" />
          <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="inline-flex h-16 w-44 items-center">
              <Image
                src={logoImage}
                alt="SONKE logo"
                className="h-full w-full object-contain object-left brightness-0 invert"
                priority
              />
            </Link>

            <div className="max-w-xl space-y-6 text-white">
              <p className="text-sm font-semibold uppercase text-white/70">SONKE account</p>
              <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight xl:text-6xl">
                Your desk, tuned to how you work.
              </h1>
              <p className="text-lg text-white/80">
                Pick your lane — student, creator, business, developer, or everyday utilities —
                and we&apos;ll surface the right tools first.
              </p>
            </div>

            <div className="flex items-center gap-4 border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <span className="flex h-14 w-14 items-center justify-center border border-white/25 bg-white/10">
                <Image src={faviconImage} alt="" className="h-9 w-9 object-contain" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase text-white/60">Free toolbox</p>
                <p className="mt-1 text-lg font-semibold text-white">AI, PDF, study, dev, and more</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col px-5 py-8 sm:px-8 lg:py-12">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <Link href="/" className="inline-flex h-12 w-32 items-center lg:hidden">
              <Image
                src={logoImage}
                alt="SONKE logo"
                className="h-full w-full object-contain object-left"
                priority
              />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex w-full max-w-[520px] flex-1 flex-col"
          >
            <div className="mb-8">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground">
                <span className="h-2.5 w-2.5 bg-primary" />
                {title}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {subtitle}
              </h2>
            </div>

            {sideContent}

            <div className="mt-auto border border-border bg-white p-5 sm:p-7">{children}</div>
          </motion.div>
        </section>
      </div>
    </main>
  )
}
