import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data } = await supabase
      .from('notification_preferences')
      .select('daily_reminder_enabled, daily_reminder_time, eod_summary_enabled, timezone')
      .eq('user_id', user.id)
      .maybeSingle()

    const defaults = {
      daily_reminder_enabled: false,
      daily_reminder_time: '20:00',
      eod_summary_enabled: true,
      timezone: 'Asia/Kolkata',
    }

    return NextResponse.json({ ...defaults, ...data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { daily_reminder_enabled, daily_reminder_time, eod_summary_enabled, timezone } = body

    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert(
        {
          user_id: user.id,
          daily_reminder_enabled: !!daily_reminder_enabled,
          daily_reminder_time: daily_reminder_time || '20:00',
          eod_summary_enabled: eod_summary_enabled !== undefined ? !!eod_summary_enabled : true,
          timezone: timezone || 'Asia/Kolkata',
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single()

    if (error) {
      console.error('Error saving notification preferences:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
