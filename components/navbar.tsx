"use client"

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Compass, Flame, Grid2X2, Menu, Rocket, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import logoImage from '@/app/images/logo.png'
import faviconImage from '@/app/images/favicon.png'
import { categories, trendingTools } from '@/lib/tools-data'

const navLinks = [
  { href: '/tools', label: 'All Tools', description: 'Browse every workspace', icon: Grid2X2 },
  { href: '/#services', label: 'Systems', description: 'Pick a tool category', icon: Compass },
  { href: '/#featured', label: 'Popular', description: 'Start with top tools', icon: Flame },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={`mx-auto flex max-w-[1820px] items-center justify-between px-5 py-6 transition sm:px-8 ${scrolled ? 'py-4' : ''}`}>
          <Link href="/" className="group inline-flex items-center gap-3" aria-label="SONKE home">
            <span className="relative inline-flex h-14 w-40 items-center overflow-hidden">
              <Image src={logoImage} alt="SONKE logo" className="h-full w-full object-contain object-left" priority />
            </span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-semibold uppercase text-muted-foreground transition hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-sm text-foreground transition hover:bg-muted"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 overflow-y-auto bg-background px-5 pb-8 pt-28 sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.35 }}
              className="mx-auto grid max-w-[1320px] gap-4 lg:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="border border-border bg-white p-5 sm:p-7">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                  <span className="flex h-16 w-16 items-center justify-center border border-border bg-background">
                    <Image src={faviconImage} alt="SONKE favicon" className="h-10 w-10 object-contain" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase text-muted-foreground">SONKE menu</p>
                    <p className="mt-1 text-2xl font-semibold leading-none text-foreground">Jump straight in.</p>
                  </div>
                </div>

                <nav className="mt-5 grid gap-3">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={`${link.label}-${index}`}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group grid grid-cols-[48px_1fr_auto] items-center gap-4 border border-border bg-background p-4 transition hover:border-primary/50 hover:bg-foreground hover:text-background"
                      >
                        <span className="flex h-12 w-12 items-center justify-center border border-border bg-white text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span>
                          <span className="block text-xl font-semibold">{link.label}</span>
                          <span className="mt-1 block text-sm text-muted-foreground transition group-hover:text-background/65">{link.description}</span>
                        </span>
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                      </Link>
                    )
                  })}
                </nav>

                <Link
                  href="/tools"
                  onClick={() => setIsOpen(false)}
                  className="mt-5 flex items-center justify-between bg-primary px-5 py-4 text-base font-semibold text-primary-foreground transition hover:bg-foreground"
                >
                  <span className="inline-flex items-center gap-3">
                    <Rocket className="h-5 w-5" />
                    Launch tools
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="border border-border bg-foreground p-5 text-background sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold uppercase text-background/55">Trending now</p>
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="mt-5 grid gap-3">
                    {trendingTools.slice(0, 4).map((tool, index) => {
                      const Icon = tool.icon
                      return (
                        <Link
                          key={tool.id}
                          href={tool.href}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center justify-between gap-3 border border-background/15 p-4 transition hover:border-primary/70 hover:bg-background/5"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="text-xs font-semibold text-background/45">0{index + 1}</span>
                            <Icon className="h-5 w-5 shrink-0 text-primary" style={{ color: tool.iconColor }} />
                            <span className="truncate text-base font-semibold">{tool.name}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 text-background/45 transition group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div className="border border-border bg-white p-5 sm:p-7">
                  <p className="text-sm font-semibold uppercase text-muted-foreground">Systems</p>
                  <div className="mt-5 grid gap-2">
                    {categories.slice(0, 6).map((category) => {
                      const Icon = category.icon
                      return (
                        <Link
                          key={category.id}
                          href={`/tools?category=${category.id}`}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-center justify-between gap-3 border border-border bg-background px-4 py-3 transition hover:border-primary/50 hover:bg-white"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <Icon className="h-4 w-4 shrink-0 text-primary" />
                            <span className="truncate text-sm font-semibold text-foreground">{category.name}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
