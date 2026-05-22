import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=')
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()]
    }),
)

const url = env.NEXT_PUBLIC_SUPABASE_URL
const publishable = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const secret =
  env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY

const client = createClient(url, secret || publishable, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { error } = await client.from('profiles').select('id').limit(1)

if (!error) {
  console.log('ok    Supabase connected (profiles table reachable)')
  process.exit(0)
}

if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
  console.log('warn  Supabase connected but profiles table is missing')
  console.log('      Run supabase/migrations/001_profiles.sql in the SQL editor')
  process.exit(0)
}

if (error.message.includes('Invalid API key')) {
  console.log('FAIL  Supabase API key rejected — check keys in the dashboard')
  process.exit(1)
}

console.log('FAIL  Supabase:', error.message)
process.exit(1)
