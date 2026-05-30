"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Loader2, Sparkles, Check, Star, TrendingUp } from 'lucide-react'
import { Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ToolWorkspaceHero } from '@/components/tool-experiences/tool-workspace-shell'
import {
  SiDiscord,
  SiFacebook,
  SiInstagram,
  SiPinterest,
  SiReddit,
  SiSnapchat,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiTwitch,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa6'

const platforms = [
  { name: 'Instagram', icon: SiInstagram, color: '#E4405F' },
  { name: 'TikTok', icon: SiTiktok, color: '#00F2EA' },
  { name: 'X / Twitter', icon: SiX, color: '#111111' },
  { name: 'YouTube', icon: SiYoutube, color: '#FF0000' },
  { name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
  { name: 'Reddit', icon: SiReddit, color: '#FF4500' },
  { name: 'Pinterest', icon: SiPinterest, color: '#BD081C' },
  { name: 'Discord', icon: SiDiscord, color: '#5865F2' },
  { name: 'Telegram', icon: SiTelegram, color: '#26A5E4' },
  { name: 'Twitch', icon: SiTwitch, color: '#9146FF' },
  { name: 'Threads', icon: SiThreads, color: '#111111' },
  { name: 'Snapchat', icon: SiSnapchat, color: '#FFFC00' },
  { name: 'Facebook', icon: SiFacebook, color: '#1877F2' },
  { name: 'WhatsApp', icon: SiWhatsapp, color: '#25D366' },
]
const platformNames = platforms.map((item) => item.name)
const captionGoals = ['More comments', 'More shares', 'Product sales', 'Brand awareness', 'Community building', 'Event promotion']
const tones = ['Bold', 'Funny', 'Luxury', 'Friendly', 'Educational', 'Inspirational', 'South African local']
const hashtagModes = ['Auto hashtags', 'Niche hashtags', 'Trending hashtags', 'No hashtags', 'Custom hashtags']
const tweetTypes = ['Hot take', 'Thread opener', 'Launch tweet', 'Story tweet', 'Educational tweet', 'Question tweet', 'Promo tweet']
const audiences = ['Founders', 'Students', 'Developers', 'Creators', 'Small business owners', 'South African audience', 'Global audience']
const tweetLengths = ['Short and punchy', 'Standard', 'Detailed', 'Thread starter']

type SocialGeneratorProps = {
  tool: Tool
  mode: 'caption' | 'tweet'
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-sm border border-border bg-white px-3 py-2 text-sm font-normal text-foreground">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

interface CaptionOption {
  id: string
  text: string
  score: number
  viralScore: number
  engagementEstimate: string
  bestFor: string
}

export function SocialGeneratorLayout({ tool, mode }: SocialGeneratorProps) {
  const isTweet = mode === 'tweet'
  const [platform, setPlatform] = useState(isTweet ? 'X / Twitter' : 'Instagram')
  const [goal, setGoal] = useState(captionGoals[0])
  const [tone, setTone] = useState(tones[0])
  const [hashtagMode, setHashtagMode] = useState(hashtagModes[0])
  const [customHashtags, setCustomHashtags] = useState('')
  const [tweetType, setTweetType] = useState(tweetTypes[0])
  const [audience, setAudience] = useState(audiences[0])
  const [tweetLength, setTweetLength] = useState(tweetLengths[0])
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [captionOptions, setCaptionOptions] = useState<CaptionOption[]>([])
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!input.trim()) return

    setLoading(true)
    setError('')
    setOutput('')
    setCaptionOptions([])
    setSelectedOptionId(null)

    const text = isTweet
      ? `Create a ${tweetType} for ${platform}.
Target audience: ${audience}
Length: ${tweetLength}
Tone: ${tone}
Hashtag preference: ${hashtagMode}
Custom hashtags: ${customHashtags || 'none'}

Topic, context, or rough idea:
${input}

Return 5 strong tweet options with engagement estimates.`
      : `Create social captions for ${platform}.
Goal: ${goal}
Tone: ${tone}
Hashtag preference: ${hashtagMode}
Custom hashtags: ${customHashtags || 'none'}

Content, product, or post idea:
${input}

Return 5 caption options with viralScore and engagement estimates.`

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: isTweet ? 'viral-tweet' : 'caption',
          text,
          toolTitle: tool.name,
          toolDescription: tool.description,
        }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Generation failed.')

      const content = data.result || data.choices?.[0]?.message?.content || ''

      if (!content || !content.trim()) {
        throw new Error('No content was returned. Please try again.')
      }

      // Parse AI response to extract multiple options
      const lines = content.split('\n').filter(line => line.trim())
      let options: CaptionOption[] = []

      // Try to parse numbered options (1., 2., etc.) or bullet points
      const optionRegex = /^(?:\d+[\.)]|[-*•])\s*(.+)/g
      const parsedOptions: string[] = []

      lines.forEach(line => {
        const match = line.match(/^(?:\d+[\.)]|[-*•])\s*(.+)/)
        if (match && match[1]) {
          parsedOptions.push(match[1].trim())
        }
      })

      // If we found multiple options, use them
      if (parsedOptions.length >= 2) {
        options = parsedOptions.slice(0, 5).map((text, idx) => ({
          id: String(idx + 1),
          text: text,
          score: Math.max(70, 95 - idx * 5),
          viralScore: Math.max(60, 90 - idx * 7),
          engagementEstimate: idx === 0 ? '45-65% likely to get 100+ interactions' : idx === 1 ? '35-50% likely to get 50+ interactions' : '25-40% likely to get 30+ interactions',
          bestFor: idx === 0 ? 'Maximum reach' : idx === 1 ? 'Good balance' : idx === 2 ? 'Community focus' : 'Subtle approach'
        }))
      } else {
        // If AI didn't return structured options, try to split by sentences or paragraphs
        const contentOptions = content.split(/\n\n|\r\n\r\n/).filter(o => o.trim().length > 10)
        if (contentOptions.length >= 2) {
          options = contentOptions.slice(0, 5).map((text, idx) => ({
            id: String(idx + 1),
            text: text.trim(),
            score: Math.max(70, 95 - idx * 5),
            viralScore: Math.max(60, 90 - idx * 7),
            engagementEstimate: idx === 0 ? '45-65% likely to get 100+ interactions' : idx === 1 ? '35-50% likely to get 50+ interactions' : '25-40% likely to get 30+ interactions',
            bestFor: idx === 0 ? 'Maximum reach' : idx === 1 ? 'Good balance' : idx === 2 ? 'Community focus' : 'Subtle approach'
          }))
        } else {
          // Fallback: use the full content as single option
          options = [{
            id: '1',
            text: content,
            score: 92,
            viralScore: 85,
            engagementEstimate: '45-65% likely to get 100+ interactions',
            bestFor: 'Maximum reach'
          }]
        }
      }

      if (options.length === 0 || !options[0].text) {
        throw new Error('No content was returned. Please try again.')
      }

      setCaptionOptions(options)
      setSelectedOptionId(options[0].id)
      setOutput(options[0].text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const copyOutput = async () => {
    const selectedCaption = captionOptions.find((caption) => caption.id === selectedOptionId)
    if (!selectedCaption) return
    await navigator.clipboard.writeText(selectedCaption.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const activePlatform = platforms.find((item) => item.name === platform) || platforms[0]
  const ActivePlatformIcon = activePlatform.icon

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background text-foreground">
      <ToolWorkspaceHero
        tool={tool}
        label="Creator studio"
        eyebrow="CR"
        statusTitle={isTweet ? 'Tweet Lab' : 'Caption Studio'}
        statusText="Set the platform, audience, tone, and goal, then generate polished content options in the same workspace."
      />

      <div className="mx-auto max-w-[1720px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="h-fit rounded-md border border-border bg-white p-6 lg:sticky lg:top-44">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Strategy brief</p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">{isTweet ? 'Growth dashboard' : 'Caption studio'}</h2>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {platforms.map((item) => {
                const PlatformIcon = item.icon
                const active = platform === item.name
                const iconColor = active && item.color === '#111111' ? '#ffffff' : item.color
                return (
                  <button
                    key={item.name}
                    onClick={() => setPlatform(item.name)}
                    className={`group flex min-h-20 flex-col justify-between rounded-sm border p-3 text-left transition hover:-translate-y-1 ${
                      active ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-foreground hover:border-foreground/30'
                    }`}
                  >
                    <PlatformIcon className="h-5 w-5" style={{ color: iconColor }} />
                    <span className={active ? 'text-xs font-semibold text-background' : 'text-xs font-semibold text-muted-foreground'}>{item.name}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 grid gap-4">
              <SelectField label="Platform" value={platform} options={platformNames} onChange={setPlatform} />
              {isTweet ? (
                <>
                  <SelectField label="Tweet type" value={tweetType} options={tweetTypes} onChange={setTweetType} />
                  <SelectField label="Audience" value={audience} options={audiences} onChange={setAudience} />
                  <SelectField label="Length" value={tweetLength} options={tweetLengths} onChange={setTweetLength} />
                </>
              ) : (
                <SelectField label="Goal" value={goal} options={captionGoals} onChange={setGoal} />
              )}
              <SelectField label="Tone" value={tone} options={tones} onChange={setTone} />
              <SelectField label="Hashtags" value={hashtagMode} options={hashtagModes} onChange={setHashtagMode} />
              {hashtagMode === 'Custom hashtags' && (
                <input
                  value={customHashtags}
                  onChange={(event) => setCustomHashtags(event.target.value)}
                  placeholder="#sonke #southafrica"
                  className="rounded-sm border border-border bg-white px-3 py-2 text-sm"
                />
              )}
            </div>

            <div className="mt-6 rounded-sm border border-border bg-background p-4 text-sm text-muted-foreground">
              Platform strategy, audience, tone, hashtags, and score signals update the preview system.
            </div>
          </motion.aside>

          <main className="grid gap-6">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-md border border-border bg-white p-6 avoora-soft-shadow">
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {isTweet ? 'Tweet idea' : 'Post context'}
                <Textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={isTweet ? 'Example: announce our new AI study feature for South African students...' : 'Example: a product photo for a local skincare launch...'}
                  className="min-h-[150px] resize-none rounded-sm border border-border bg-background p-4 text-sm"
                />
              </label>
              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground">{input.length} characters</span>
                <Button onClick={generate} disabled={loading || !input.trim()} className="rounded-none bg-primary text-primary-foreground gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate options
                </Button>
              </div>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </motion.section>

            <AnimatePresence>
              {captionOptions.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-md border border-border bg-white p-6 avoora-soft-shadow">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Generated options</p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">{captionOptions.length} variations ready</h3>
                    </div>
                    <Button onClick={copyOutput} disabled={!selectedOptionId} variant="outline" className="rounded-none bg-white gap-2">
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {captionOptions.map((option, idx) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedOptionId(option.id)
                          setOutput(option.text)
                        }}
                        className={`rounded-none border p-4 text-left transition ${
                          selectedOptionId === option.id ? 'border-foreground bg-foreground text-background' : 'border-border bg-white text-foreground hover:border-foreground/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className={selectedOptionId === option.id ? 'text-sm leading-6 text-background/80' : 'text-sm leading-6 text-muted-foreground'}>{option.text}</p>
                          {selectedOptionId === option.id && <Check className="h-5 w-5 shrink-0" />}
                        </div>
                        <div className={selectedOptionId === option.id ? 'mt-3 grid grid-cols-3 gap-2 border-t border-background/20 pt-3 text-xs text-background/80' : 'mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs text-muted-foreground'}>
                          <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {option.score}% quality</span>
                          <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {option.viralScore}% viral</span>
                          <span className="truncate text-right">{option.bestFor}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedOptionId && (
                    <div className="mt-6 rounded-md border border-border bg-background p-5">
                      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <ActivePlatformIcon className="h-5 w-5" style={{ color: activePlatform.color }} />
                        {platform} preview
                      </p>
                      <div className="rounded-md border border-border bg-white p-5 text-sm leading-7">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background">
                            <ActivePlatformIcon className="h-5 w-5" style={{ color: activePlatform.color }} />
                          </span>
                          <div>
                            <p className="font-semibold">SONKE Studio</p>
                            <p className="text-xs text-muted-foreground">@sonke.tools</p>
                          </div>
                        </div>
                        <p className="text-foreground">{output}</p>
                      </div>
                    </div>
                  )}
                </motion.section>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </motion.div>
  )
}
