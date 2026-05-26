'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, Copy, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface GifResult {
  id: string
  url: string
  title: string
  width: number
  height: number
}

interface GiphySearchProps {
  onSelect?: (gif: GifResult) => void
  apiKey?: string
}

const DEFAULT_API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY || ''

export function GiphySearch({ onSelect, apiKey = DEFAULT_API_KEY }: GiphySearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GifResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const search = useCallback(async () => {
    if (!query.trim()) return
    if (!apiKey) {
      setError('Giphy API key not configured')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=12&rating=g`
      )
      const data = await res.json()

      if (data.meta?.status !== 200) {
        throw new Error(data.meta?.msg || 'Search failed')
      }

      const gifs: GifResult[] = data.data.map((g: any) => ({
        id: g.id,
        url: g.images.fixed_width_downsampled?.url || g.images.fixed_width?.url,
        title: g.title,
        width: g.images.fixed_width_downsampled?.width || g.images.fixed_width?.width,
        height: g.images.fixed_width_downsampled?.height || g.images.fixed_width?.height,
      }))

      setResults(gifs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search GIFs')
    } finally {
      setLoading(false)
    }
  }, [query, apiKey])

  const copyUrl = async (gif: GifResult) => {
    await navigator.clipboard.writeText(gif.url)
    setCopiedId(gif.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const trending = useCallback(async () => {
    if (!apiKey) {
      setError('Giphy API key not configured')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=12&rating=g`
      )
      const data = await res.json()
      const gifs: GifResult[] = data.data.map((g: any) => ({
        id: g.id,
        url: g.images.fixed_width_downsampled?.url || g.images.fixed_width?.url,
        title: g.title,
        width: g.images.fixed_width_downsampled?.width || g.images.fixed_width?.width,
        height: g.images.fixed_width_downsampled?.height || g.images.fixed_width?.height,
      }))
      setResults(gifs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trending')
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="Search GIFs..."
            className="pl-9"
          />
        </div>
        <Button onClick={search} disabled={loading} className="bg-foreground text-background">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
        <Button onClick={trending} disabled={loading} variant="outline">
          Trending
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
            {results.map((gif) => (
              <motion.div
                key={gif.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative overflow-hidden rounded-lg border border-border bg-muted"
              >
                <img
                  src={gif.url}
                  alt={gif.title}
                  className="h-32 w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                  <Button
                    size="sm"
                    onClick={() => copyUrl(gif)}
                    className="h-8 bg-white/90 text-foreground hover:bg-white"
                  >
                    {copiedId === gif.id ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  {onSelect && (
                    <Button
                      size="sm"
                      onClick={() => onSelect(gif)}
                      className="h-8 bg-primary text-primary-foreground"
                    >
                      Use
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
