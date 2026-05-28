'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, MapPin, Sparkles, TrendingUp, Clock, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from '@/hooks/use-location'
import { getSmartRecommendations } from '@/lib/smart-recommendations'
import { useSavedHistory } from '@/hooks/use-saved-history'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { tools } from '@/lib/tools-data'

const sectionIcons: Record<string, React.ReactNode> = {
  'exam-season': <Zap className="h-4 w-4" />,
  'holiday-mode': <Sparkles className="h-4 w-4" />,
  'back-to-school': <Sparkles className="h-4 w-4" />,
  'near-you': <MapPin className="h-4 w-4" />,
  'for-you': <Sparkles className="h-4 w-4" />,
  recent: <Clock className="h-4 w-4" />,
  trending: <TrendingUp className="h-4 w-4" />,
  discover: <Sparkles className="h-4 w-4" />,
  'sa-student': <MapPin className="h-4 w-4" />,
  'sa-creator': <MapPin className="h-4 w-4" />,
  'sa-business': <MapPin className="h-4 w-4" />,
}

export function SmartRecommendations() {
  const { location, season, loading } = useLocation()
  const { recentTools } = useSavedHistory()
  const { prefs, persona } = useUserPreferences()
  const [liveRecommendations, setLiveRecommendations] = useState<ReturnType<typeof getSmartRecommendations> | null>(null)
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null)

  if (loading) {
    return (
      <section className="bg-background px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-[1720px]">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Use persona label as role for recommendations (e.g., 'Student', 'Creator')
  const userRole = persona?.label?.toLowerCase() || prefs?.persona

  const fallbackRecommendations = getSmartRecommendations(
    location,
    season || { season: 'summer', isExamSeason: false, isHolidaySeason: false, isBackToSchool: false, month: 1, hemisphere: 'northern' },
    userRole,
    recentTools,
  )

  const toolMap = useMemo(() => new Map(tools.map((tool) => [tool.id, tool])), [])

  useEffect(() => {
    if (loading) return
    let active = true
    const loadRecommendations = async () => {
      const params = new URLSearchParams({
        country: location?.country || '',
        city: location?.city || '',
        role: userRole || '',
        recent: recentTools.join(','),
        exam: String(Boolean(season?.isExamSeason)),
        holiday: String(Boolean(season?.isHolidaySeason)),
        backToSchool: String(Boolean(season?.isBackToSchool)),
        seed: String(Math.floor(Date.now() / 300000)),
      })
      try {
        const response = await fetch(`/api/tools/recommendations?${params}`, { cache: 'no-store' })
        const data = await response.json()
        if (!active || !Array.isArray(data.sections)) return
        const sections = data.sections.map((section: any) => ({
          id: section.id,
          title: section.title,
          subtitle: section.subtitle,
          badge: section.badge,
          priority: section.priority || 0,
          tools: (section.tools || []).map((id: string) => toolMap.get(id)).filter(Boolean),
        })).filter((section: any) => section.tools.length)
        if (sections.length) {
          setLiveRecommendations(sections)
          setRefreshedAt(data.refreshedAt || null)
        }
      } catch {
        setLiveRecommendations(null)
      }
    }

    loadRecommendations()
    const timer = window.setInterval(loadRecommendations, 180000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [loading, location?.country, location?.city, recentTools, season?.isBackToSchool, season?.isExamSeason, season?.isHolidaySeason, toolMap, userRole])

  const recommendations = liveRecommendations || fallbackRecommendations
  const topRecs = recommendations.slice(0, 3)

  return (
    <section className="bg-background px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-[1720px]">
        {topRecs.map((rec, sectionIndex) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: sectionIndex * 0.08 }}
            className={sectionIndex > 0 ? 'mt-14' : ''}
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                {sectionIcons[rec.id] || <Sparkles className="h-4 w-4" />}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{rec.title}</h3>
                <p className="text-sm text-muted-foreground">{rec.subtitle}</p>
              </div>
              {rec.badge && (
                <span className="ml-auto inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {rec.badge}
                </span>
              )}
            </div>
            {refreshedAt && sectionIndex === 0 ? (
              <p className="-mt-3 mb-5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Live SONKE pulse / refreshed {new Date(refreshedAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rec.tools.slice(0, 6).map((tool, index) => {
                const Icon = tool.icon
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.04 }}
                  >
                    <Link
                      href={tool.href}
                      className="group flex items-start gap-4 rounded-lg border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_40px_-24px_rgba(15,23,42,0.25)]"
                    >
                      <span
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
                        style={{
                          background: tool.iconBg || '#f5f5f5',
                          color: tool.iconColor || '#1a1a1a',
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-foreground">{tool.name}</span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                        </span>
                        <span className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.description}</span>
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
