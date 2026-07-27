import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { zonedDateString, startOfZonedDay, endOfZonedDayExclusive, zonedDayStart, addDays } from '@/lib/dates'

export async function GET() {
  const t0 = performance.now()
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const tAuth = performance.now()

    // All day boundaries are IST (see lib/dates.ts), not the server's UTC day.
    const now = new Date()
    const todayStr = zonedDateString(now)
    const dayStart = startOfZonedDay(now)
    const dayEnd = endOfZonedDayExclusive(now)

    // Streak window: consecutive days up to today/yesterday with an expense.
    const streakWindowStart = zonedDayStart(addDays(todayStr, -364))

    // These three queries are independent of each other. They used to be three
    // sequential `await`s, so the endpoint cost three Supabase round-trips
    // before the ring could render; now it costs one.
    const [todayRes, categoriesRes, streakRes] = await Promise.all([
      // Today's total spend (across all categories)
      supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', dayStart.toISOString())
        .lt('date', dayEnd.toISOString()),
      // Total daily budget (sum of all category daily_budget)
      supabase
        .from('categories')
        .select('daily_budget')
        .eq('user_id', user.id)
        .not('daily_budget', 'is', null),
      // Dates only — the payload stays small even over a full year.
      supabase
        .from('expenses')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', streakWindowStart.toISOString())
        .order('date', { ascending: false }),
    ])
    const tQueries = performance.now()

    const spentToday = todayRes.data?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
    const totalDailyBudget = categoriesRes.data?.reduce((sum, c) => sum + Number(c.daily_budget), 0) || 0
    const allExpenses = streakRes.data

    // Bucket each expense into the IST calendar day it belongs to.
    const datesWithExpenses = new Set<string>()
    allExpenses?.forEach(e => {
      datesWithExpenses.add(zonedDateString(new Date(e.date)))
    })

    // Walk backward from today, counting consecutive days.
    // If today has no expense yet (it might be early in the day),
    // start from yesterday — don't break the streak prematurely.
    //
    // Stepping the date *label* rather than mutating a Date avoids the previous
    // mix of server-local `setDate` arithmetic with UTC formatting.
    let currentStreak = 0
    const checkFrom = datesWithExpenses.has(todayStr) ? 0 : 1 // start offset in days

    for (let i = checkFrom; i < 365; i++) {
      if (datesWithExpenses.has(addDays(todayStr, -i))) {
        currentStreak++
      } else {
        break
      }
    }

    const res = NextResponse.json({
      spentToday,
      totalDailyBudget,
      currentStreak,
      hasExpensesToday: datesWithExpenses.has(todayStr),
    })

    // Visible in the browser's Network tab under the request's Timing panel, so
    // the split between "waiting on Supabase auth" and "waiting on data" can be
    // read off a real load instead of guessed at.
    const end = performance.now()
    res.headers.set(
      'Server-Timing',
      [
        `auth;dur=${(tAuth - t0).toFixed(1)}`,
        `queries;dur=${(tQueries - tAuth).toFixed(1)}`,
        `streak;dur=${(end - tQueries).toFixed(1)}`,
        `total;dur=${(end - t0).toFixed(1)}`,
      ].join(', ')
    )
    return res
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
