import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseAdmin } from '@/lib/supabase/server'
import { personaOptions } from '@/lib/user-preferences'

const preferencesSchema = z.object({
  persona: z.enum(['student', 'creator', 'business', 'developer', 'everyday']),
  toolCategories: z.array(z.string()).min(1),
  onboardingComplete: z.boolean().optional(),
})

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = preferencesSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid preferences', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { persona, toolCategories } = parsed.data
  const validPersona = personaOptions.some((option) => option.id === persona)
  if (!validPersona) {
    return NextResponse.json({ error: 'Unknown persona' }, { status: 400 })
  }

  const metadata = {
    persona,
    toolCategories,
    onboardingComplete: true,
  }

  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, {
    publicMetadata: metadata,
  })

  const supabase = createSupabaseAdmin()
  if (supabase) {
    const { error } = await supabase.from('profiles').upsert(
      {
        clerk_user_id: userId,
        persona,
        tool_categories: toolCategories,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'clerk_user_id' },
    )

    if (error) {
      console.error('[preferences] Supabase sync failed:', error.message)
    }
  }

  return NextResponse.json({ ok: true, preferences: metadata })
}
