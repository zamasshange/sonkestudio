"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary">
            <Sparkles className="w-4 h-4" />
            Your new favorite tool suite is here
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance"
        >
          <span className="text-foreground">File tools that</span>
          <br />
          <span className="text-gradient">actually slap</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty"
        >
          Convert PDFs, compress images, generate QR codes, and more. All free, all fast, all
          without the sketchy vibes. Your files never leave your browser. Period.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/tools">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 glow-primary text-lg px-8 py-6 group transition-all duration-300"
            >
              Start Creating
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              See Features
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '100%', label: 'Free' },
            { value: '0', label: 'Data stored' },
            { value: 'Instant', label: 'Processing' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'All processing happens right in your browser. No uploads, no waiting, no cap.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description:
        "Your files never touch our servers. What happens in your browser stays there. We're not weird like that.",
    },
    {
      icon: Clock,
      title: 'Always Free',
      description:
        "No hidden fees, no premium tiers, no 'sign up to continue'. Just vibes and utility.",
    },
  ]

  return (
    <section id="features" className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Why SONKE hits different
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We built the tools we wished existed. Simple, fast, and actually respectful of your
            privacy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass rounded-2xl p-8 hover:bg-card/80 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:glow-primary transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ToolsPreviewSection() {
  const tools = [
    {
      category: 'PDF Magic',
      items: ['Merge PDFs', 'Split PDFs', 'Compress PDFs', 'PDF to Image'],
      color: 'primary',
      href: '/tools/pdf',
    },
    {
      category: 'Image Wizardry',
      items: ['Compress Images', 'Resize Images', 'Convert Formats', 'Bulk Processing'],
      color: 'accent',
      href: '/tools/image',
    },
    {
      category: 'QR Generation',
      items: ['URL QR Codes', 'Text QR Codes', 'Custom Colors', 'Download PNG/SVG'],
      color: 'primary',
      href: '/tools/qr',
    },
  ]

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Tools for every situation
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you&apos;re prepping for class, fixing work docs, or just need to send
            something quick - we got you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={tool.href}>
                <div className="glass rounded-2xl p-8 h-full hover:bg-card/80 transition-all duration-300 group cursor-pointer">
                  <h3 className="text-xl font-semibold mb-4 text-gradient">{tool.category}</h3>
                  <ul className="space-y-3">
                    {tool.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all">
                    Explore tools
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="relative py-24 px-6">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              No sign-up required. No credit card. No BS. Just pick a tool and start creating.
            </p>
            <Link href="/tools">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 glow-primary text-lg px-10 py-6 group"
              >
                Launch Tools
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
