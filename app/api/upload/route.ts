import { NextRequest, NextResponse } from 'next/server'
import { configureCloudinary } from '@/lib/server/integrations'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = (formData.get('folder') as string | null)?.trim() || 'sonke-tools'

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 12MB' }, { status: 400 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const cloudinary = configureCloudinary()

    const result = await new Promise<{
      secure_url: string
      public_id: string
      format?: string
      bytes?: number
      width?: number
      height?: number
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, uploadResult) => {
          if (error || !uploadResult) reject(error ?? new Error('Upload failed'))
          else resolve(uploadResult)
        },
      )
      stream.end(bytes)
    })

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    })
  } catch (error) {
    console.error('upload error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 },
    )
  }
}
