"use client"

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { ArrowRight, Check, Code2, FileText, GraduationCap, PenTool, Search, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sortToolsForUser } from '@/lib/filter-tools'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { useLocation } from '@/hooks/use-location'
import { getHeroMessage } from '@/lib/smart-recommendations'
import { categories, southAfricaPopularTools, tools } from '@/lib/tools-data'
import { getToolImage, shuffleArray } from '@/lib/tool-images'
import { SiFacebook, SiInstagram, SiX } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'

const imageBank = {
  aboutA:
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85',
  aboutB:
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=85',
  serviceA:
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
  serviceB:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
  serviceC:
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=85',
  serviceD:
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=85',
  processA:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
  processB:
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85',
  processC:
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=900&q=85',
  footer:
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85',
}

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

const heroRotatingTasks = [
  'Web Development',
  'AI Automations',
  'Brand Systems',
  'Creator Workflows',
  'Digital Tools',
]

const heroTileVisuals = [
  'from-[#0b6b76] via-[#6d99a4] to-[#d19b4a]',
  'from-[#0e5d70] via-[#8ca8aa] to-[#c67d49]',
  'from-[#1f6f72] via-[#9aa7a0] to-[#cf9152]',
  'from-[#135f72] via-[#9c8f9c] to-[#c8613f]',
  'from-[#174b78] via-[#8ea0a2] to-[#d28a41]',
]

const avatarImages = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
]

const toolboxWorkflows = [
  { label: 'Draft', value: 'AI Writing', icon: PenTool },
  { label: 'Convert', value: 'PDF Tools', icon: FileText },
  { label: 'Study', value: 'Student Desk', icon: GraduationCap },
  { label: 'Debug', value: 'Developer Lab', icon: Code2 },
]

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold uppercase text-muted-foreground">
      <span className="h-2.5 w-2.5 bg-primary" />
      {children}
    </div>
  )
}

