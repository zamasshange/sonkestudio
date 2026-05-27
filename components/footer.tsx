"use client"

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUp, Check, Sparkles, Zap } from 'lucide-react'
import { SiInstagram, SiX } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'
import { categories, tools, trendingTools } from '@/lib/tools-data'
import faviconImage from '@/app/images/favicon.png'

const popularToolIds = [
  'ai-humanizer',
  'pdf-to-word',
  'flashcard-generator',
  'json-formatter',
  'qr-generator',
  'currency-converter',
]

const popularLinks = popularToolIds
  .map((id) => tools.find((tool) => tool.id === id))
  .filter(Boolean)
  .map((tool) => ({
    href: tool!.href,
    label: tool!.name,
  }))

const footerColumns = [
  {
    title: 'Systems',
    links: categories.map((category) => ({
      href: `/tools?category=${category.id}`,
      label: category.name,
    })).slice(0, 8),
  },
  {
    title: 'Popular',
    links: popularLinks,
  },
  {
    title: 'Pages',
    links: [
      { href: '/about', label: 'About SONKE' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Use' },
      { href: '/ai-tools-south-africa', label: 'AI Tools South Africa' },
      { href: '/ai-tools-for-students', label: 'AI Tools for Students' },
      { href: '/ai-tools-for-creators', label: 'AI Tools for Creators' },
      { href: '/tools', label: 'All Tools' },
      { href: '/#services', label: 'Systems' },
      { href: '/#featured', label: 'Featured' },
      { href: '/sign-in', label: 'Sign In' },
      { href: '/sign-up', label: 'Get Started' },
      { href: '/', label: 'Back Home' },
    ],
  },
]

export function Footer() {
  const toolCount = tools.length
  const trending = trendingTools.slice(0, 5)

  return (
    <footer className="border-t border-border bg-background px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-[1720px]">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase text-muted-foreground">
              <span className="h-2.5 w-2.5 bg-primary" />
              SONKE directory
            </p>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Find the next tool without hunting around.
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.08 }} className="grid gap-3 sm:grid-cols-3">
            {[
              { value: `${toolCount}+`, label: 'live tools' },
              { value: categories.length.toString(), label: 'systems' },
              { value: 'Free', label: 'to start' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <p className="text-3xl font-semibold leading-none text-foreground">{item.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr]">
          {footerColumns.map((column, index) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="min-h-[210px] rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:bg-white"
            >
              <p className="mb-5 text-sm font-semibold uppercase text-muted-foreground">{column.title}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="group flex items-center justify-between gap-3 text-base font-medium text-foreground">
                    {link.label}
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-10 overflow-hidden rounded-3xl border border-border bg-foreground text-background shadow-[0_45px_130px_-85px_rgba(2,6,23,1)]"
        >
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute bottom-8 right-8 h-32 w-32 border border-background/10" />
              <div className="relative z-10 inline-flex items-center gap-5">
                <span className="relative flex h-24 w-24 items-center justify-center sm:h-32 sm:w-32">
                  <span className="absolute inset-0 border border-primary/35" />
                  <span className="absolute inset-3 border border-background/10" />
                  <Image src={faviconImage} alt="SONKE favicon" className="relative h-16 w-16 object-contain sm:h-20 sm:w-20" />
                </span>
                <span>
                  <span className="block text-sm font-semibold uppercase text-background/45">SONKE</span>
                  <span className="mt-2 block text-2xl font-semibold leading-none text-background sm:text-3xl">Tools</span>
                </span>
              </div>
              <p className="relative z-10 mt-7 max-w-2xl text-2xl font-semibold leading-tight sm:text-4xl">
                A compact workbench for everyday AI, PDF, study, creator, business, and developer tasks.
              </p>
              <div className="relative z-10 mt-7 flex flex-wrap gap-3">
                {[
                  'No sign-up required',
                  `${toolCount}+ live tools`,
                  'Built for quick tasks',
                ].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 border border-background/15 px-3 py-2 text-sm text-background/80">
                    <Check className="h-4 w-4 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-background/15 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase text-background/60">Trending now</p>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {trending.map((tool, index) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="group flex items-center justify-between gap-4 border border-background/15 p-4 transition hover:border-primary/70 hover:bg-background/5"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="text-xs font-semibold text-background/45">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <Icon className="h-5 w-5 shrink-0 text-primary" style={{ color: tool.iconColor }} />
                        <span className="truncate text-base font-semibold">{tool.name}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-background/50 transition group-hover:translate-x-1 group-hover:text-primary" />
                    </Link>
                  )
                })}
              </div>
              <Link href="/tools" className="mt-6 inline-flex items-center gap-3 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                Browse all tools
                <Zap className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-base text-muted-foreground">Copyright - SONKE Studio by BDL Corp | Built in South Africa for a global generation.</p>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { icon: SiInstagram, label: 'Instagram', color: '#E4405F' },
              { icon: FaLinkedin, label: 'LinkedIn', color: '#0A66C2' },
              { icon: SiX, label: 'X', color: '#111111' },
            ].map(({ icon: Icon, label, color }) => (
              <span key={label} className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-border bg-background text-foreground" aria-label={label}>
                <Icon className="h-5 w-5" style={{ color }} />
              </span>
            ))}
            <Link href="/" className="inline-flex items-center gap-3 text-sm font-semibold uppercase text-foreground">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                <ArrowUp className="h-5 w-5" />
              </span>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
