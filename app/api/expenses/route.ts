import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('expenses')
      .select(`*, category:categories(*)`)
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const json = await request.json()
    const { amount, note, date, category_id, account_id } = json

    // The composite FK (user_id, account_id) already makes it impossible to
    // attach a transaction to someone else's account, but check here so a bad
    // id returns a clear message instead of a constraint violation.
    let resolvedAccountId: string | null = account_id ?? null

    if (resolvedAccountId) {
      const { data: account } = await supabase
        .from('accounts').select('id')
        .eq('id', resolvedAccountId).eq('user_id', user.id).maybeSingle()
      if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 400 })
    } else {
      // Fall back to the default account rather than writing an unassigned row.
      // A client running cached JS from before the account picker shipped sends
      // no account_id, and those rows are what produced the "Unassigned" bucket.
      const { data: fallback } = await supabase
        .from('accounts').select('id')
        .eq('user_id', user.id).eq('is_default', true).maybeSingle()
      resolvedAccountId = fallback?.id ?? null
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert({ amount, note, date, category_id, account_id: resolvedAccountId, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
