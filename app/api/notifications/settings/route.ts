import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const DEFAULT_PREFERENCES = {
  daily_reminder_enabled: false,
  daily_reminder_time: '20:00',
  eod_summary_enabled: true,
  timezone: 'Asia/Kolkata',
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('daily_reminder_enabled, daily_reminder_time, eod_summary_enabled, timezone')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.warn('[GET /api/notifications/settings] Query error (table missing or RLS):', error.message)
      // Return defaults so UI loads smoothly without 500ing
      return NextResponse.json(DEFAULT_PREFERENCES)
    }

    return NextResponse.json({ ...DEFAULT_PREFERENCES, ...data })
  } catch (err: any) {
    console.error('[GET /api/notifications/settings] Exception:', err)
    return NextResponse.json(DEFAULT_PREFERENCES)
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { daily_reminder_enabled, daily_reminder_time, eod_summary_enabled, timezone } = body

    const payload = {
      user_id: user.id,
      daily_reminder_enabled: !!daily_reminder_enabled,
      daily_reminder_time: daily_reminder_time || '20:00',
      eod_summary_enabled: eod_summary_enabled !== undefined ? !!eod_summary_enabled : true,
      timezone: timezone || 'Asia/Kolkata',
    }

    // Try upsert first
    const { data: upsertData, error: upsertError } = await supabase
      .from('notification_preferences')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .maybeSingle()

    if (!upsertError) {
      return NextResponse.json(upsertData || payload)
    }

    console.warn('[POST /api/notifications/settings] Upsert failed, trying fallback query:', upsertError)

    // Fallback: check if row exists
    const { data: existing } = await supabase
      .from('notification_preferences')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing) {
      const { data: updatedData, error: updateError } = await supabase
        .from('notification_preferences')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .maybeSingle()

      if (updateError) {
        console.error('[POST /api/notifications/settings] Update error:', updateError)
        return NextResponse.json({
          error: 'Failed to update notification preferences in database',
          details: updateError.message,
          code: updateError.code,
        }, { status: 500 })
      }

      return NextResponse.json(updatedData || payload)
    } else {
      const { data: insertedData, error: insertError } = await supabase
        .from('notification_preferences')
        .insert(payload)
        .select()
        .maybeSingle()

      if (insertError) {
        console.error('[POST /api/notifications/settings] Insert error:', insertError)
        return NextResponse.json({
          error: 'Failed to insert notification preferences into database. Confirm notification_preferences table exists in Supabase.',
          details: insertError.message,
          code: insertError.code,
        }, { status: 500 })
      }

      return NextResponse.json(insertedData || payload)
    }
  } catch (err: any) {
    console.error('[POST /api/notifications/settings] Exception:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
