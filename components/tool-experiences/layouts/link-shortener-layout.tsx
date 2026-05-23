'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, ExternalLink, Link2, Loader2 } from 'lucide-react'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'

export function LinkShortenerLayout({ tool }: { tool: Tool }) {
  const [url, setUrl] = useState('')
  const [shortLink, setShortLink] = useState('')
  const [longUrl, setLongUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const shorten = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setShortLink('')
    setLongUrl('')

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not shorten link')
      setShortLink(data.link)
      setLongUrl(data.longUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!shortLink) return
    await navigator.clipboard.writeText(shortLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Link shortener"
        eyebrow="everyday"
        statusTitle="Powered by Bitly"
        statusText="Paste any long URL and get a short link you can copy or open instantly."
      />

      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <div className="rounded-md border border-border bg-white p-6 sm:p-8">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Long URL</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/very/long/path..."
              className="h-12 rounded-sm"
              onKeyDown={(event) => event.key === 'Enter' && shorten()}
            />
            <Button
              type="button"
              onClick={shorten}
              disabled={loading || !url.trim()}
              className="h-12 shrink-0 bg-primary px-6 text-primary-foreground hover:bg-foreground"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              Shorten
            </Button>
          </div>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          {shortLink && (
            <div className="mt-8 rounded-md border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Short link</p>
              <p className="mt-2 break-all text-lg font-semibold text-foreground">{shortLink}</p>
              {longUrl && (
                <p className="mt-2 break-all text-xs text-muted-foreground">Original: {longUrl}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="outline" className="rounded-sm" onClick={copy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button type="button" variant="outline" className="rounded-sm" asChild>
                  <a href={shortLink} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
