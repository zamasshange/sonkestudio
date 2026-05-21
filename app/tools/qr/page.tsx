"use client"

import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { QrCode, Link2, Type, Download, ArrowLeft, Copy, Check, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import Link from 'next/link'
import QRCode from 'qrcode'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const presetColors = [
  { name: 'Classic', dark: '#000000', light: '#ffffff' },
  { name: 'Purple', dark: '#7c3aed', light: '#f5f3ff' },
  { name: 'Blue', dark: '#2563eb', light: '#eff6ff' },
  { name: 'Green', dark: '#059669', light: '#ecfdf5' },
  { name: 'Red', dark: '#dc2626', light: '#fef2f2' },
  { name: 'Orange', dark: '#ea580c', light: '#fff7ed' },
]

export default function QRToolsPage() {
  const [activeTab, setActiveTab] = useState('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [qrSvg, setQrSvg] = useState('')
  const [copied, setCopied] = useState(false)
  
  // Customization
  const [size, setSize] = useState([256])
  const [margin, setMargin] = useState([2])
  const [darkColor, setDarkColor] = useState('#7c3aed')
  const [lightColor, setLightColor] = useState('#ffffff')
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M')

  const content = activeTab === 'url' ? url : text

  const generateQR = useCallback(async () => {
    if (!content.trim()) {
      setQrDataUrl('')
      setQrSvg('')
      return
    }

    try {
      // Generate PNG
      const pngDataUrl = await QRCode.toDataURL(content, {
        width: size[0],
        margin: margin[0],
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: errorCorrection,
      })
      setQrDataUrl(pngDataUrl)

      // Generate SVG
      const svgString = await QRCode.toString(content, {
        type: 'svg',
        margin: margin[0],
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: errorCorrection,
      })
      setQrSvg(svgString)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }, [content, size, margin, darkColor, lightColor, errorCorrection])

  useEffect(() => {
    const debounce = setTimeout(() => {
      generateQR()
    }, 300)
    return () => clearTimeout(debounce)
  }, [generateQR])

  const downloadPNG = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = qrDataUrl
    link.click()
  }

  const downloadSVG = () => {
    if (!qrSvg) return
    const blob = new Blob([qrSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'qrcode.svg'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!qrDataUrl) return
    
    try {
      const response = await fetch(qrDataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const applyPreset = (preset: typeof presetColors[0]) => {
    setDarkColor(preset.dark)
    setLightColor(preset.light)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="px-5 pb-8 pt-28 sm:px-8">
        <div className="mx-auto max-w-[1720px]">
          <Link href="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
            <div className="relative overflow-hidden rounded-[1.2rem] border border-border bg-white p-7 sm:p-10">
              <div className="absolute right-8 top-8 text-[8rem] font-semibold leading-none text-muted/60">QR</div>
              <div className="relative z-10">
                <p className="flex items-center gap-3 text-sm font-semibold uppercase text-muted-foreground">
                  <span className="h-2.5 w-2.5 bg-primary" />
                  Utility bench
                </p>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-none text-foreground sm:text-7xl">QR Generator</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Create custom QR codes for URLs or text with full customization options.</p>
              </div>
            </div>
            <div className="sonke-hero-field relative min-h-[260px] overflow-hidden rounded-[1.2rem] border border-border p-6 text-background">
              <div className="sonke-hero-mesh absolute inset-0" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase text-background/70">Live preview</span>
                  <QrCode className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-3xl font-semibold">URL / Text / Export</p>
                  <p className="mt-3 text-sm leading-6 text-background/75">Tune size, margins, correction level, and colors while the code updates in place.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants} className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-[1720px]">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="rounded-md border border-border bg-white p-6 avoora-soft-shadow sm:p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 h-12 rounded-sm border border-border bg-background p-1">
                <TabsTrigger value="url" className="rounded-sm gap-2">
                  <Link2 className="w-4 h-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="text" className="rounded-sm gap-2">
                  <Type className="w-4 h-4" />
                  Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="url-input" className="text-sm font-medium mb-2 block">
                      Enter URL
                    </Label>
                    <Input
                      id="url-input"
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    className="rounded-sm bg-background"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="text">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text-input" className="text-sm font-medium mb-2 block">
                      Enter Text
                    </Label>
                    <Textarea
                      id="text-input"
                      placeholder="Enter any text you want to encode..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="min-h-[120px] rounded-sm bg-background"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {text.length} / 2953 characters
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Customization Options */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Customize
              </h3>

              {/* Color Presets */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">Color Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className={`flex items-center gap-2 rounded-sm border px-3 py-2 transition-all ${
                        darkColor === preset.dark && lightColor === preset.light
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/50'
                      }`}
                    >
                      <div
                        className="h-4 w-4 rounded-full border border-border/50"
                        style={{ backgroundColor: preset.dark }}
                      />
                      <span className="text-sm">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="dark-color" className="text-sm font-medium mb-2 block">
                    QR Color
                  </Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="dark-color"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-sm border border-border/50"
                    />
                    <Input
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="rounded-sm bg-background font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="light-color" className="text-sm font-medium mb-2 block">
                    Background
                  </Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="light-color"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-sm border border-border/50"
                    />
                    <Input
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="rounded-sm bg-background font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">
                  Size: {size[0]}px
                </Label>
                <Slider
                  value={size}
                  onValueChange={setSize}
                  min={128}
                  max={1024}
                  step={64}
                  className="w-full"
                />
              </div>

              {/* Margin */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">
                  Margin: {margin[0]} modules
                </Label>
                <Slider
                  value={margin}
                  onValueChange={setMargin}
                  min={0}
                  max={8}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Error Correction */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Error Correction</Label>
                <div className="flex flex-wrap gap-2">
                  {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setErrorCorrection(level)}
                      className={`rounded-sm border px-4 py-2 text-sm transition-all ${
                        errorCorrection === level
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/50 hover:border-primary/50'
                      }`}
                    >
                      {level} - {level === 'L' ? '7%' : level === 'M' ? '15%' : level === 'Q' ? '25%' : '30%'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Higher correction allows more damage while remaining scannable
                </p>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex flex-col rounded-md border border-border bg-white p-6 avoora-soft-shadow sm:p-8">
            <h3 className="text-lg font-semibold mb-6">Preview</h3>
            
            {/* QR Preview */}
            <div className="flex-1 flex items-center justify-center">
              {qrDataUrl ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div 
                    className="rounded-md border border-border p-4"
                    style={{ backgroundColor: lightColor }}
                  >
                    <img
                      src={qrDataUrl}
                      alt="Generated QR Code"
                      className="max-w-full"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                </motion.div>
              ) : (
                <div className="text-center">
                  <QrCode className="w-24 h-24 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Enter a URL or text to generate your QR code
                  </p>
                </div>
              )}
            </div>

            {/* Download Actions */}
            {qrDataUrl && (
              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={downloadPNG}
                    className="rounded-sm bg-primary text-primary-foreground gap-2 flex-1"
                  >
                    <Download className="w-4 h-4" />
                    PNG
                  </Button>
                  <Button
                    onClick={downloadSVG}
                    variant="outline"
                    className="rounded-sm gap-2 flex-1"
                  >
                    <Download className="w-4 h-4" />
                    SVG
                  </Button>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  PNG: Best for most uses • SVG: Best for print / scaling
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div variants={itemVariants} className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-[1720px]">
          <div className="rounded-md border border-border bg-white p-6">
            <h3 className="font-semibold mb-4">Pro Tips</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">For better scanning:</strong> Keep good contrast between QR and background colors. Test with your phone before sharing.
              </div>
              <div>
                <strong className="text-foreground">Error correction:</strong> Use higher levels (Q or H) if you plan to add a logo or the QR might get damaged.
              </div>
              <div>
                <strong className="text-foreground">Size matters:</strong> For print, use at least 300px. For social media, 256-512px works great.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
