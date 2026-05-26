'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, ExternalLink, Newspaper, Clock } from 'lucide-react'
import Link from 'next/link'

interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string | null
  publishedAt: string
  source: { name: string }
}

interface NewsFeedProps {
  category?: 'business' | 'technology' | 'science' | 'health' | 'entertainment' | 'general'
  country?: string
  query?: string
  pageSize?: number
}

export function NewsFeed({
  category = 'technology',
  country = 'za',
  query,
  pageSize = 6,
}: NewsFeedProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchNews() {
      try {
        const params = new URLSearchParams({
          pageSize: String(pageSize),
        })

        if (query) {
          params.append('q', query)
        } else {
          params.append('category', category)
          if (country) params.append('country', country.toLowerCase())
        }

        const res = await fetch(`/api/news?${params.toString()}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch news')
        }

        setArticles(data.articles || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'News load failed')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [category, country, query, pageSize])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-6 text-center text-sm text-muted-foreground">
        <Newspaper className="mx-auto mb-2 h-5 w-5" />
        {error}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-6 text-center text-sm text-muted-foreground">
        No news articles found.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {articles.map((article, index) => (
          <motion.a
            key={article.url}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_12px_40px_-24px_rgba(15,23,42,0.2)]"
          >
            {article.urlToImage ? (
              <div className="h-36 overflow-hidden bg-muted">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            ) : (
              <div className="flex h-36 items-center justify-center bg-muted">
                <Newspaper className="h-8 w-8 text-muted-foreground/40" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
                  {article.source.name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">
                {article.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                {article.description}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-medium text-primary">
                Read article
                <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </motion.a>
        ))}
      </AnimatePresence>
    </div>
  )
}
