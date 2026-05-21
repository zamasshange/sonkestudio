"use client"

import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { FileText, Merge, Scissors, Minimize2, Upload, X, Download, ArrowLeft, Loader2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { PDFDocument } from 'pdf-lib'

interface FileWithPreview {
  file: File
  id: string
  name: string
  size: number
  pageCount?: number
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

export default function PDFToolsPage() {
  const [activeTab, setActiveTab] = useState('merge')
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [splitRange, setSplitRange] = useState('')
  const [compressionQuality, setCompressionQuality] = useState(80)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleFileDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf')
    await addFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf')
      await addFiles(selectedFiles)
    }
  }, [])

  const addFiles = async (newFiles: File[]) => {
    const filesWithPreview: FileWithPreview[] = await Promise.all(
      newFiles.map(async (file) => {
        let pageCount = 0
        try {
          const arrayBuffer = await file.arrayBuffer()
          const pdf = await PDFDocument.load(arrayBuffer)
          pageCount = pdf.getPageCount()
        } catch {
          // If we can't read page count, just continue
        }
        return {
          file,
          id: Math.random().toString(36).substring(7),
          name: file.name,
          size: file.size,
          pageCount,
        }
      })
    )
    setFiles(prev => [...prev, ...filesWithPreview])
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const clearFiles = () => {
    setFiles([])
    setProgress(0)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    
    const newFiles = [...files]
    const draggedItem = newFiles[draggedIndex]
    newFiles.splice(draggedIndex, 1)
    newFiles.splice(index, 0, draggedItem)
    setFiles(newFiles)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const mergePDFs = async () => {
    if (files.length < 2) return
    setProcessing(true)
    setProgress(0)

    try {
      const mergedPdf = await PDFDocument.create()
      
      for (let i = 0; i < files.length; i++) {
        const arrayBuffer = await files[i].file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(page => mergedPdf.addPage(page))
        setProgress(((i + 1) / files.length) * 100)
      }

      const mergedPdfBytes = await mergedPdf.save()
      downloadPDF(mergedPdfBytes, 'merged.pdf')
    } catch (error) {
      console.error('Error merging PDFs:', error)
    } finally {
      setProcessing(false)
    }
  }

  const splitPDF = async () => {
    if (files.length !== 1) return
    setProcessing(true)
    setProgress(0)

    try {
      const arrayBuffer = await files[0].file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const totalPages = pdf.getPageCount()

      // Parse range like "1-3, 5, 7-9"
      const ranges = splitRange.split(',').map(r => r.trim())
      const pagesToExtract: number[] = []

      for (const range of ranges) {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(n => parseInt(n.trim()))
          for (let i = start; i <= Math.min(end, totalPages); i++) {
            if (i > 0 && !pagesToExtract.includes(i - 1)) {
              pagesToExtract.push(i - 1)
            }
          }
        } else {
          const page = parseInt(range)
          if (page > 0 && page <= totalPages && !pagesToExtract.includes(page - 1)) {
            pagesToExtract.push(page - 1)
          }
        }
      }

      if (pagesToExtract.length === 0) {
        // If no valid range, split each page
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create()
          const [page] = await newPdf.copyPages(pdf, [i])
          newPdf.addPage(page)
          const pdfBytes = await newPdf.save()
          downloadPDF(pdfBytes, `page_${i + 1}.pdf`)
          setProgress(((i + 1) / totalPages) * 100)
        }
      } else {
        const newPdf = await PDFDocument.create()
        const pages = await newPdf.copyPages(pdf, pagesToExtract)
        pages.forEach(page => newPdf.addPage(page))
        const pdfBytes = await newPdf.save()
        downloadPDF(pdfBytes, 'extracted_pages.pdf')
        setProgress(100)
      }
    } catch (error) {
      console.error('Error splitting PDF:', error)
    } finally {
      setProcessing(false)
    }
  }

  const compressPDF = async () => {
    if (files.length === 0) return
    setProcessing(true)
    setProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const arrayBuffer = await files[i].file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        
        // Remove metadata and optimize
        pdf.setTitle('')
        pdf.setAuthor('')
        pdf.setSubject('')
        pdf.setKeywords([])
        pdf.setProducer('')
        pdf.setCreator('')

        const compressedBytes = await pdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 50,
        })

        const originalSize = files[i].size
        const newSize = compressedBytes.length
        const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1)
        
        downloadPDF(compressedBytes, `compressed_${files[i].name}`)
        setProgress(((i + 1) / files.length) * 100)
      }
    } catch (error) {
      console.error('Error compressing PDF:', error)
    } finally {
      setProcessing(false)
    }
  }

  const downloadPDF = (bytes: Uint8Array, filename: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
              <div className="absolute right-8 top-8 text-[8rem] font-semibold leading-none text-muted/60">PDF</div>
              <div className="relative z-10">
                <p className="flex items-center gap-3 text-sm font-semibold uppercase text-muted-foreground">
                  <span className="h-2.5 w-2.5 bg-primary" />
                  Document workspace
                </p>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-none text-foreground sm:text-7xl">PDF Tools</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Merge, split, and compress your PDFs. All processing happens locally in your browser.</p>
              </div>
            </div>
            <div className="sonke-hero-field relative min-h-[260px] overflow-hidden rounded-[1.2rem] border border-border p-6 text-background">
              <div className="sonke-hero-mesh absolute inset-0" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase text-background/70">Local processing</span>
                  <FileText className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-3xl font-semibold">Merge / Split / Compress</p>
                  <p className="mt-3 text-sm leading-6 text-background/75">Pick a PDF action, upload files, and export clean documents without leaving the browser.</p>
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
            <TabsTrigger value="merge" className="rounded-sm data-[state=active]:bg-foreground data-[state=active]:text-background gap-2 px-4">
              <Merge className="w-4 h-4" />
              Merge
            </TabsTrigger>
            <TabsTrigger value="split" className="rounded-sm data-[state=active]:bg-foreground data-[state=active]:text-background gap-2 px-4">
              <Scissors className="w-4 h-4" />
              Split
            </TabsTrigger>
            <TabsTrigger value="compress" className="rounded-sm data-[state=active]:bg-foreground data-[state=active]:text-background gap-2 px-4">
              <Minimize2 className="w-4 h-4" />
              Compress
            </TabsTrigger>
          </TabsList>

          {/* Merge Tab */}
          <TabsContent value="merge">
            <div className="rounded-md border border-border bg-white p-6 avoora-soft-shadow sm:p-8">
              <h3 className="text-xl font-semibold mb-2">Merge PDFs</h3>
              <p className="text-muted-foreground mb-6">Combine multiple PDFs into one. Drag to reorder.</p>

              {/* Drop Zone */}
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer rounded-sm border-2 border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary/50"
              >
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-merge-input"
                />
                <label htmlFor="pdf-merge-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">Drop PDFs here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Add 2+ PDFs to merge them together</p>
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={file.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`group flex cursor-move items-center gap-4 rounded-sm bg-background p-4 ${draggedIndex === index ? 'opacity-50' : ''}`}
                    >
                      <GripVertical className="w-5 h-5 text-muted-foreground" />
                      <FileText className="w-8 h-8 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} {file.pageCount && `• ${file.pageCount} pages`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {files.length >= 2 && (
                <div className="mt-6 flex items-center gap-4">
                  <Button
                    onClick={mergePDFs}
                    disabled={processing}
                    className="rounded-sm bg-primary text-primary-foreground gap-2"
                  >
                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    {processing ? 'Merging...' : 'Merge & Download'}
                  </Button>
                  <Button variant="outline" onClick={clearFiles}>Clear All</Button>
                  {processing && (
                    <div className="flex-1">
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Split Tab */}
          <TabsContent value="split">
            <div className="rounded-md border border-border bg-white p-6 avoora-soft-shadow sm:p-8">
              <h3 className="text-xl font-semibold mb-2">Split PDF</h3>
              <p className="text-muted-foreground mb-6">Extract specific pages or split into individual files.</p>

              {/* Drop Zone */}
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer rounded-sm border-2 border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary/50"
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-split-input"
                />
                <label htmlFor="pdf-split-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">Drop a PDF here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Select a single PDF to split</p>
                </label>
              </div>

              {/* File Info */}
              {files.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-4 rounded-sm bg-background p-4">
                    <FileText className="w-8 h-8 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{files[0].name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(files[0].size)} {files[0].pageCount && `• ${files[0].pageCount} pages`}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={clearFiles}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Page Range Input */}
                  <div className="mt-4">
                    <Label htmlFor="split-range" className="text-sm font-medium">
                      Page Range (optional)
                    </Label>
                    <Input
                      id="split-range"
                      placeholder="e.g., 1-3, 5, 7-9 or leave empty for all pages"
                      value={splitRange}
                      onChange={(e) => setSplitRange(e.target.value)}
                      className="mt-2 bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Leave empty to split each page into a separate file
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center gap-4">
                    <Button
                      onClick={splitPDF}
                      disabled={processing}
                      className="rounded-sm bg-primary text-primary-foreground gap-2"
                    >
                      {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      {processing ? 'Splitting...' : 'Split & Download'}
                    </Button>
                    {processing && (
                      <div className="flex-1">
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Compress Tab */}
          <TabsContent value="compress">
            <div className="rounded-md border border-border bg-white p-6 avoora-soft-shadow sm:p-8">
              <h3 className="text-xl font-semibold mb-2">Compress PDF</h3>
              <p className="text-muted-foreground mb-6">Reduce file size while maintaining quality.</p>

              {/* Drop Zone */}
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="cursor-pointer rounded-sm border-2 border-dashed border-border bg-background p-8 text-center transition-colors hover:border-primary/50"
              >
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-compress-input"
                />
                <label htmlFor="pdf-compress-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-1">Drop PDFs here or click to browse</p>
                  <p className="text-sm text-muted-foreground">Compress one or multiple PDFs</p>
                </label>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="group flex items-center gap-4 rounded-sm bg-background p-4"
                    >
                      <FileText className="w-8 h-8 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              {files.length > 0 && (
                <div className="mt-6 flex items-center gap-4">
                  <Button
                    onClick={compressPDF}
                    disabled={processing}
                    className="rounded-sm bg-primary text-primary-foreground gap-2"
                  >
                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    {processing ? 'Compressing...' : 'Compress & Download'}
                  </Button>
                  <Button variant="outline" onClick={clearFiles}>Clear All</Button>
                  {processing && (
                    <div className="flex-1">
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
