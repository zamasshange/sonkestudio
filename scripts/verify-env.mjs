import { readFileSync } from 'fs'
import { resolve } from 'path'

const envPath = resolve(process.cwd(), '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=')
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()]
    }),
)

const isPlaceholder = (value) =>
  !value || /^YOUR_/i.test(value) || /placeholder/i.test(value)

const checks = [
  {
    name: 'Clerk publishable key',
    ok: /^pk_(test|live)_/.test(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ''),
  },
  {
    name: 'Clerk secret key',
    ok: /^sk_(test|live)_/.test(env.CLERK_SECRET_KEY ?? ''),
  },
  {
    name: 'Clerk sign-in URL',
    ok: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL === '/sign-in',
  },
  {
    name: 'Supabase URL',
    ok: /^https:\/\/.+\.supabase\.co\/?$/.test(env.NEXT_PUBLIC_SUPABASE_URL ?? ''),
  },
  {
    name: 'Supabase publishable key',
    ok:
      (env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').startsWith('sb_publishable_') ||
      (env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').startsWith('eyJ'),
  },
  {
    name: 'Supabase secret key (optional)',
    ok:
      (env.SUPABASE_SECRET_KEY ?? '').startsWith('sb_secret_') ||
      (env.SUPABASE_SERVICE_ROLE_KEY ?? '').startsWith('eyJ'),
    optional: true,
  },
]

let failed = 0
for (const check of checks) {
  const status = check.ok ? 'ok' : check.optional ? 'skip' : 'FAIL'
  console.log(`${status.padEnd(5)} ${check.name}`)
  if (!check.ok && !check.optional) failed += 1
}

if (isPlaceholder(env.NEXT_PUBLIC_SUPABASE_URL)) {
  console.log('\nSupabase URL is still a placeholder in .env.local')
  failed += 1
}

process.exit(failed > 0 ? 1 : 0)
