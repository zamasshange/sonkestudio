'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, Copy, Check, X, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UnsplashResult {
  id: string
  url: string
  thumb: string
  title: string
  author: string
  authorUrl: string
  width: number
  height: number
}

interface UnsplashSearchProps {
  onSelect?: (image: UnsplashResult) => void
  accessKey?: string
}

const DEFAULT_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || ''

export function UnsplashSearch({ onSelect, accessKey = DEFAULT_ACCESS_KEY }: UnsplashSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UnsplashResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const search = useCallback(async () => {
    if (!query.trim()) return
    if (!accessKey) {
      setError('Unsplash access key not configured')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&client_id=${accessKey}`
      )
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.errors?.[0] || 'Search failed')
      }

      const images: UnsplashResult[] = data.results.map((img: any) => ({
        id: img.id,
        url: img.urls.regular,
        thumb: img.urls.small,
        title: img.description || img.alt_description || 'Unsplash image',
        author: img.user.name,
        authorUrl: img.user.links.html,
        width: img.width,
        height: img.height,
      }))

      setResults(images)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search images')
    } finally {
      setLoading(false)
    }
  }, [query, accessKey])

  const copyUrl = async (image: UnsplashResult) => {
    await navigator.clipboard.writeText(image.url)
    setCopiedId(image.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const curated = useCallback(async () => {
    if (!accessKey) {
      setError('Unsplash access key not configured')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos?per_page=12&order_by=popular&client_id=${accessKey}`
      )
      const data = await res.json()
      const images: UnsplashResult[] = data.map((img: any) => ({
        id: img.id,
        url: img.urls.regular,
        thumb: img.urls.small,
        title: img.description || img.alt_description || 'Unsplash image',
        author: img.user.name,
        authorUrl: img.user.links.html,
        width: img.width,
        height: img.height,
      }))
      setResults(images)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load curated')
    } finally {
      setLoading(false)
    }
  }, [accessKey])

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="Search free high-res images..."
            className="pl-9"
          />
        </div>
        <Button onClick={search} disabled={loading} className="bg-foreground text-background">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
        <Button onClick={curated} disabled={loading} variant="outline">
          Curated
        </Button>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
          >
            {results.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative overflow-hidden rounded-lg border border-border bg-muted"
              >
                <img
                  src={image.thumb}
                  alt={image.title}
                  className="h-32 w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                  <p className="text-xs text-white/80 truncate">{image.author}</p>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => copyUrl(image)}
                      className="h-8 bg-white/90 text-foreground hover:bg-white"
                    >
                      {copiedId === image.id ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center justify-center rounded-md bg-white/90 px-3 text-xs font-medium text-foreground hover:bg-white"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      View
                    </a>
                    {onSelect && (
                      <Button
                        size="sm"
                        onClick={() => onSelect(image)}
                        className="h-8 bg-primary text-primary-foreground"
                      >
                        Use
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
