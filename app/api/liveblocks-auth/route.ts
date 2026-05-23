import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getLiveblocks } from '@/lib/server/integrations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const room = typeof body.room === 'string' ? body.room.trim() : ''
    const guestId = typeof body.userId === 'string' ? body.userId.trim() : ''

    if (!room) {
      return NextResponse.json({ error: 'Room id required' }, { status: 400 })
    }

    const clerk = await auth()
    const userId = clerk.userId ?? (guestId || `guest-${crypto.randomUUID()}`)
    const name = userId.startsWith('guest-') ? 'Guest' : 'SONKE user'

    const session = getLiveblocks().prepareSession(userId, {
      userInfo: {
        name: String(name),
      },
    })

    session.allow(room, session.FULL_ACCESS)
    const { status, body: authBody } = await session.authorize()
    return new NextResponse(authBody, { status })
  } catch (error) {
    console.error('liveblocks-auth error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Liveblocks auth failed' },
      { status: 500 },
    )
  }
}
