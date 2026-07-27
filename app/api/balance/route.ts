import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const json = await request.json()
    const { amount, note, type, date, account_id } = json

    if (account_id) {
      const { data: account } = await supabase
        .from('accounts').select('id')
        .eq('id', account_id).eq('user_id', user.id).maybeSingle()
      if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 400 })
    }

    const insertData: Record<string, any> = {
      amount, note, type, user_id: user.id, account_id: account_id ?? null,
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
