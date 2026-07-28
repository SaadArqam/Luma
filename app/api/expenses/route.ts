import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { resolveAccountForWrite } from '@/lib/accounts'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const accountId = new URL(request.url).searchParams.get('account_id')

    let query = supabase
      .from('expenses')
      .select(`*, category:categories(*)`)
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (accountId) query = query.eq('account_id', accountId)

    const { data, error } = await query

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

    const resolved = await resolveAccountForWrite(supabase, user.id, account_id)
    if ('error' in resolved) return NextResponse.json({ error: resolved.error }, { status: 400 })

    const { data, error } = await supabase
      .from('expenses')
      .insert({ amount, note, date, category_id, account_id: resolved.accountId, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
