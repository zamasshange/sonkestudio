"use client"

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUp, Check, Sparkles, Zap } from 'lucide-react'
import { SiInstagram, SiX } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'
import { categories, tools, trendingTools } from '@/lib/tools-data'
import logoImage from '@/app/images/logo.png'

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
      { href: '/tools', label: 'All Tools' },
      { href: '/#services', label: 'Systems' },
      { href: '/#featured', label: 'Featured' },
      { href: '/', label: 'Back Home' },
    ],
  },
]

const footerImages = [
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=500&q=85',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=500&q=85',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=85',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=500&q=85',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&q=85',
]

export function Footer() {
  const toolCount = tools.length
  const trending = trendingTools.slice(0, 5)

  return (
    <footer className="border-t border-border bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-[1720px]">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="flex items-center gap-3 text-sm font-semibold uppercase text-muted-foreground">
              <span className="h-2.5 w-2.5 bg-primary" />
              Let's build faster
            </p>
            <h2 className="mt-6 text-5xl font-semibold leading-none text-foreground sm:text-7xl lg:text-8xl">
              Pick a tool and get it done.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-5 gap-2 overflow-hidden rounded-md"
          >
            {footerImages.map((image, index) => (
              <motion.img
                key={image}
                src={image}
                alt=""
                animate={{ y: index % 2 ? [28, 8, 28] : [0, 18, 0] }}
                transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
                className="h-44 w-full object-cover"
              />
            ))}
          </motion.div>
        </div>

        <div className="mt-16 grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr]">
          {footerColumns.map((column, index) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="min-h-[210px] rounded-md border border-border bg-background p-6 transition hover:bg-white"
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
          className="mt-16 overflow-hidden rounded-md border border-border bg-foreground text-background"
        >
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative p-7 sm:p-10">
              <div className="absolute right-6 top-6 text-[7rem] font-semibold leading-none text-background/5 sm:text-[10rem]">
                {toolCount}
              </div>
              <div className="relative z-10">
                <div className="relative h-16 w-48 rounded-sm bg-white p-3 sm:h-20 sm:w-64">
                  <Image src={logoImage} alt="SONKE logo" className="h-full w-full object-contain object-left" />
                </div>
                <p className="mt-8 max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">
                  A compact workbench for writing, study, PDF, creator, business, and dev work.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {[
                    'Free to start',
                    `${toolCount}+ live tools`,
                    'No tab-hopping',
                  ].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2 rounded-sm border border-background/15 px-3 py-2 text-sm text-background/80">
                      <Check className="h-4 w-4 text-primary" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-background/15 p-7 sm:p-10 lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase text-background/60">Trending now</p>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-6 grid gap-3">
                {trending.map((tool, index) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="group flex items-center justify-between gap-4 rounded-sm border border-background/15 p-4 transition hover:border-primary/70 hover:bg-background/5"
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
              <Link href="/tools" className="mt-6 inline-flex items-center gap-3 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                Browse all tools
                <Zap className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-base text-muted-foreground">Copyright - SONKE | Built for modern creators, students, teams, and builders.</p>
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
