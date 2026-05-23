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

const checks = [
  { name: 'Bitly token', key: 'BITLY_ACCESS_TOKEN', test: (v) => v.length > 20 },
  { name: 'Resend API key', key: 'RESEND_API_KEY', test: (v) => v.startsWith('re_') },
  { name: 'Cloudinary URL', key: 'CLOUDINARY_URL', test: (v) => v.startsWith('cloudinary://') },
  { name: 'Liveblocks secret', key: 'LIVEBLOCKS_SECRET_KEY', test: (v) => v.startsWith('sk_') },
  { name: 'Liveblocks publishable', key: 'NEXT_PUBLIC_LIVEBLOCKS_PUBLISHABLE_KEY', test: (v) => v.startsWith('pk_') },
]

let failed = 0
for (const check of checks) {
  const value = env[check.key] ?? ''
  const ok = check.test(value)
  console.log(`${ok ? 'ok' : 'FAIL'}  ${check.name}`)
  if (!ok) failed += 1
}

async function liveTest(name, run) {
  try {
    await run()
    console.log(`ok    ${name} API reachable`)
  } catch (error) {
    console.log(`FAIL  ${name} API: ${error.message}`)
    failed += 1
  }
}

if (!failed) {
  await liveTest('Bitly', async () => {
    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.BITLY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ long_url: 'https://sonkestudio.vercel.app' }),
    })
    if (!response.ok) throw new Error(await response.text())
  })
}

process.exit(failed > 0 ? 1 : 0)
