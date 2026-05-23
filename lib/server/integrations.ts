import { v2 as cloudinary } from 'cloudinary'
import { Liveblocks } from '@liveblocks/node'
import { Resend } from 'resend'

function requireEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing ${name} in environment`)
  return value
}

export function getBitlyToken() {
  return requireEnv('BITLY_ACCESS_TOKEN')
}

export function getResend() {
  return new Resend(requireEnv('RESEND_API_KEY'))
}

export function getResendFromAddress() {
  return process.env.RESEND_FROM_EMAIL?.trim() || 'SONKE Tools <onboarding@resend.dev>'
}

export function configureCloudinary() {
  const url = process.env.CLOUDINARY_URL?.trim()
  if (url) {
    cloudinary.config({ secure: true })
    return cloudinary
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET')
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })
  return cloudinary
}

let liveblocksClient: Liveblocks | null = null

export function getLiveblocks() {
  if (!liveblocksClient) {
    liveblocksClient = new Liveblocks({ secret: requireEnv('LIVEBLOCKS_SECRET_KEY') })
  }
  return liveblocksClient
}

export function getLiveblocksPublishableKey() {
  return requireEnv('NEXT_PUBLIC_LIVEBLOCKS_PUBLISHABLE_KEY')
}
