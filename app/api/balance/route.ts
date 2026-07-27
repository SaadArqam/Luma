import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const json = await request.json()
    const { amount, note, type, date, account_id } = json

    let resolvedAccountId: string | null = account_id ?? null

    if (resolvedAccountId) {
      const { data: account } = await supabase
        .from('accounts').select('id')
        .eq('id', resolvedAccountId).eq('user_id', user.id).maybeSingle()
      if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 400 })
    } else {
      // Fall back to the default account rather than writing an unassigned row
      // (see the same note in /api/expenses).
      const { data: fallback } = await supabase
        .from('accounts').select('id')
        .eq('user_id', user.id).eq('is_default', true).maybeSingle()
      resolvedAccountId = fallback?.id ?? null
    }

    const insertData: Record<string, any> = {
      amount, note, type, user_id: user.id, account_id: resolvedAccountId,
    }
    if (date) {
      insertData.created_at = new Date(date).toISOString()
    }

    const { data, error } = await supabase
      .from('balance_entries')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