export function HeroSection() {
  const { location, season } = useLocation()
  const heroMessage = getHeroMessage(location, season || undefined)

  const { prefs } = useUserPreferences()

  // Smart-sort all tools by location/season/prefs, then rotate top picks on refresh
  const heroTools = useMemo(() => {
    const sorted = sortToolsForUser(tools, { location, season, prefs })
    const topPool = sorted.slice(0, 12)
    return shuffleArray(topPool).slice(0, 5)
  }, [location, season, prefs])

  return (
    // Navbar is fixed (`components/navbar.tsx`), so we need enough top padding here to avoid overlap.
    <section className="bg-background px-4 pb-6 pt-28 sm:px-8 sm:pt-32 lg:pt-32">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-[1820px]"
      >
        <motion.div variants={item} className="relative">
          <div className="min-w-0">
            <h1 className="max-w-full font-semibold leading-[0.82] text-foreground">
              <motion.span
                className="block whitespace-nowrap text-[3.05rem] sm:text-[5.25rem] md:text-[7rem] lg:text-[8.1rem] xl:text-[8rem] 2xl:text-[9.2rem]"
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ delay: 0.16, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                SONKE<sup className="text-[0.28em] align-super">®</sup>_Studio
              </motion.span>
            </h1>
          </div>

          {/* SONKE Toolbox Card — floats over title, Avoora-style */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-0 hidden xl:flex items-center gap-3 rounded-xl border border-border bg-white p-2 pr-3.5 shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg overflow-hidden bg-gradient-to-br from-[#0b5c6b] via-[#4a8cc8] to-[#d4884a]">
              <img src="/logo.png" alt="SONKE" className="h-8 w-8 object-contain" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-foreground">SONKE Toolbox</p>
              <p className="text-[10px] text-muted-foreground">{tools.length}+ tools</p>
            </div>
            <Link href="/tools">
              <span className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-[10px] font-bold tracking-wide text-background transition hover:bg-foreground/90 cursor-pointer">
                START CREATING
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ArrowRight className="h-2 w-2" />
                </span>
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={item}
          className="sonke-hero-field relative mt-3 min-h-[360px] overflow-hidden rounded-[1.25rem] border border-border bg-foreground text-background shadow-[0_35px_90px_-65px_rgba(15,23,42,0.6)] sm:min-h-[400px] lg:min-h-[420px]"
        >
          <div className="sonke-hero-mesh absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/18 via-foreground/5 to-foreground/10" />

          <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute right-5 top-12 hidden sm:block lg:right-8 lg:top-16">
              <div className="flex flex-col gap-2">
                {[
                  { icon: SiInstagram, label: 'Instagram' },
                  { icon: FaLinkedin, label: 'LinkedIn' },
                  { icon: SiFacebook, label: 'Facebook' },
                  { icon: SiX, label: 'X' },
                ].map(({ icon: Icon, label }, index) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, x: 22 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.08, duration: 0.55, ease: 'easeOut' }}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#e4e0dc] text-foreground shadow-sm"
                  >
                    <Icon className="h-5 w-5" style={{ color: '#1a1a1a' }} />
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="max-w-[800px] pt-6 sm:pt-10 lg:pt-10">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.6, ease: 'easeOut' }}
                className="mb-6 flex -space-x-3"
              >
                {avatarImages.map((src, index) => (
                  <motion.img
                    key={src}
                    src={src}
                    alt={`SONKE user ${index + 1}`}
                    initial={{ opacity: 0, x: -14, scale: 0.92 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.25 + index * 0.05, duration: 0.45, ease: 'easeOut' }}
                    className="h-9 w-9 rounded-full border-2 border-background object-cover sm:h-10 sm:w-10"
                  />
                ))}
              </motion.div>
              <h2 className="max-w-[800px] text-[2.2rem] font-bold leading-[1.05] tracking-tight sm:text-[2.8rem] lg:text-[3.4rem]">
                <span className="block">We Build Digital Service with</span>
                <span className="sonke-rotating-line mt-1 block h-[1.2em] overflow-hidden text-background">
                  <span className="sonke-rotating-stack block">
                    {heroRotatingTasks.map((task) => (
                      <span key={task} className="block h-[1.2em]">
                        {task}
                      </span>
                    ))}
                    <span className="block h-[1.2em]">{heroRotatingTasks[0]}</span>
                  </span>
                </span>
              </h2>
              {heroMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-3 text-sm text-background/70"
                >
                  {heroMessage}
                </motion.p>
              )}
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { delayChildren: 1.02, staggerChildren: 0.07 } },
              }}
              className="grid gap-3 pt-5 sm:grid-cols-2 lg:grid-cols-5"
            >
              {heroTools.map((tool: typeof southAfricaPopularTools[0], index: number) => {
                const Icon = tool.icon
                return (
                  <motion.div
                    key={tool.id}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: 'easeOut' } },
                    }}
                  >
                    <Link
                      href={tool.href}
                      className="group flex h-[84px] items-center gap-3 overflow-hidden rounded-lg border border-[#ddd9d5] bg-[#f0ece8] px-3 py-2.5 text-foreground transition hover:-translate-y-1 hover:bg-[#e8e4e0]"
                    >
                      <img
                        src={getToolImage(tool)}
                        alt={tool.name}
                        className="h-[60px] w-[60px] shrink-0 rounded-md object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <span className="text-xs text-muted-foreground">({String(index + 1).padStart(2, '0')})</span>
                        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">{tool.name}</p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export function LogoMarquee() {
  const marqueeItems = categories.map((category) => ({
    ...category,
    count: tools.filter((tool) => tool.category === category.id).length,
  }))
  const secondLane = [...marqueeItems.slice(3), ...marqueeItems.slice(0, 3)]

  return (
    <section className="relative overflow-hidden border-y border-border bg-white py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-white to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,.04)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="relative z-10 space-y-3">
        <motion.div
          className="flex w-max gap-3"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...marqueeItems, ...marqueeItems].map((category, index) => {
            const Icon = category.icon
            return (
              <Link
                key={`${category.id}-${index}`}
                href={`/tools?category=${category.id}`}
                className="group flex min-w-[310px] items-center gap-4 rounded-md border border-border bg-background/95 px-4 py-3 text-foreground shadow-[0_16px_45px_-42px_rgba(15,23,42,0.8)] transition hover:border-primary/40 hover:bg-white"
              >
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-sm ${category.gradient}`}>
                  <Icon className="h-6 w-6 text-foreground transition group-hover:scale-110" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-lg font-semibold">{category.name}</span>
                  <span className="mt-1 block text-xs font-semibold uppercase text-muted-foreground">{category.count} tools ready</span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            )
          })}
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.div
            className="flex w-max gap-3"
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          >
            {[...secondLane, ...secondLane].map((category, index) => {
              const Icon = category.icon
              return (
                <Link
                  key={`${category.id}-reverse-${index}`}
                  href={`/tools?category=${category.id}`}
                  className="group flex min-w-[260px] items-center gap-3 rounded-md border border-border bg-white px-4 py-3 text-foreground transition hover:border-primary/40 hover:bg-background"
                >
                  <Icon className="h-5 w-5 shrink-0 text-primary transition group-hover:rotate-6" />
                  <span className="truncate text-sm font-semibold">{category.description}</span>
                </Link>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function ServicesSection() {
  const { prefs, persona, hasDesk, isSignedIn } = useUserPreferences()
  const { location, season } = useLocation()
  const serviceCards = categories
    .filter((category) => !hasDesk || !prefs || prefs.toolCategories.includes(category.id))
    .map((category, index) => ({
      ...category,
      image: [imageBank.serviceA, imageBank.serviceB, imageBank.serviceC, imageBank.serviceD][index % 4],
      count: tools.filter((tool) => tool.category === category.id).length,
      samples: tools.filter((tool) => tool.category === category.id).slice(0, 3),
    }))
  const previewTools = useMemo(() => {
    const sorted = sortToolsForUser(tools, { location, season, prefs })
    return sorted.slice(0, 6)
  }, [location, season, prefs])

  return (
    <section id="services" className="overflow-x-hidden bg-background px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[1720px]">
        {hasDesk && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">
              Showing tools for your <span className="text-primary">{persona?.label}</span> desk
            </p>
            <Link href="/tools?desk=1" className="text-xs font-semibold uppercase text-primary hover:text-foreground">
              Open filtered tools
            </Link>
          </div>
        )}
        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)] lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-lg border border-border bg-foreground p-6 text-background sm:p-8"
          >
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(135deg,rgba(255,255,255,.2)_0_1px,transparent_1px_18px)]" />
            <div className="relative z-10 flex min-h-[520px] flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-sm font-semibold uppercase text-background/70">
                  <span className="h-2.5 w-2.5 bg-primary" />
                  About the toolbox
                </div>
                <h2 className="mt-7 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  Less tab hopping. More finished work.
                </h2>
                <p className="mt-5 max-w-md text-base leading-7 text-background/72 sm:text-lg">
                  SONKE gathers the small, useful web tools people reach for every day and gives each one a focused workspace.
                </p>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {toolboxWorkflows.map(({ label, value, icon: Icon }, index) => (
                  <motion.div
                    key={value}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: index * 0.06 }}
                    className="rounded-md border border-background/20 bg-background/10 p-4 backdrop-blur"
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-xs font-semibold uppercase text-background/55">0{index + 1}</span>
                    </div>
                    <p className="mt-8 text-sm font-medium text-background/58">{label}</p>
                    <p className="mt-1 text-xl font-semibold">{value}</p>
                  </motion.div>
                ))}
              </div>

              <Link href="/tools" className="mt-10 inline-flex w-fit items-center gap-4 rounded-sm bg-background px-6 py-3.5 text-base font-semibold text-foreground transition hover:bg-primary hover:text-primary-foreground">
                Browse tools
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-white text-primary">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.08, ease: 'easeOut' }}
            className="min-w-0 overflow-hidden rounded-lg border border-border bg-white"
          >
            <div className="grid min-h-0 lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(220px,260px)]">
              <div className="min-w-0 p-5 sm:p-8">
                <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-muted-foreground">
                    <Search className="h-5 w-5 shrink-0" />
                    <span className="truncate text-sm font-medium">
                      {isSignedIn && hasDesk
                        ? `Tools picked for ${persona?.label ?? 'you'}`
                        : 'Find a tool for the task in front of you'}
                    </span>
                  </div>
                  <Link
                    href={hasDesk ? '/tools?desk=1' : '/tools'}
                    className="flex shrink-0 items-center gap-2 text-sm font-semibold text-primary"
                  >
                    <Sparkles className="h-4 w-4" />
                    {hasDesk ? 'My desk' : 'All tools'}
                  </Link>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {previewTools.map((tool, index) => {
                    const Icon = tool.icon
                    return (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.04 }}
                      >
                        <Link href={tool.href} className="group flex min-h-[112px] items-start gap-4 rounded-md border border-border bg-background p-4 transition hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-[0_20px_55px_-40px_rgba(15,23,42,0.7)]">
                          <span
                            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center ${tool.iconColor ? '' : 'rounded-sm border border-black/5'}`}
                            style={{ background: tool.iconColor ? undefined : tool.iconBg, color: tool.iconColor }}
                          >
                            <Icon className={tool.iconColor ? 'h-7 w-7' : 'h-5 w-5'} />
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center justify-between gap-3">
                              <span className="truncate text-lg font-semibold text-foreground">{tool.name}</span>
                              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                            </span>
                            <span className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{tool.description}</span>
                          </span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <div className="min-w-0 border-t border-border bg-background p-5 sm:p-6 xl:border-l xl:border-t-0">
                <p className="text-sm font-semibold uppercase text-muted-foreground">Inside SONKE</p>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      value: hasDesk
                        ? `${previewTools.length}`
                        : `${tools.length}+`,
                      label: hasDesk ? 'on your desk' : 'live tools',
                    },
                    {
                      value: hasDesk && prefs ? `${prefs.toolCategories.length}` : '8',
                      label: hasDesk ? 'your systems' : 'focused categories',
                    },
                    { value: 'Free', label: 'to start using' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-md border border-border bg-white p-4">
                      <p className="text-3xl font-semibold leading-none text-foreground sm:text-4xl">{stat.value}</p>
                      <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 overflow-hidden rounded-md">
                  <img src={imageBank.aboutA} alt="A focused digital workspace" className="h-32 w-full object-cover sm:h-36" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid border-y border-border md:grid-cols-4">
          {[
            { value: 'Prompt-ready', label: 'writing tools ask for the context that shapes better output' },
            { value: 'File-ready', label: 'document tools keep conversion and cleanup close together' },
            { value: 'Study-ready', label: 'student tools turn notes, concepts, and questions into action' },
            { value: 'Ship-ready', label: 'developer utilities handle the small blockers fast' },
          ].map((stat, index) => (
            <div key={stat.value} className="border-border py-8 md:border-r md:px-8">
              <p className="text-sm font-semibold uppercase text-primary">0{index + 1}</p>
              <p className="mt-5 text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <SectionLabel>Tool systems</SectionLabel>
              <h2 className="mt-5 text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">Choose the lane that matches your work.</h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end">
              Each system groups related tools into a faster path, so people can jump from the problem to the right workspace without scanning a long list.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {serviceCards.slice(0, 8).map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: index * 0.04 }}
                  className={`${index === 0 ? 'xl:col-span-2' : ''}`}
                >
                  <Link
                    href={`/tools?category=${category.id}`}
                    className={`group relative flex min-h-[360px] overflow-hidden border border-border bg-white p-5 transition hover:-translate-y-1 hover:border-primary/50 ${index === 0 ? 'sm:min-h-[420px]' : ''}`}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-foreground to-transparent opacity-0 transition group-hover:opacity-100" />
                    <div className="flex w-full flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <span
                            className={`inline-flex h-12 w-12 items-center justify-center border border-border bg-background ${index === 0 ? 'sm:h-14 sm:w-14' : ''}`}
                          >
                            <Icon className={`${index === 0 ? 'h-7 w-7' : 'h-6 w-6'} text-primary transition group-hover:rotate-6 group-hover:scale-110`} />
                          </span>
                          <span className="text-sm font-semibold text-muted-foreground">0{index + 1}</span>
                        </div>

                        {index === 0 && (
                          <div className="mt-6 grid gap-2 sm:grid-cols-[1.2fr_0.8fr]">
                            <div className="h-36 overflow-hidden">
                              <img src={category.image} alt={category.name} className="avoora-image-zoom h-full w-full object-cover" />
                            </div>
                            <div className="grid gap-2">
                              {category.samples.slice(0, 2).map((tool) => {
                                const ToolIcon = tool.icon
                                return (
                                  <span key={tool.id} className="flex items-center gap-2 border border-border bg-background p-3 text-sm font-semibold text-foreground">
                                    <ToolIcon className="h-4 w-4 shrink-0 text-primary" style={{ color: tool.iconColor }} />
                                    <span className="truncate">{tool.name}</span>
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        <div className={index === 0 ? 'mt-8' : 'mt-16'}>
                          <p className="text-sm font-semibold uppercase text-muted-foreground">{category.count} tools ready</p>
                          <h3 className="mt-3 text-3xl font-semibold leading-tight text-foreground">{category.name}</h3>
                          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">{category.description}</p>
                        </div>
                      </div>

                      <div className="mt-8 border-t border-border pt-4">
                        <div className="mb-4 flex flex-wrap gap-2">
                          {category.samples.map((tool) => (
                            <span key={tool.id} className="border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                              {tool.name}
                            </span>
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                          Explore system
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:text-primary" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function FeaturedWorkSection() {
  const { prefs, persona, hasDesk } = useUserPreferences()
  const { location, season } = useLocation()
  const featured = useMemo(() => {
    const sorted = sortToolsForUser(tools, { location, season, prefs })
    return sorted.slice(0, 6)
  }, [location, season, prefs])
  const primaryTool = featured[0]
  const PrimaryIcon = primaryTool.icon
  const quickStats = [
    { value: `${tools.length}+`, label: 'tools' },
    { value: categories.length.toString(), label: 'systems' },
    { value: 'Free', label: 'start' },
  ]

  return (
    <section id="featured" className="overflow-x-hidden bg-white px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1720px]">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div className="min-w-0">
            <SectionLabel>{hasDesk ? 'Your desk' : 'Featured tools'}</SectionLabel>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {hasDesk
                ? `Tools picked for ${persona?.label ?? 'your'} workflow.`
                : 'Start with the tools people actually reach for.'}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <div key={stat.label} className="border border-border bg-background p-5">
                <p className="text-3xl font-semibold leading-none text-foreground">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <Link href={primaryTool.href} className="group flex h-full min-h-[390px] flex-col justify-between border border-foreground bg-foreground p-6 text-background transition hover:border-primary">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`inline-flex h-14 w-14 items-center justify-center bg-background text-foreground ${primaryTool.iconColor ? '' : 'border border-background/20'}`}
                    style={{ color: primaryTool.iconColor }}
                  >
                    <PrimaryIcon className={primaryTool.iconColor ? 'h-8 w-8' : 'h-7 w-7'} />
                  </span>
                  <span className="border border-background/15 px-3 py-1 text-xs font-semibold uppercase text-background/70">
                    Most opened
                  </span>
                </div>
                <p className="mt-12 text-sm font-semibold uppercase text-background/55">Recommended workspace</p>
                <h3 className="mt-3 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">{primaryTool.name}</h3>
                <p className="mt-4 max-w-lg text-base leading-7 text-background/70">{primaryTool.description}</p>
                <div className="mt-10 grid gap-3 sm:grid-cols-[0.78fr_1fr]">
                  <div className="border border-background/15 bg-background/5 p-4">
                    <p className="text-xs font-semibold uppercase text-background/45">Quick swap</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-3xl font-semibold leading-none">R</span>
                      <ArrowRight className="h-4 w-4 text-primary" />
                      <span className="text-3xl font-semibold leading-none">$</span>
                    </div>
                    <p className="mt-5 text-sm text-background/55">Live-style conversion preview</p>
                  </div>
                  <div className="border border-background/15 bg-background/5 p-4">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase text-background/45">
                      <span>Market pulse</span>
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <div className="mt-5 flex h-20 items-end gap-2">
                      {[42, 68, 52, 78, 61, 88, 72].map((height, index) => (
                        <span
                          key={`${height}-${index}`}
                          className="flex-1 bg-primary/80"
                          style={{ height: `${height}%`, opacity: 0.45 + index * 0.07 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-background/15 pt-5">
                <div className="flex flex-wrap gap-2">
                  {primaryTool.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="border border-background/15 px-3 py-1 text-xs font-semibold text-background/70">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  Open tool
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featured.slice(1).map((tool, index) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                >
                  <Link href={tool.href} className="group flex min-h-[185px] flex-col justify-between border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-primary/50 hover:bg-white">
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`inline-flex h-12 w-12 shrink-0 items-center justify-center bg-white ${tool.iconColor ? '' : 'border border-border'}`}
                        style={{ background: tool.iconColor ? undefined : tool.iconBg, color: tool.iconColor }}
                      >
                        <Icon className={tool.iconColor ? 'h-7 w-7' : 'h-5 w-5'} />
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">0{index + 2}</span>
                    </div>
                    <div className="mt-7">
                      <h3 className="text-2xl font-semibold leading-tight text-foreground">{tool.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm font-semibold text-foreground">
                      <span>{tool.usageCount ? `${Math.round(tool.usageCount / 1000)}k uses` : 'Ready'}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}

            <Link href="/tools" className="group flex min-h-[185px] flex-col justify-between border border-dashed border-border bg-white p-5 transition hover:border-primary hover:bg-background">
              <div>
                <p className="text-sm font-semibold uppercase text-muted-foreground">All workspaces</p>
                <h3 className="mt-7 text-2xl font-semibold leading-tight text-foreground">Browse the full toolbox by task.</h3>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                View all tools
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function StatsSection() {
  const steps = [
    {
      title: 'Pick the job',
      text: 'Choose the workspace that matches the task instead of starting from a blank page.',
      tools: ['AI writing', 'PDF', 'Study'],
    },
    {
      title: 'Add the details',
      text: 'The controls ask for the context that changes the quality of the answer.',
      tools: ['Tone', 'Audience', 'Format'],
    },
    {
      title: 'Generate, convert, clean',
      text: 'Get a usable result, then adjust it without leaving the page.',
      tools: ['Rewrite', 'Summarize', 'Convert'],
    },
    {
      title: 'Copy and continue',
      text: 'Move the output into your real work or jump straight to the next tool.',
      tools: ['Copy', 'Export', 'Next task'],
    },
  ]
  const lanes = categories.slice(0, 4)

  return (
    <section className="bg-background px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1720px]">
        <div className="grid gap-8 lg:grid-cols-[0.74fr_1.26fr]">
          <div>
            <SectionLabel>Workflow</SectionLabel>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              A simpler path from task to finished output.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              These sections should help people choose quickly, understand what happens next, and keep moving.
            </p>
            <Link href="/tools" className="mt-8 inline-flex items-center gap-3 bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-primary">
              Open the toolbox
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="border border-border bg-white p-6"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="text-sm font-semibold text-primary">0{index + 1}</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {step.tools.map((tool) => (
                    <span key={tool} className="border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {tool}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {lanes.map((category) => {
            const Icon = category.icon
            const count = tools.filter((tool) => tool.category === category.id).length
            return (
              <Link key={category.id} href={`/tools?category=${category.id}`} className="group flex items-center justify-between gap-4 border border-border bg-white p-4 transition hover:border-primary/50">
                <span className="flex min-w-0 items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0 text-primary" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-foreground">{category.name}</span>
                    <span className="mt-1 block text-xs font-medium text-muted-foreground">{count} tools</span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1720px]">
        <div className="grid overflow-hidden border border-border bg-foreground text-background lg:grid-cols-[1fr_0.72fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="p-6 sm:p-9 lg:p-10"
          >
            <p className="flex items-center gap-3 text-sm font-semibold uppercase text-background/60">
              <Check className="h-4 w-4 text-primary" />
              Ready when you are
            </p>
            <h2 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Choose a focused tool, finish the small job, move on.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-background/68">
              SONKE keeps everyday AI, PDF, study, creator, business, and developer utilities close together so the next step is obvious.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tools">
                <Button className="rounded-sm bg-primary px-6 py-5 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                  Launch tools
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/#featured" className="inline-flex items-center gap-2 border border-background/15 px-5 py-3 text-sm font-semibold text-background/80 transition hover:border-primary hover:text-background">
                See featured
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <div className="border-t border-background/15 p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-10">
            <p className="text-sm font-semibold uppercase text-background/55">Good for</p>
            <div className="mt-5 grid gap-3">
              {toolboxWorkflows.map(({ label, value, icon: Icon }) => (
                <div key={value} className="flex items-center justify-between gap-4 border border-background/15 bg-background/5 p-4">
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <span>
                      <span className="block text-sm font-medium text-background/55">{label}</span>
                      <span className="block text-base font-semibold">{value}</span>
                    </span>
                  </span>
                  <Check className="h-4 w-4 text-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
