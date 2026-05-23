import { NextRequest, NextResponse } from 'next/server'
import { getResend, getResendFromAddress } from '@/lib/server/integrations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const to = typeof body.to === 'string' ? body.to.trim() : ''
    const subject = typeof body.subject === 'string' ? body.subject.trim() : 'Message from SONKE Tools'
    const html = typeof body.html === 'string' ? body.html : ''
    const text = typeof body.text === 'string' ? body.text : undefined

    if (!to || !html) {
      return NextResponse.json({ error: 'Recipient and message body are required' }, { status: 400 })
    }

    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from: getResendFromAddress(),
      to: [to],
      subject,
      html,
      text,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ id: data?.id, ok: true })
  } catch (error) {
    console.error('email error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 },
    )
  }
}
