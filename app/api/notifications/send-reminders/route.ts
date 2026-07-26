import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { sendPushToUser } from '@/lib/sendPush'

export async function GET(req: Request) {
  return handleReminders(req)
}

export async function POST(req: Request) {
  return handleReminders(req)
}

async function handleReminders(req: Request) {
  // Protect cron route with secret header check
  const authHeader = req.headers.get('authorization')
  const cronSecretHeader = req.headers.get('x-cron-secret')
  const expectedSecret = process.env.CRON_SECRET

  if (
    expectedSecret &&
    authHeader !== `Bearer ${expectedSecret}` &&
    cronSecretHeader !== expectedSecret
  ) {
    return NextResponse.json({ error: 'Unauthorized cron trigger' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // 1. Query all users with daily_reminder_enabled = true
    const { data: prefs, error } = await supabase
      .from('notification_preferences')
      .select('user_id, daily_reminder_time, timezone')
      .eq('daily_reminder_enabled', true)

    if (error || !prefs) {
      return NextResponse.json({ processed: 0, sent: 0 })
    }

    let sentCount = 0

    for (const pref of prefs) {
      const timezone = pref.timezone || 'Asia/Kolkata'
      const targetTime = pref.daily_reminder_time || '20:00' // 'HH:MM'

      const now = new Date()
      const localTimeString = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now)

      const localDateString = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(now)

      const [targetH, targetM] = targetTime.split(':').map(Number)
      const [currentH, currentM] = localTimeString.split(':').map(Number)

      const targetMinOfDay = targetH * 60 + targetM
      const currentMinOfDay = currentH * 60 + currentM
      const diff = Math.abs(currentMinOfDay - targetMinOfDay)

      // Match within a 14-minute window (since cron runs every 15 minutes)
      if (diff <= 14) {
        // Check if user has logged any expense today in their local timezone
        const { count } = await supabase
          .from('expenses')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', pref.user_id)
          .eq('date', localDateString)

        if (!count || count === 0) {
          const res = await sendPushToUser(pref.user_id, {
            title: 'Anything to log today?',
            body: "You haven't added an expense yet — takes 10 seconds.",
            data: { url: '/' },
            tag: 'daily-reminder',
          })
          if (res.success) sentCount++
        }
      }
    }

    return NextResponse.json({ processed: prefs.length, sent: sentCount })
  } catch (err: any) {
    console.error('Send reminders error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
