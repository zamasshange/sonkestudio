"use client"

import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowRight, Check, Code2, FileText, GraduationCap, PenTool, Search, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { categories, featuredTools, tools, trendingTools } from '@/lib/tools-data'
import faviconImage from '@/app/images/favicon.png'
import { SiInstagram, SiX } from 'react-icons/si'
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

const heroTools = Array.from(
  new Map(
    [
      featuredTools[0],
      trendingTools[0],
      tools.find((tool) => tool.id === 'timezone-converter'),
      tools.find((tool) => tool.id === 'currency-converter'),
      tools.find((tool) => tool.id === 'flashcard-generator'),
      tools.find((tool) => tool.id === 'qr-generator'),
    ]
      .filter(Boolean)
      .map((tool) => [tool!.id, tool!]),
  ).values(),
).slice(0, 5)

const heroLines = [
  ['Build,', 'convert,', 'explain,'],
  ['polish,', 'and', 'ship', 'without'],
  ['opening', 'ten', 'tabs.'],
]

const heroTypedLines = heroLines.map((line) => line.join(' '))

const heroTileVisuals = [
  'from-cyan-500 via-blue-500 to-primary',
  'from-indigo-400 via-white to-sky-500',
  'from-amber-500 via-orange-300 to-primary',
  'from-rose-500 via-teal-400 to-cyan-500',
  'from-slate-500 via-zinc-300 to-orange-400',
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
  return (
    <section className="bg-background px-5 pb-10 pt-36 sm:px-8 lg:pt-40">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-[1820px]"
      >
        <motion.div variants={item} className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.p
              variants={item}
              className="mb-2 text-sm font-semibold uppercase text-muted-foreground"
            >
              Free AI toolbox for real work
            </motion.p>
            <h1 className="max-w-[1120px] overflow-hidden text-[3.5rem] font-semibold leading-none text-foreground sm:text-[5.5rem] lg:text-[7.6rem]">
              <motion.span
                className="block"
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ delay: 0.16, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                SONKE_Tools
              </motion.span>
            </h1>
          </div>

          <motion.div
            variants={item}
            whileHover={{ y: -6, rotate: -0.4 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-lg border border-border bg-white p-3 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.7)] lg:min-w-[360px]"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-cyan-500 to-foreground" />
            <div className="grid grid-cols-[76px_1fr] gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-md border border-border bg-background p-3 shadow-inner">
                <Image src={faviconImage} alt="SONKE favicon" className="h-full w-full object-contain" priority />
              </div>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-semibold leading-none text-foreground">SONKE desk</p>
                    <p className="mt-1.5 text-sm font-medium text-muted-foreground">AI, PDF, student, dev</p>
                  </div>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase text-primary">
                    Live
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {heroTools.slice(0, 4).map((tool) => {
                    const Icon = tool!.icon
                    return (
                      <span
                        key={tool!.id}
                        className={`inline-flex h-8 w-8 items-center justify-center ${
                          tool!.iconColor ? 'bg-transparent text-foreground' : 'rounded-sm border border-black/5 bg-muted text-foreground'
                        }`}
                        style={{ background: tool!.iconColor ? undefined : tool!.iconBg, color: tool!.iconColor }}
                      >
                        <Icon className={tool!.iconColor ? 'h-6 w-6' : 'h-4 w-4'} style={{ filter: tool!.id === 'tiktok-hook' ? 'drop-shadow(-1px 0 #00F2EA) drop-shadow(1px 0 #FF0050)' : undefined }} />
                      </span>
                    )
                  })}
                  <Link href="/tools" className="ml-auto inline-flex items-center gap-2 rounded-sm bg-foreground px-3 py-2 text-sm font-semibold text-background transition hover:bg-primary">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={item}
          className="sonke-hero-field relative mt-4 min-h-[430px] overflow-hidden rounded-[1.2rem] border border-border bg-foreground text-background shadow-[0_35px_90px_-65px_rgba(15,23,42,0.6)] lg:min-h-[455px]"
        >
          <div className="sonke-hero-mesh absolute inset-0" />
          <motion.div
            className="absolute left-[42%] top-[-18%] h-72 w-72 rounded-full bg-white/18 blur-3xl"
            animate={{ scale: [1, 1.08, 1], opacity: [0.22, 0.34, 0.22] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-22%] right-[8%] h-80 w-80 rounded-full bg-primary/25 blur-3xl"
            animate={{ scale: [1.05, 0.96, 1.05], opacity: [0.28, 0.18, 0.28] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/45 via-foreground/10 to-foreground/15" />

          <div className="relative z-10 flex min-h-[430px] flex-col justify-between p-5 sm:p-7 lg:min-h-[455px]">
            <div className="pointer-events-none absolute right-5 top-10 hidden sm:block lg:right-8">
              <div className="flex flex-col gap-2">
                {[
                  { icon: SiInstagram, label: 'Instagram', color: '#E4405F' },
                  { icon: FaLinkedin, label: 'LinkedIn', color: '#0A66C2' },
                  { icon: SiX, label: 'X', color: '#111111' },
                ].map(({ icon: Icon, label, color }, index) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, x: 22 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.08, duration: 0.55, ease: 'easeOut' }}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-background/90 text-foreground"
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="max-w-[760px] pt-16 sm:pt-20 lg:pt-24">
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
                    className="h-10 w-10 rounded-full border-2 border-background object-cover sm:h-11 sm:w-11"
                  />
                ))}
              </motion.div>
              <h2 className="max-w-[780px] text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                {heroTypedLines.map((line, lineIndex) => (
                  <span
                    key={line}
                    className={`sonke-type-line ${lineIndex === heroTypedLines.length - 1 ? 'sonke-type-line-final' : ''}`}
                    style={
                      {
                        '--chars': line.length,
                        '--typing-delay': `${0.42 + lineIndex * 0.92}s`,
                        '--caret-delay': `${0.42 + lineIndex * 0.92}s`,
                        '--caret-end': `${1.24 + lineIndex * 0.92}s`,
                      } as CSSProperties
                    }
                  >
                    {line}
                  </span>
                ))}
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.65, ease: 'easeOut' }}
                className="mt-3 max-w-2xl text-sm leading-6 text-background/80 sm:text-base"
              >
                SONKE brings practical AI tools, document utilities, student helpers, and developer workspaces into one fast, friendly system.
              </motion.p>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { delayChildren: 1.02, staggerChildren: 0.07 } },
              }}
              className="grid gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-5"
            >
              {heroTools.map((tool, index) => {
                const Icon = tool!.icon
                return (
                  <motion.div
                    key={tool!.id}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: 'easeOut' } },
                    }}
                  >
                    <Link
                      href={tool!.href}
                      className="group grid h-[78px] grid-cols-[86px_1fr] items-center overflow-hidden rounded-md border border-background/35 bg-background/78 p-2 text-foreground backdrop-blur-xl transition hover:-translate-y-1 hover:bg-background"
                    >
                      <div className={`relative h-full overflow-hidden rounded-sm bg-gradient-to-r ${heroTileVisuals[index % heroTileVisuals.length]}`}>
                        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(90deg,rgba(255,255,255,.55)_0_16%,transparent_16%_30%,rgba(15,23,42,.22)_30%_43%,transparent_43%_56%,rgba(255,255,255,.35)_56%_70%,transparent_70%)]" />
                        <div
                          className={`absolute bottom-2 right-2 inline-flex h-8 w-8 items-center justify-center ${
                            tool!.iconColor ? 'bg-transparent' : 'rounded-sm border border-black/5 bg-background/90'
                          }`}
                          style={{ background: tool!.iconColor ? undefined : tool!.iconBg, color: tool!.iconColor }}
                        >
                          <Icon className={tool!.iconColor ? 'h-6 w-6' : 'h-4 w-4'} style={{ filter: tool!.id === 'tiktok-hook' ? 'drop-shadow(-1px 0 #00F2EA) drop-shadow(1px 0 #FF0050)' : undefined }} />
                        </div>
                      </div>
                      <div className="min-w-0 px-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold text-muted-foreground">({String(index + 1).padStart(2, '0')})</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                        </div>
                        <p className="mt-1.5 truncate text-base font-semibold text-foreground">{tool!.name}</p>
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
  const serviceCards = categories.map((category, index) => ({
    ...category,
    image: [imageBank.serviceA, imageBank.serviceB, imageBank.serviceC, imageBank.serviceD][index % 4],
  }))
  const previewTools = tools.slice(0, 6)

  return (
    <section id="services" className="bg-background px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-[1720px]">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.45fr] lg:items-stretch">
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
            className="overflow-hidden rounded-lg border border-border bg-white"
          >
            <div className="grid min-h-[520px] lg:grid-cols-[1fr_330px]">
              <div className="p-5 sm:p-8">
                <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-muted-foreground sm:min-w-[360px]">
                    <Search className="h-5 w-5" />
                    <span className="text-sm font-medium">Find a tool for the task in front of you</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Sparkles className="h-4 w-4" />
                    Curated workspaces
                  </div>
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

              <div className="border-t border-border bg-background p-5 sm:p-8 lg:border-l lg:border-t-0">
                <p className="text-sm font-semibold uppercase text-muted-foreground">Inside SONKE</p>
                <div className="mt-6 space-y-4">
                  {[
                    { value: `${tools.length}+`, label: 'live tools' },
                    { value: '8', label: 'focused categories' },
                    { value: 'Free', label: 'to start using' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-md border border-border bg-white p-5">
                      <p className="text-5xl font-semibold leading-none text-foreground">{stat.value}</p>
                      <p className="mt-3 text-sm font-medium text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 overflow-hidden rounded-md">
                  <img src={imageBank.aboutA} alt="A focused digital workspace" className="h-40 w-full object-cover" />
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

        <div className="mt-24">
          <div className="flex flex-col gap-8 border-b border-border pb-10 lg:flex-row lg:items-center">
            <h2 className="text-5xl font-semibold text-foreground sm:text-7xl">Our Expertise</h2>
            <div className="hidden h-24 w-px bg-border lg:block" />
            <SectionLabel>Tool systems</SectionLabel>
          </div>

          <div className="mt-16 grid border border-border bg-white lg:grid-cols-4">
            {serviceCards.slice(0, 8).map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: index * 0.04 }}
                  whileHover={{ y: -8 }}
                  className={`${index === 0 ? 'lg:col-span-2' : ''}`}
                >
                  <Link
                    href={`/tools?category=${category.id}`}
                    className="group block min-h-[430px] border-border p-7 transition hover:bg-background lg:border-r"
                  >
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-sm font-semibold uppercase">Service</span>
                      <span>({String(index + 1).padStart(2, '0')})</span>
                    </div>
                    {index === 0 && (
                      <div className="mt-7 h-56 overflow-hidden rounded-md">
                        <img src={category.image} alt={category.name} className="avoora-image-zoom h-full w-full object-cover" />
                      </div>
                    )}
                    <div className={index === 0 ? 'mt-8' : 'mt-40'}>
                  <Icon className="mb-5 h-8 w-8 text-primary transition group-hover:rotate-6 group-hover:scale-110" />
                      <h3 className="text-4xl font-semibold text-foreground">{category.name}</h3>
                      <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">{category.description}</p>
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
  const featured = trendingTools.slice(0, 4)
  const workspaceNotes = [
    { prompt: 'Make this sound more natural', output: 'Clearer tone, tighter phrasing, ready to paste.' },
    { prompt: 'Rewrite for a sharper angle', output: 'Three alternate versions with different emphasis.' },
    { prompt: 'Turn rough notes into an email', output: 'Polished subject, opener, body, and CTA.' },
    { prompt: 'Fix the messy draft', output: 'Grammar, flow, and readability cleaned up.' },
  ]

  return (
    <section id="featured" className="overflow-hidden bg-white px-5 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto max-w-[1720px]">
        <div className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-5xl">
            <SectionLabel>Featured tools</SectionLabel>
            <h2 className="mt-6 text-4xl font-semibold leading-tight text-foreground sm:text-6xl lg:text-7xl">
              Popular workspaces that feel ready before you open them.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Each tool is built around one job: add the context, get the output, copy it, and keep moving.
            </p>
            <Link href="/tools" className="mt-6 inline-flex items-center gap-3 rounded-sm bg-foreground px-6 py-3.5 text-base font-semibold text-background transition hover:bg-primary">
              View all tools <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {featured.map((tool, index) => {
            const Icon = tool.icon
            const note = workspaceNotes[index % workspaceNotes.length]
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <Link href={tool.href} className={`group block min-h-[520px] overflow-hidden rounded-lg border border-border ${index === 0 ? 'bg-foreground text-background' : 'bg-background text-foreground'} transition hover:border-primary/40 hover:shadow-[0_30px_80px_-55px_rgba(15,23,42,0.8)]`}>
                  <div className={`relative p-5 ${index === 0 ? 'border-background/15' : 'border-border'} border-b`}>
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={`inline-flex h-12 w-12 items-center justify-center ${tool.iconColor ? '' : 'rounded-sm border border-black/5 bg-white'}`}
                        style={{ background: tool.iconColor ? undefined : tool.iconBg, color: tool.iconColor }}
                      >
                        <Icon className={tool.iconColor ? 'h-8 w-8' : 'h-6 w-6'} />
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${index === 0 ? 'bg-background/10 text-background/70' : 'bg-white text-muted-foreground'}`}>
                        Workspace 0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-8 text-3xl font-semibold leading-tight">{tool.name}</h3>
                    <p className={`mt-3 min-h-[48px] text-sm leading-6 ${index === 0 ? 'text-background/68' : 'text-muted-foreground'}`}>{tool.description}</p>
                  </div>

                  <div className="p-5">
                    <div className={`rounded-md border p-4 ${index === 0 ? 'border-background/15 bg-background/8' : 'border-border bg-white'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className={`text-xs font-semibold uppercase ${index === 0 ? 'text-background/58' : 'text-muted-foreground'}`}>Input</span>
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <p className={`mt-4 text-base font-semibold leading-6 ${index === 0 ? 'text-background' : 'text-foreground'}`}>{note.prompt}</p>
                    </div>

                    <div className={`mt-3 rounded-md border p-4 ${index === 0 ? 'border-background/15 bg-background text-foreground' : 'border-border bg-white'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">Output</span>
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <p className="mt-4 text-sm leading-6 text-muted-foreground">{note.output}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {tool.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className={`rounded-full border px-3 py-1 text-xs font-semibold ${index === 0 ? 'border-background/20 text-background/70' : 'border-border bg-white text-muted-foreground'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={`mt-7 flex items-center justify-between border-t pt-5 text-sm font-semibold ${index === 0 ? 'border-background/15' : 'border-border'}`}>
                      <span>{tool.usageCount ? `${Math.round(tool.usageCount / 1000)}k uses` : 'Open workspace'}</span>
                      <span className="inline-flex items-center gap-2">
                        Open
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function StatsSection() {
  const steps = [
    {
      image: imageBank.processA,
      title: 'Choose a job',
      text: 'Start from writing, study, PDF, utility, business, or developer workflows.',
    },
    {
      image: imageBank.processB,
      title: 'Add context',
      text: 'Each tool asks for the details that matter for that exact output.',
    },
    {
      image: imageBank.processC,
      title: 'Generate or convert',
      text: 'Get polished copy, conversions, summaries, plans, and clean utility results.',
    },
    {
      image: imageBank.footer,
      title: 'Copy and move',
      text: 'Use the output immediately, refine it, or jump into the next tool.',
    },
  ]

  return (
    <section className="bg-background px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-[1720px]">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-5xl font-semibold text-foreground sm:text-7xl">How It Works</h2>
          <SectionLabel>Working process</SectionLabel>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group min-h-[520px] border border-border bg-white"
            >
              <div className="h-64 overflow-hidden">
                <img src={step.image} alt={step.title} className="avoora-image-zoom h-full w-full object-cover" />
              </div>
              <div className="p-8">
                <p className="text-xl font-semibold uppercase text-muted-foreground">(Step - {String(index + 1).padStart(2, '0')})</p>
                <h3 className="mt-28 text-3xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="bg-white px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-[1720px] border-t border-border pt-20">
        <div className="grid gap-10 lg:grid-cols-[0.55fr_1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -8 }}
            className="group overflow-hidden rounded-lg"
          >
            <img src={imageBank.footer} alt="Abstract digital workspace" className="avoora-image-zoom h-[320px] w-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="mb-4 flex items-center gap-2 text-lg text-muted-foreground">
              <Check className="h-5 w-5 text-primary" />
              No sign-up required
            </p>
            <h2 className="text-[4rem] font-semibold leading-none text-foreground sm:text-[7rem] lg:text-[10rem]">
              SONKE
            </h2>
            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-xl leading-8 text-muted-foreground">
                A home for everyday tools that feel specific, useful, and alive. Pick a tool and get the thing done.
              </p>
              <Link href="/tools">
                <Button className="rounded-sm bg-primary px-9 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90">
                  Launch tools
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
