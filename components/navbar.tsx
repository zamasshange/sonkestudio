"use client"

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import logoImage from '@/app/images/logo.png'

const navLinks = [
  { href: '/tools', label: 'All Tools' },
  { href: '/#services', label: 'Systems' },
  { href: '/#featured', label: 'Popular' },
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
            className="fixed inset-0 z-40 bg-background px-5 pb-8 pt-28 sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.nav
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.35 }}
              className="mx-auto grid max-w-[1200px] gap-4"
            >
              {[...navLinks, { href: '/tools', label: 'Launch tools' }].map((link, index) => (
                <Link
                  key={`${link.label}-${index}`}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between border border-border bg-white px-6 py-7 text-3xl font-semibold text-foreground transition hover:bg-foreground hover:text-background"
                >
                  {link.label}
                  <ArrowRight className="h-7 w-7 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
