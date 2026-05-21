"use client"

import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { Image as ImageIcon, Minimize2, Maximize2, RefreshCw, Upload, X, Download, ArrowLeft, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import imageCompression from 'browser-image-compression'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface ImageFile {
  file: File
  id: string
  name: string
  size: number
  preview: string
  width?: number
  height?: number
  processed?: {
    blob: Blob
    size: number
    url: string
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function ImageToolsPage() {
  const [activeTab, setActiveTab] = useState('compress')
  const [files, setFiles] = useState<ImageFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // Compression settings
  const [quality, setQuality] = useState([80])
  const [maxWidth, setMaxWidth] = useState([1920])
  
  // Resize settings
  const [resizeWidth, setResizeWidth] = useState('')
  const [resizeHeight, setResizeHeight] = useState('')
  const [maintainRatio, setMaintainRatio] = useState(true)
  
  // Convert settings
  const [outputFormat, setOutputFormat] = useState('jpeg')

  const handleFileDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    await addFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
      await addFiles(selectedFiles)
    }
  }, [])

  const addFiles = async (newFiles: File[]) => {
    const filesWithPreview: ImageFile[] = await Promise.all(
      newFiles.map(async (file) => {
        const preview = URL.createObjectURL(file)
        
        // Get dimensions
        let width = 0
        let height = 0
        try {
          const img = document.createElement('img')
          img.src = preview
          await new Promise((resolve) => {
            img.onload = () => {
              width = img.naturalWidth
              height = img.naturalHeight
              resolve(true)
            }
          })
        } catch {
          // Continue without dimensions
        }
        
        return {
          file,
          id: Math.random().toString(36).substring(7),
          name: file.name,
          size: file.size,
          preview,
          width,
          height,
        }
      })
    )
    setFiles(prev => [...prev, ...filesWithPreview])
  }

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
        if (file.processed?.url) {
          URL.revokeObjectURL(file.processed.url)
        }
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const clearFiles = () => {
    files.forEach(f => {
      URL.revokeObjectURL(f.preview)
      if (f.processed?.url) {
        URL.revokeObjectURL(f.processed.url)
      }
    })
    setFiles([])
    setProgress(0)
  }

  const compressImages = async () => {
    if (files.length === 0) return
    setProcessing(true)
    setProgress(0)

    const processedFiles: ImageFile[] = []

    for (let i = 0; i < files.length; i++) {
      try {
        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: maxWidth[0],
          useWebWorker: true,
          initialQuality: quality[0] / 100,
        }

        const compressedBlob = await imageCompression(files[i].file, options)
        const url = URL.createObjectURL(compressedBlob)

        processedFiles.push({
          ...files[i],
          processed: {
            blob: compressedBlob,
            size: compressedBlob.size,
            url,
          },
        })
      } catch (error) {
        console.error('Error compressing image:', error)
        processedFiles.push(files[i])
      }
      
      setProgress(((i + 1) / files.length) * 100)
    }

    setFiles(processedFiles)
    setProcessing(false)
  }

  const resizeImages = async () => {
    if (files.length === 0) return
    setProcessing(true)
    setProgress(0)

    const processedFiles: ImageFile[] = []
    const targetWidth = parseInt(resizeWidth) || undefined
    const targetHeight = parseInt(resizeHeight) || undefined

    for (let i = 0; i < files.length; i++) {
      try {
        const img = document.createElement('img')
        img.src = files[i].preview
        
        await new Promise((resolve) => {
          img.onload = resolve
        })

        let newWidth = targetWidth || img.naturalWidth
        let newHeight = targetHeight || img.naturalHeight

        if (maintainRatio) {
          if (targetWidth && !targetHeight) {
            newHeight = Math.round(img.naturalHeight * (targetWidth / img.naturalWidth))
          } else if (targetHeight && !targetWidth) {
            newWidth = Math.round(img.naturalWidth * (targetHeight / img.naturalHeight))
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = newWidth
        canvas.height = newHeight

        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get canvas context')

        ctx.drawImage(img, 0, 0, newWidth, newHeight)

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b)
            else reject(new Error('Could not create blob'))
          }, files[i].file.type, 0.9)
        })

        const url = URL.createObjectURL(blob)

        processedFiles.push({
          ...files[i],
          processed: {
            blob,
            size: blob.size,
            url,
          },
        })
      } catch (error) {
        console.error('Error resizing image:', error)
        processedFiles.push(files[i])
      }

      setProgress(((i + 1) / files.length) * 100)
    }

    setFiles(processedFiles)
    setProcessing(false)
  }

  const convertImages = async () => {
    if (files.length === 0) return
    setProcessing(true)
    setProgress(0)

    const processedFiles: ImageFile[] = []
    const mimeType = `image/${outputFormat}`

    for (let i = 0; i < files.length; i++) {
      try {
        const img = document.createElement('img')
        img.crossOrigin = 'anonymous'
        img.src = files[i].preview
        
        await new Promise((resolve) => {
          img.onload = resolve
        })

        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight

        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get canvas context')

        // For JPEG, fill with white background (no transparency)
        if (outputFormat === 'jpeg') {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        ctx.drawImage(img, 0, 0)

        const quality = outputFormat === 'png' ? 1 : 0.9
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b)
            else reject(new Error('Could not create blob'))
          }, mimeType, quality)
        })

        const url = URL.createObjectURL(blob)
        const newName = files[i].name.replace(/\.[^.]+$/, `.${outputFormat}`)

        processedFiles.push({
          ...files[i],
          name: newName,
          processed: {
            blob,
            size: blob.size,
            url,
          },
        })
      } catch (error) {
        console.error('Error converting image:', error)
        processedFiles.push(files[i])
      }

      setProgress(((i + 1) / files.length) * 100)
    }

    setFiles(processedFiles)
    setProcessing(false)
  }

  const downloadAll = async () => {
    const processedFiles = files.filter(f => f.processed)
    
    if (processedFiles.length === 0) return

    if (processedFiles.length === 1) {
      // Single file download
      const file = processedFiles[0]
      saveAs(file.processed!.blob, file.name)
    } else {
      // Multiple files - create ZIP
      const zip = new JSZip()
      
      processedFiles.forEach(file => {
        zip.file(file.name, file.processed!.blob)
      })

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      saveAs(zipBlob, 'images.zip')
    }
  }

  const downloadSingle = (file: ImageFile) => {
    if (file.processed) {
      saveAs(file.processed.blob, file.name)
    }
  }

  const totalSaved = files.reduce((acc, f) => {
    if (f.processed) {
      return acc + (f.size - f.processed.size)
    }
    return acc
  }, 0)

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
              <div className="absolute right-8 top-8 text-[8rem] font-semibold leading-none text-muted/60">IMG</div>
              <div className="relative z-10">
                <p className="flex items-center gap-3 text-sm font-semibold uppercase text-muted-foreground">
                  <span className="h-2.5 w-2.5 bg-primary" />
                  Image workspace
                </p>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-none text-foreground sm:text-7xl">Image Tools</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Compress, resize, and convert images. All processing happens locally in your browser.</p>
              </div>
            </div>
            <div className="sonke-hero-field relative min-h-[260px] overflow-hidden rounded-[1.2rem] border border-border p-6 text-background">
              <div className="sonke-hero-mesh absolute inset-0" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase text-background/70">Local image ops</span>
                  <ImageIcon className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-3xl font-semibold">Compress / Resize / Convert</p>
                  <p className="mt-3 text-sm leading-6 text-background/75">Drop image files, tune the settings, and export optimized assets from one focused workspace.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-[1720px]">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); clearFiles(); }}>
          <TabsList className="mb-6 h-12 rounded-sm border border-border bg-muted p-1">
            <TabsTrigger value="compress" className="rounded-sm data-[state=active]:bg-foreground data-[state=active]:text-background gap-2 px-4">
              <Minimize2 className="w-4 h-4" />
              Compress
            </TabsTrigger>
            <TabsTrigger value="resize" className="rounded-sm data-[state=active]:bg-foreground data-[state=active]:text-background gap-2 px-4">
              <Maximize2 className="w-4 h-4" />
              Resize
            </TabsTrigger>
            <TabsTrigger value="convert" className="rounded-sm data-[state=active]:bg-foreground data-[state=active]:text-background gap-2 px-4">
              <RefreshCw className="w-4 h-4" />
              Convert
            </TabsTrigger>
          </TabsList>

          {/* Compress Tab */}
          <TabsContent value="compress">
            <div className="rounded-md border border-border bg-white p-6 avoora-soft-shadow sm:p-8">
              <h3 className="text-xl font-semibold mb-2">Compress Images</h3>
              <p className="text-muted-foreground mb-6">Reduce file size while keeping images looking great.</p>

              {/* Settings */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Quality: {quality[0]}%</Label>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-3 block">Max Width: {maxWidth[0]}px</Label>
                  <Slider
                    value={maxWidth}
                    onValueChange={setMaxWidth}
                    min={320}
                    max={4096}
                    step={128}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Drop Zone */}
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer rounded-sm border-2 border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary/50"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-compress-input"
                />
                <label htmlFor="image-compress-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">Drop images here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports JPG, PNG, WebP, and more</p>
                </label>
              </div>

              {/* Image Grid */}
              {files.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <div key={file.id} className="group relative overflow-hidden rounded-sm bg-muted">
                      <img
                        src={file.processed?.url || file.preview}
                        alt={file.name}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                        <p className="text-white text-xs truncate w-full text-center mb-1">{file.name}</p>
                        <p className="text-white/70 text-xs mb-2">
                          {formatFileSize(file.size)}
                          {file.processed && (
                            <span className="text-emerald-600">&nbsp;-&gt;&nbsp;{formatFileSize(file.processed.size)}</span>
                          )}
                        </p>
                        <div className="flex gap-2">
                          {file.processed && (
                            <Button size="sm" variant="secondary" onClick={() => downloadSingle(file)}>
                              <Download className="w-3 h-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => removeFile(file.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      {file.processed && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-sm bg-green-500">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {files.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Button
                    onClick={compressImages}
                    disabled={processing}
                    className="rounded-sm bg-primary text-primary-foreground gap-2"
                  >
                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minimize2 className="w-4 h-4" />}
                    {processing ? 'Compressing...' : 'Compress All'}
                  </Button>
                  {files.some(f => f.processed) && (
                    <Button onClick={downloadAll} variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download All
                    </Button>
                  )}
                  <Button variant="ghost" onClick={clearFiles}>Clear All</Button>
                  {processing && (
                    <div className="flex-1 min-w-[200px]">
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                  {totalSaved > 0 && (
                    <span className="text-sm text-emerald-600">
                      Saved {formatFileSize(totalSaved)} total!
                    </span>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Resize Tab */}
          <TabsContent value="resize">
            <div className="rounded-md border border-border bg-white p-6 avoora-soft-shadow sm:p-8">
              <h3 className="text-xl font-semibold mb-2">Resize Images</h3>
              <p className="text-muted-foreground mb-6">Change image dimensions while maintaining quality.</p>

              {/* Settings */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="resize-width" className="text-sm font-medium mb-2 block">Width (px)</Label>
                  <Input
                    id="resize-width"
                    type="number"
                    placeholder="Auto"
                    value={resizeWidth}
                    onChange={(e) => setResizeWidth(e.target.value)}
                    className="rounded-sm bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="resize-height" className="text-sm font-medium mb-2 block">Height (px)</Label>
                  <Input
                    id="resize-height"
                    type="number"
                    placeholder="Auto"
                    value={resizeHeight}
                    onChange={(e) => setResizeHeight(e.target.value)}
                    className="rounded-sm bg-background"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Aspect Ratio</Label>
                  <Button
                    variant={maintainRatio ? 'default' : 'outline'}
                    onClick={() => setMaintainRatio(!maintainRatio)}
                    className="w-full"
                  >
                    {maintainRatio ? 'Maintain Ratio' : 'Free Resize'}
                  </Button>
                </div>
              </div>

              {/* Drop Zone */}
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer rounded-sm border-2 border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary/50"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-resize-input"
                />
                <label htmlFor="image-resize-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">Drop images here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports JPG, PNG, WebP, and more</p>
                </label>
              </div>

              {/* Image Grid */}
              {files.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <div key={file.id} className="group relative overflow-hidden rounded-sm bg-muted">
                      <img
                        src={file.processed?.url || file.preview}
                        alt={file.name}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                        <p className="text-white text-xs truncate w-full text-center mb-1">{file.name}</p>
                        <p className="text-white/70 text-xs mb-2">
                          {file.width}x{file.height}
                        </p>
                        <div className="flex gap-2">
                          {file.processed && (
                            <Button size="sm" variant="secondary" onClick={() => downloadSingle(file)}>
                              <Download className="w-3 h-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => removeFile(file.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      {file.processed && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-sm bg-green-500">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {files.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Button
                    onClick={resizeImages}
                    disabled={processing || (!resizeWidth && !resizeHeight)}
                    className="rounded-sm bg-primary text-primary-foreground gap-2"
                  >
                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Maximize2 className="w-4 h-4" />}
                    {processing ? 'Resizing...' : 'Resize All'}
                  </Button>
                  {files.some(f => f.processed) && (
                    <Button onClick={downloadAll} variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download All
                    </Button>
                  )}
                  <Button variant="ghost" onClick={clearFiles}>Clear All</Button>
                  {processing && (
                    <div className="flex-1 min-w-[200px]">
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Convert Tab */}
          <TabsContent value="convert">
            <div className="rounded-md border border-border bg-white p-6 avoora-soft-shadow sm:p-8">
              <h3 className="text-xl font-semibold mb-2">Convert Format</h3>
              <p className="text-muted-foreground mb-6">Change image format between JPG, PNG, and WebP.</p>

              {/* Settings */}
              <div className="mb-6 max-w-xs">
                <Label className="text-sm font-medium mb-2 block">Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="rounded-sm bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG (.jpg)</SelectItem>
                    <SelectItem value="png">PNG (.png)</SelectItem>
                    <SelectItem value="webp">WebP (.webp)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Drop Zone */}
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer rounded-sm border-2 border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary/50"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-convert-input"
                />
                <label htmlFor="image-convert-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">Drop images here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports JPG, PNG, WebP, GIF, BMP, and more</p>
                </label>
              </div>

              {/* Image Grid */}
              {files.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {files.map((file) => (
                    <div key={file.id} className="group relative overflow-hidden rounded-sm bg-muted">
                      <img
                        src={file.processed?.url || file.preview}
                        alt={file.name}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                        <p className="text-white text-xs truncate w-full text-center mb-1">{file.name}</p>
                        <p className="text-white/70 text-xs mb-2">{formatFileSize(file.processed?.size || file.size)}</p>
                        <div className="flex gap-2">
                          {file.processed && (
                            <Button size="sm" variant="secondary" onClick={() => downloadSingle(file)}>
                              <Download className="w-3 h-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => removeFile(file.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      {file.processed && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-sm bg-green-500">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {files.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Button
                    onClick={convertImages}
                    disabled={processing}
                    className="rounded-sm bg-primary text-primary-foreground gap-2"
                  >
                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    {processing ? 'Converting...' : `Convert to ${outputFormat.toUpperCase()}`}
                  </Button>
                  {files.some(f => f.processed) && (
                    <Button onClick={downloadAll} variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download All
                    </Button>
                  )}
                  <Button variant="ghost" onClick={clearFiles}>Clear All</Button>
                  {processing && (
                    <div className="flex-1 min-w-[200px]">
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </motion.div>
    </motion.div>
  )
}
