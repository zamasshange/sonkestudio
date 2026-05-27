"use client"

import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { FileUp, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadToCloudinary } from '@/lib/upload-client'

export type UploadedImageAsset = {
  name: string
  url: string
  publicId: string
}

type ImageUploadFieldProps = {
  onUploaded: (asset: UploadedImageAsset) => void
  onClear?: () => void
  accept?: string
  folder?: string
}

export function ImageUploadField({ onUploaded, onClear, accept = 'image/*', folder = 'sonke-images' }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<UploadedImageAsset | null>(null)
  const [error, setError] = useState('')

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const uploaded = await uploadToCloudinary(file, folder)
      const asset = { name: file.name, url: uploaded.url, publicId: uploaded.publicId }
      setPreview(asset)
      onUploaded(asset)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:border-primary">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
        {uploading ? 'Uploading...' : 'Upload image'}
        <input type="file" accept={accept} onChange={handleFile} className="hidden" />
      </label>

      {preview && (
        <div className="flex items-center gap-3 rounded-md border border-border bg-background p-2">
          <div className="relative h-14 w-20 overflow-hidden rounded">
            <Image src={preview.url} alt={preview.name} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{preview.name}</p>
            <p className="truncate text-xs text-muted-foreground">{preview.url}</p>
          </div>
          <Button type="button" size="icon" variant="ghost" onClick={() => { setPreview(null); onClear?.() }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
