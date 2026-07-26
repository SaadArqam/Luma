import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ tip: null })
    }

    const todayStr = new Date().toISOString().split('T')[0]

    // 1. Check if tip already exists for this user for today's date
    const { data: existingRow } = await supabase
      .from('daily_tips')
      .select('tip_text')
      .eq('user_id', user.id)
      .eq('date', todayStr)
      .maybeSingle()

    if (existingRow?.tip_text) {
      return NextResponse.json({ tip: existingRow.tip_text })
    }

    // 2. Gather user's data for today / this week
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

    const [todayExpRes, budgetRes, weekExpRes] = await Promise.all([
      supabase
        .from('expenses')
        .select('amount, category:categories(name)')
        .eq('user_id', user.id)
        .eq('date', todayStr),
      supabase
        .from('categories')
        .select('daily_budget')
        .eq('user_id', user.id)
        .not('daily_budget', 'is', null),
      supabase
        .from('expenses')
        .select('amount, category:categories(name)')
        .eq('user_id', user.id)
        .gte('date', sevenDaysAgo),
    ])

    const todayExpenses = todayExpRes.data || []
    const spentToday = todayExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

    const budgetCategories = budgetRes.data || []
    const totalDailyBudget = budgetCategories.reduce((sum, b) => sum + Number(b.daily_budget), 0)

    const weekExpenses = weekExpRes.data || []
    const categoryTotals: Record<string, number> = {}
    weekExpenses.forEach((e: any) => {
      const catName = e.category?.name || 'Uncategorized'
      categoryTotals[catName] = (categoryTotals[catName] || 0) + Number(e.amount)
    })

    let topCategory = ''
    let topCategoryAmt = 0
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > topCategoryAmt) {
        topCategoryAmt = amt
        topCategory = cat
      }
    })

    const promptSummary = `Date: ${todayStr}. Spent today: ₹${spentToday}. Daily budget limit: ${totalDailyBudget > 0 ? `₹${totalDailyBudget}` : 'No limit set'}. Top category this week: ${topCategory ? `${topCategory} (₹${topCategoryAmt})` : 'None'}.`

    const systemPrompt = 'You are a quiet, observational daily nudge for a personal finance app. Given this user\'s spending data, write ONE short sentence (under 15 words) noting something true and specific about their day/week. Tone: warm, observational, never preachy or congratulatory-corporate. Never give generic advice like "track your spending." Reference an actual number or pattern from the data given.'

    let tipText = ''

    // 3. Call AI provider (Groq or Anthropic)
    if (process.env.GROQ_API_KEY) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
            max_tokens: 60,
            temperature: 0.7,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: promptSummary },
            ],
          }),
        })
        const aiData = await res.json()
        tipText = aiData.choices?.[0]?.message?.content?.trim()?.replace(/^["']|["']$/g, '') || ''
      } catch (err) {
        console.error('Groq AI error:', err)
      }
    } else if (process.env.ANTHROPIC_API_KEY) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 60,
            system: systemPrompt,
            messages: [{ role: 'user', content: promptSummary }],
          }),
        })
        const aiData = await res.json()
        tipText = aiData.content?.[0]?.text?.trim()?.replace(/^["']|["']$/g, '') || ''
      } catch (err) {
        console.error('Anthropic AI error:', err)
      }
    }

    // Fallback if AI call failed
    if (!tipText) {
      if (spentToday === 0) {
        tipText = `Zero expenses logged so far today.`
      } else if (totalDailyBudget > 0 && spentToday <= totalDailyBudget) {
        tipText = `₹${spentToday.toLocaleString('en-IN')} logged today, keeping you right on target.`
      } else if (topCategory) {
        tipText = `${topCategory} has been your highest expense category this week.`
      } else {
        tipText = `₹${spentToday.toLocaleString('en-IN')} recorded across your categories today.`
      }
    }

    // 4. Store tip in database for today
    try {
      await supabase.from('daily_tips').insert({
        user_id: user.id,
        date: todayStr,
        tip_text: tipText,
      })
    } catch (dbErr) {
      console.error('Failed to cache daily tip in DB:', dbErr)
    }

    return NextResponse.json({ tip: tipText })
  } catch (error: any) {
    console.error('Daily tip error:', error)
    return NextResponse.json({ tip: null }, { status: 500 })
  }
}
