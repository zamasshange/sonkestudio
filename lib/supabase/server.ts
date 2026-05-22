import { createClient } from '@supabase/supabase-js'

function isPlaceholder(value: string | undefined) {
  return !value || /^YOUR_/i.test(value) || value.includes('placeholder')
}

export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

  if (isPlaceholder(url) || isPlaceholder(serviceKey)) {
    return null
  }

  return createClient(url!, serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function createSupabasePublishable() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (isPlaceholder(url) || isPlaceholder(key)) {
    return null
  }

  return createClient(url!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
