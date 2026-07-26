import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { sendPushToUser } from '@/lib/sendPush'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await sendPushToUser(user.id, {
      title: 'PaisaTrack Test',
      body: 'Push notifications are working cleanly on your device!',
      data: { url: '/' },
    })

    if (!result.success) {
      return NextResponse.json({ error: result.reason || 'No active device subscription found' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
