import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { sendPushToUser } from '@/lib/sendPush'

// NOTE: Currently configured for single-timezone (Asia/Kolkata ~ 9:30 PM IST).
// Once multi-region/non-IST users are added, this route should compute per-user local time.

export async function GET(req: Request) {
  return handleEodSummary(req)
}

export async function POST(req: Request) {
  return handleEodSummary(req)
}

async function handleEodSummary(req: Request) {
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

    // 1. Query all users where eod_summary_enabled = true
    const { data: prefs, error } = await supabase
      .from('notification_preferences')
      .select('user_id, timezone')
      .eq('eod_summary_enabled', true)

    if (error || !prefs) {
      return NextResponse.json({ processed: 0, sent: 0 })
    }

    let sentCount = 0

    for (const pref of prefs) {
      const timezone = pref.timezone || 'Asia/Kolkata'
      const now = new Date()
      const localDateString = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(now)

      // Fetch today's expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', pref.user_id)
        .eq('date', localDateString)

      const spentToday = (expenses || []).reduce((sum, e) => sum + Number(e.amount), 0)

      // Fetch daily budget limit total
      const { data: categories } = await supabase
        .from('categories')
        .select('daily_budget')
        .eq('user_id', pref.user_id)
        .not('daily_budget', 'is', null)

      const totalBudget = (categories || []).reduce((sum, c) => sum + Number(c.daily_budget), 0)

      let bodyText = ''
      if (spentToday === 0) {
        bodyText = '₹0 spent today — quiet one'
      } else if (totalBudget > 0) {
        const remaining = totalBudget - spentToday
        if (remaining >= 0) {
          bodyText = `₹${spentToday.toLocaleString('en-IN')} spent today, ₹${remaining.toLocaleString('en-IN')} left in budget`
        } else {
          bodyText = `₹${spentToday.toLocaleString('en-IN')} spent today, ₹${Math.abs(remaining).toLocaleString('en-IN')} over budget`
        }
      } else {
        bodyText = `₹${spentToday.toLocaleString('en-IN')} spent today`
      }

      const res = await sendPushToUser(pref.user_id, {
        title: "Today's summary",
        body: bodyText,
        data: { url: '/' },
        tag: 'eod-summary',
      })

      if (res.success) sentCount++
    }

    return NextResponse.json({ processed: prefs.length, sent: sentCount })
  } catch (err: any) {
    console.error('EOD summary error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
