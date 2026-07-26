import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]
    const dayStart = startOfDay(now)
    const dayEnd = endOfDay(now)

    // Today's total spend (across all categories)
    const { data: todayExpenses } = await supabase
      .from('expenses')
      .select('amount, date')
      .eq('user_id', user.id)
      .gte('date', dayStart.toISOString())
      .lte('date', dayEnd.toISOString())

    const spentToday = todayExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0

    // Total daily budget (sum of all category daily_budget)
    const { data: categories } = await supabase
      .from('categories')
      .select('daily_budget')
      .eq('user_id', user.id)
      .not('daily_budget', 'is', null)

    const totalDailyBudget = categories?.reduce((sum, c) => sum + Number(c.daily_budget), 0) || 0

    // Current streak — consecutive days up to today/yesterday with at least one expense
    // Fetch last 365 days of expense dates
    const yearAgo = new Date()
    yearAgo.setFullYear(yearAgo.getFullYear() - 1)

    const { data: allExpenses } = await supabase
      .from('expenses')
      .select('date')
      .eq('user_id', user.id)
      .gte('date', yearAgo.toISOString())
      .order('date', { ascending: false })

    // Build a set of unique date strings that have expenses
    const datesWithExpenses = new Set<string>()
    allExpenses?.forEach(e => {
      const d = new Date(e.date).toISOString().split('T')[0]
      datesWithExpenses.add(d)
    })

    // Walk backward from today, counting consecutive days
    // If today has no expense yet (it might be early in the day), 
    // start from yesterday — don't break the streak prematurely
    let currentStreak = 0
    const checkFrom = datesWithExpenses.has(todayStr) ? 0 : 1 // start offset in days

    for (let i = checkFrom; i < 365; i++) {
      const checkDate = new Date(now)
      checkDate.setDate(now.getDate() - i)
      const checkStr = checkDate.toISOString().split('T')[0]
      if (datesWithExpenses.has(checkStr)) {
        currentStreak++
      } else {
        break
      }
    }

    return NextResponse.json({
      spentToday,
      totalDailyBudget,
      currentStreak,
      hasExpensesToday: datesWithExpenses.has(todayStr),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
